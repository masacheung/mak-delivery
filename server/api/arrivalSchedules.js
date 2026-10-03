const express = require('express');
const pool = require('../db/connection');
const { requireAdminAuth } = require('../middleware/authMiddleware');
const { arrivalSchedule } = require('../utils/arrivalTime');
const { pushConfigured } = require('../services/notificationQueue');
const router = express.Router();
router.use(requireAdminAuth);
const handle = fn => (req, res) => Promise.resolve(fn(req, res)).catch(error => {
  console.error('Arrival schedules:', error.code || error.message);
  res.status(error.code === '42P01' ? 503 : 500).json({ error: error.code === '42P01' ? 'Apply notification migration 003 before scheduling reminders.' : 'Unable to update arrival reminders.' });
});
router.get('/', handle(async (req, res) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(req.query.date || '')) return res.status(400).json({ error: 'Choose a pickup date.' });
  const events = await pool.query('SELECT pick_up_locations FROM admin_config WHERE pick_up_date=$1', [req.query.date]);
  const locations = [...new Set(events.rows.flatMap(event => event.pick_up_locations))];
  const jobs = await pool.query(`SELECT id,pick_up_location,arrival_at,lead_minutes,send_at,status,sent_at,message FROM notification_jobs WHERE kind='pickup' AND pick_up_date=$1 ORDER BY arrival_at`, [req.query.date]);
  const worker = await pool.query(`SELECT last_seen_at, last_seen_at > NOW()-INTERVAL '90 seconds' AS active FROM notification_worker_state WHERE id=1`);
  res.json({ locations, schedules: jobs.rows, workerActive: Boolean(worker.rows[0]?.active), pushConfigured: pushConfigured(), timeZone: 'America/New_York' });
}));
router.post('/', handle(async (req, res) => {
  const { date, location, arrivalTime, leadMinutes = 15, message = '' } = req.body;
  let schedule;
  try { schedule = arrivalSchedule(date, arrivalTime, leadMinutes); }
  catch (error) { return res.status(400).json({ error: error.message }); }
  if (typeof location !== 'string' || typeof message !== 'string' || message.length > 500) return res.status(400).json({ error: 'Choose a location and keep the message under 500 characters.' });
  const events = await pool.query('SELECT pick_up_locations FROM admin_config WHERE pick_up_date=$1', [date]);
  if (!events.rows.some(event => event.pick_up_locations.includes(location))) return res.status(400).json({ error: 'This pickup location is not open on the selected date.' });
  const result = await pool.query(`INSERT INTO notification_jobs(dedupe_key,kind,pick_up_date,pick_up_location,arrival_at,lead_minutes,send_at,message,created_by)
    VALUES($1,'pickup',$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT(dedupe_key) DO UPDATE SET arrival_at=EXCLUDED.arrival_at,lead_minutes=EXCLUDED.lead_minutes,send_at=EXCLUDED.send_at,message=EXCLUDED.message,status='pending',created_by=EXCLUDED.created_by
    WHERE notification_jobs.status <> 'sent' RETURNING *`,
    [`pickup:${date}:${location}`, date, location, schedule.arrivalAt, schedule.leadMinutes, schedule.sendAt, message.trim(), req.authUser.username]);
  if (!result.rows.length) return res.status(409).json({ error: 'This reminder has already been sent. Use Send notification for another update.' });
  res.json({ success: true, schedule: result.rows[0] });
}));
router.delete('/:id', handle(async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Invalid reminder.' });
  const result = await pool.query(`UPDATE notification_jobs SET status='cancelled' WHERE id=$1 AND kind='pickup' AND status='pending' RETURNING id`, [req.params.id]);
  if (!result.rows.length) return res.status(409).json({ error: 'Reminder already sent or cancelled.' });
  res.json({ success: true });
}));
module.exports = router;
