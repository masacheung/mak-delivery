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
    const { pickUpLocation, pickUpDate, message, etaMinutes } = req.body;

    if (!pickUpLocation || typeof pickUpLocation !== "string" || !pickUpLocation.trim()) {
      return res.status(400).json({ error: "pickUpLocation is required" });
    }
    if (!pickUpDate || typeof pickUpDate !== "string" || !pickUpDate.trim()) {
      return res.status(400).json({ error: "pickUpDate is required (YYYY-MM-DD)" });
    }

    const loc = pickUpLocation.trim();
    const dateStr = pickUpDate.trim().slice(0, 10);

    const ordersResult = await pool.query(
      `SELECT DISTINCT username FROM orders
       WHERE pick_up_location = $1
         AND pick_up_date::date = $2::date`,
      [loc, dateStr]
    );

    const usernames = ordersResult.rows.map((r) => r.username).filter(Boolean);
    if (usernames.length === 0) {
      return res.status(200).json({
        success: true,
        sent: 0,
        usernames: [],
        message: "No orders found for that date and pickup location.",
      });
    }

    const msg = message && String(message).trim() ? String(message).trim() : null;

    let eta = null;
    if (etaMinutes != null && etaMinutes !== "") {
      const m = parseInt(etaMinutes, 10);
      if (Number.isNaN(m) || m < 0 || m > 24 * 60) {
        return res.status(400).json({
          error: "etaMinutes must be an integer from 0 to 1440 (minutes in a day)",
        });
      }
      eta = m === 0 ? "Arriving now (ETA 0 min)" : `ETA: ${m} minute${m === 1 ? "" : "s"}`;
    }

    let inserted = 0;
    for (const username of usernames) {
      await pool.query(
        `INSERT INTO delivery_notifications
         (username, pick_up_location, pick_up_date, message, eta_summary, distance_km, admin_lat, admin_lng)
         VALUES ($1, $2, $3::date, $4, $5, NULL, NULL, NULL)`,
        [username, loc, dateStr, msg, eta]
      );
      inserted += 1;
    }

    res.json({
      success: true,
      sent: inserted,
      usernames,
      message: `Notification sent to ${inserted} user(s).`,
    });
  } catch (e) {
    console.error("admin notify-pickup:", e);
    res.status(500).json({ error: "Failed to send notifications" });
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
