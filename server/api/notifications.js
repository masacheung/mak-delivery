const express = require("express");
const router = express.Router();
const pool = require("../db/connection.js");
const { requireUserAuth, requireAdminAuth } = require("../middleware/authMiddleware.js");

/** Customer-facing notifications: only the last 24 hours (server time). */
const RECENT_SQL = "created_at >= NOW() - INTERVAL '1 day'";

/**
 * POST /api/notifications/admin/notify-pickup
 * Notify all distinct users with an order on pickUpDate at pickUpLocation.
 */
router.post("/admin/notify-pickup", requireAdminAuth, async (req, res) => {
  try {
    const { pickUpLocation, pickUpDate, message = '', etaMinutes } = req.body;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(pickUpDate || '') || typeof pickUpLocation !== 'string' || !pickUpLocation.trim() || typeof message !== 'string' || message.length > 500) return res.status(400).json({ error: 'Choose a date, location and message under 500 characters.' });
    const eta = etaMinutes == null || etaMinutes === '' ? null : Number(etaMinutes);
    if (eta !== null && (!Number.isInteger(eta) || eta < 0 || eta > 1440)) return res.status(400).json({ error: 'ETA must be 0–1440 whole minutes.' });
    const notice = message.trim() || (eta === null ? '請留意取餐安排。' : eta === 0 ? '即將到達，請準備取餐。' : '預計 '+eta+' 分鐘後到達，請準備取餐。');
    await pool.query(`INSERT INTO notification_jobs(dedupe_key,kind,pick_up_date,pick_up_location,send_at,message,created_by) VALUES($1,'pickup',$2,$3,NOW(),$4,$5)`, ['manual:'+require('crypto').randomUUID(),pickUpDate,pickUpLocation.trim(),notice,req.authUser.username]);
    res.json({ success: true, message: 'Notification queued for customers at this pickup. Delivery requires the notification worker.' });
  } catch (e) {
    res.status(e.code === '42P01' ? 503 : 500).json({ error: e.code === '42P01' ? 'Apply notification migration 003 first.' : 'Unable to queue notification.' });
  }
});

/**
 * GET /api/notifications/admin/order-phones?pick_up_date=YYYY-MM-DD&pick_up_location=...
 * Distinct account phone numbers for users with an order that day at that pickup (for manual SMS).
 */
router.get("/admin/order-phones", requireAdminAuth, async (req, res) => {
  try {
    const pickUpLocation = req.query.pick_up_location;
    const pickUpDate = req.query.pick_up_date;

    if (!pickUpLocation || typeof pickUpLocation !== "string" || !pickUpLocation.trim()) {
      return res.status(400).json({ error: "pick_up_location is required" });
    }
    if (!pickUpDate || typeof pickUpDate !== "string" || !pickUpDate.trim()) {
      return res.status(400).json({ error: "pick_up_date is required (YYYY-MM-DD)" });
    }

    const loc = pickUpLocation.trim();
    const dateStr = pickUpDate.trim().slice(0, 10);

    const r = await pool.query(
      `SELECT DISTINCT u.phone_number AS phone
       FROM orders o
       INNER JOIN users u ON u.username = o.username
       WHERE o.pick_up_location = $1
         AND o.pick_up_date::date = $2::date
         AND u.phone_number IS NOT NULL
         AND TRIM(u.phone_number) <> ''
       ORDER BY u.phone_number`,
      [loc, dateStr]
    );

    const phones = r.rows.map((row) => row.phone).filter(Boolean);
    const phonesComma = phones.join(", ");
    const phonesLines = phones.join("\n");

    res.json({
      count: phones.length,
      phones,
      phonesComma,
      phonesLines,
    });
  } catch (e) {
    console.error("admin order-phones:", e);
    res.status(500).json({ error: "Failed to load phone numbers" });
  }
});

router.get("/unread-count", requireUserAuth, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT COUNT(*)::int AS c FROM delivery_notifications
       WHERE username = $1 AND read_at IS NULL AND ${RECENT_SQL}`,
      [req.authUser.username]
    );
    const row = r.rows[0];
    res.json({ count: row && row.c != null ? row.c : 0 });
  } catch (e) {
    console.error("notifications unread-count:", e);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/", requireUserAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const r = await pool.query(
      `SELECT id, pick_up_location, pick_up_date, message, eta_summary, distance_km,
              admin_lat, admin_lng, read_at, created_at
       FROM delivery_notifications
       WHERE username = $1 AND ${RECENT_SQL}
       ORDER BY created_at DESC, id DESC
       LIMIT $2`,
      [req.authUser.username, limit]
    );
    res.json(r.rows);
  } catch (e) {
    console.error("notifications list:", e);
    res.status(500).json({ error: "Database error" });
  }
});

router.put("/:id/read", requireUserAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const r = await pool.query(
      `UPDATE delivery_notifications SET read_at = NOW()
       WHERE id = $1 AND username = $2 AND ${RECENT_SQL}
       RETURNING id`,
      [id, req.authUser.username]
    );
    if (r.rowCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json({ success: true });
  } catch (e) {
    console.error("notifications read:", e);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/mark-all-read", requireUserAuth, async (req, res) => {
  try {
    await pool.query(
      `UPDATE delivery_notifications SET read_at = NOW()
       WHERE username = $1 AND read_at IS NULL AND ${RECENT_SQL}`,
      [req.authUser.username]
    );
    res.json({ success: true });
  } catch (e) {
    console.error("notifications mark-all-read:", e);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
