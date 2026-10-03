require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const pool = require('./db/connection');
const { dispatchDueJobs, dispatchPush } = require('./services/notificationQueue');
let running = false;
async function tick() {
  if (running) return;
  running = true;
  try {
    await pool.query(`INSERT INTO notification_worker_state(id,last_seen_at) VALUES(1,NOW()) ON CONFLICT(id) DO UPDATE SET last_seen_at=NOW()`);
    await dispatchDueJobs(); await dispatchPush();
    await pool.query('DELETE FROM login_sessions WHERE expires_at<NOW()');
  } catch (error) { console.error('Notification worker:', error.code || error.message); }
  finally { running = false; }
}
tick();
const timer = setInterval(tick, 20000);
async function stop() { clearInterval(timer); while (running) await new Promise(resolve => setTimeout(resolve, 100)); await pool.end(); process.exit(0); }
process.on('SIGTERM', stop); process.on('SIGINT', stop);
