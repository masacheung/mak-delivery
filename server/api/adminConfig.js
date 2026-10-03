const express = require("express");
const router = express.Router();
const pool = require("../db/connection.js");
const { requireAdminAuth } = require("../middleware/authMiddleware.js");
const { getDeliveryDate } = require('../utils/deliveryDate');
const { queueEvent } = require('../services/notificationQueue');

router.post("/", requireAdminAuth, async (req, res) => {
  const { locations, date, restaurants, notifySubscribers = false } = req.body;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !Array.isArray(locations) || !locations.length || !locations.every(item => typeof item === 'string') || !Array.isArray(restaurants) || !restaurants.length || !restaurants.every(item => typeof item === 'string') || typeof notifySubscribers !== 'boolean') return res.status(400).json({ error: 'Choose a date, pickup locations and restaurants.' });

  let db;
  try {
    db = await pool.connect();
    await db.query('BEGIN');
    const result = await db.query(
      "INSERT INTO admin_config (pick_up_date, pick_up_locations, restaurants) VALUES ($1, $2, $3) RETURNING *",
      [date, locations, restaurants]
    );

    if (notifySubscribers) await queueEvent({ ...result.rows[0], pick_up_date: date }, req.authUser.username, db);
    await db.query('COMMIT');
    res.status(201).json({ message: notifySubscribers ? 'Event opened. Subscriber announcement queued.' : 'Event submitted', event: result.rows[0] });
  } catch (error) {
    if (db) await db.query('ROLLBACK');
    console.error("Error saving event:", error);
    res.status(error.code === '42P01' ? 503 : 500).json({ error: error.code === '42P01' ? 'Apply notification migration 003 before sending announcements.' : 'Unable to create event.' });
  } finally { if (db) db.release(); }
});

router.get("/", async (req, res) => {
  const todayDate = getDeliveryDate();

  try {
    const result = await pool.query(
      "SELECT * FROM admin_config WHERE pick_up_date >= $1 ORDER BY pick_up_date ASC",
      [todayDate]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/openEvents", async (req, res) => {
  const { date } = req.query;

  try {
    const result = await pool.query("SELECT * FROM admin_config WHERE pick_up_date = $1", [date]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
