const express = require('express');
const pool = require('../db/connection');
const { requireUserAuth } = require('../middleware/authMiddleware');
const { pushConfigured } = require('../services/notificationQueue');
const router = express.Router();
router.get('/config', (_req, res) => res.json({ enabled: pushConfigured(), publicKey: process.env.VAPID_PUBLIC_KEY || null }));
router.use(requireUserAuth);
const handle = fn => (req, res) => Promise.resolve(fn(req, res)).catch(error => {
  console.error('Push settings:', error.code || error.message);
  res.status(error.code === '42P01' ? 503 : 500).json({ error: error.code === '42P01' ? 'Notifications are not set up yet.' : 'Unable to save notification settings.' });
});
router.get('/preferences', handle(async (req, res) => {
  const { rows } = await pool.query('SELECT pickup,events FROM notification_preferences WHERE username=$1', [req.authUser.username]);
  res.json(rows[0] || { pickup: true, events: true });
}));
router.put('/preferences', handle(async (req, res) => {
  const { pickup, events } = req.body;
  if (typeof pickup !== 'boolean' || typeof events !== 'boolean') return res.status(400).json({ error: 'Invalid preferences.' });
  await pool.query(`INSERT INTO notification_preferences(username,pickup,events) VALUES($1,$2,$3) ON CONFLICT(username) DO UPDATE SET pickup=$2,events=$3`, [req.authUser.username, pickup, events]);
  res.json({ pickup, events });
}));
function validSubscription(subscription) {
  try {
    const url = new URL(subscription.endpoint);
    const allowed = ['fcm.googleapis.com', 'push.services.mozilla.com', 'push.apple.com', 'notify.windows.com'];
    return url.protocol === 'https:' && !url.username && !url.password && !url.port && allowed.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))
      && /^[\w-]+={0,2}$/.test(subscription.keys.p256dh) && Buffer.from(subscription.keys.p256dh, 'base64url').length === 65
      && /^[\w-]+={0,2}$/.test(subscription.keys.auth) && Buffer.from(subscription.keys.auth, 'base64url').length === 16;
  } catch { return false; }
}
router.post('/subscriptions', handle(async (req, res) => {
  if (!pushConfigured()) return res.status(503).json({ error: 'Mobile notifications are not enabled on the server yet.' });
  if (!validSubscription(req.body)) return res.status(400).json({ error: 'Invalid push subscription.' });
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM push_subscriptions WHERE username=$1 AND endpoint<>$2', [req.authUser.username, req.body.endpoint]);
  if (rows[0].count >= 10) return res.status(400).json({ error: 'Maximum of 10 notification devices per account.' });
  await pool.query(`INSERT INTO push_subscriptions(endpoint,username,subscription) VALUES($1,$2,$3::jsonb)
    ON CONFLICT(endpoint) DO UPDATE SET username=$2,subscription=$3::jsonb,updated_at=NOW()`, [req.body.endpoint, req.authUser.username, JSON.stringify(req.body)]);
  res.json({ success: true });
}));
router.delete('/subscriptions', handle(async (req, res) => {
  await pool.query('DELETE FROM push_subscriptions WHERE username=$1 AND endpoint=$2', [req.authUser.username, req.body.endpoint]);
  res.json({ success: true });
}));
module.exports = router;
module.exports.validSubscription = validSubscription;
