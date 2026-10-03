const pool = require('../db/connection');
const webpush = require('web-push');
function pushConfigured() { return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT); }

async function queueEvent(event, username, db = pool) {
  const date = String(event.pick_up_date).slice(0, 10);
  await db.query(`INSERT INTO notification_jobs(dedupe_key,kind,pick_up_date,pick_up_location,send_at,message,created_by)
    VALUES($1,'event',$2,$3,NOW(),$4,$5) ON CONFLICT(dedupe_key) DO NOTHING`,
    [`event:${event.id}`, date, event.pick_up_locations.join(' · '), `新一期開單啦！${date} 可於 ${event.pick_up_locations.join('、')} 取餐。撳入嚟睇餐廳。`, username]);
}

async function dispatchDueJobs() {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const { rows } = await db.query(`SELECT * FROM notification_jobs WHERE status='pending' AND send_at <= NOW() ORDER BY send_at FOR UPDATE SKIP LOCKED LIMIT 20`);
    for (const job of rows) {
      if (job.kind === 'pickup' && job.arrival_at && new Date(job.arrival_at).getTime() + 30 * 60000 < Date.now()) {
        await db.query(`UPDATE notification_jobs SET status='cancelled' WHERE id=$1`, [job.id]); continue;
      }
      const remaining = job.arrival_at ? Math.max(0, Math.ceil((new Date(job.arrival_at).getTime() - Date.now()) / 60000)) : null;
      const message = job.kind === 'pickup' && job.arrival_at ? `${remaining ? `預計 ${remaining} 分鐘後到達` : '即將到達'} ${job.pick_up_location}，請準備取餐。${job.message ? ` ${job.message}` : ''}` : job.message;
      const recipients = job.kind === 'pickup'
        ? await db.query(`SELECT DISTINCT o.username FROM orders o LEFT JOIN notification_preferences p ON p.username=o.username WHERE o.pick_up_date::date=$1 AND o.pick_up_location=$2 AND COALESCE(p.pickup,TRUE)`, [job.pick_up_date, job.pick_up_location])
        : await db.query(`SELECT u.username FROM users u LEFT JOIN notification_preferences p ON p.username=u.username WHERE u.is_verified=TRUE AND COALESCE(p.events,TRUE)`);
      for (const { username } of recipients.rows) {
        const { rows: notices } = await db.query(`INSERT INTO delivery_notifications(username,pick_up_location,pick_up_date,message,eta_summary,job_id,kind)
          VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(job_id,username) DO NOTHING RETURNING id`,
          [username, job.pick_up_location, job.pick_up_date, message, job.arrival_at ? `預計到達 ${new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }).format(new Date(job.arrival_at))}` : null, job.id, job.kind]);
        if (!notices.length) continue;
        const payload = JSON.stringify({ title: job.kind === 'pickup' ? 'Mak Delivery · 取餐提醒' : 'Mak Delivery · 新開單', body: message, tag: `mak-notice-${notices[0].id}`, url: job.kind === 'event' ? '/restaurants' : '/' });
        await db.query(`INSERT INTO notification_push_outbox(notification_id,endpoint,payload)
          SELECT $1,endpoint,$2::jsonb FROM push_subscriptions WHERE username=$3 ON CONFLICT DO NOTHING`, [notices[0].id, payload, username]);
      }
      await db.query(`UPDATE notification_jobs SET status='sent',sent_at=NOW() WHERE id=$1`, [job.id]);
    }
    await db.query('COMMIT');
  } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
}

async function dispatchPush() {
  if (!pushConfigured()) return;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  for (let batch = 0; batch < 50; batch++) {
  const { rows } = await pool.query(`WITH due AS (
    SELECT notification_id,endpoint FROM notification_push_outbox
    WHERE status IN ('pending','processing') AND next_attempt_at<=NOW() AND attempts<5
    ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
  ) UPDATE notification_push_outbox o SET status='processing',attempts=o.attempts+1,next_attempt_at=NOW()+INTERVAL '2 minutes'
    FROM due d WHERE o.notification_id=d.notification_id AND o.endpoint=d.endpoint RETURNING o.*`);
  if (!rows.length) break;
  await pool.query(`INSERT INTO notification_worker_state(id,last_seen_at) VALUES(1,NOW()) ON CONFLICT(id) DO UPDATE SET last_seen_at=NOW()`);
  for (const item of rows) {
    try {
      const { rows: subscriptions } = await pool.query(`SELECT s.subscription FROM push_subscriptions s
        JOIN delivery_notifications n ON n.username=s.username AND n.id=$2
        LEFT JOIN notification_preferences p ON p.username=s.username
        WHERE s.endpoint=$1 AND COALESCE(CASE n.kind WHEN 'event' THEN p.events ELSE p.pickup END,TRUE)`, [item.endpoint, item.notification_id]);
      if (!subscriptions.length) {
        await pool.query('DELETE FROM notification_push_outbox WHERE notification_id=$1 AND endpoint=$2', [item.notification_id, item.endpoint]); continue;
      }
      await webpush.sendNotification(subscriptions[0].subscription, JSON.stringify(item.payload), { TTL: 900, timeout: 10000 });
      await pool.query(`UPDATE notification_push_outbox SET status='sent',last_error=NULL WHERE notification_id=$1 AND endpoint=$2`, [item.notification_id, item.endpoint]);
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await pool.query('DELETE FROM push_subscriptions WHERE endpoint=$1', [item.endpoint]);
      } else {
        await pool.query(`UPDATE notification_push_outbox SET status=$3,last_error=$4,next_attempt_at=NOW()+INTERVAL '1 minute' WHERE notification_id=$1 AND endpoint=$2`, [item.notification_id, item.endpoint, item.attempts >= 5 ? 'failed' : 'pending', `Push provider error ${error.statusCode || 'network'}`]);
      }
    }
  }
  }
}

module.exports = { pushConfigured, queueEvent, dispatchDueJobs, dispatchPush };
