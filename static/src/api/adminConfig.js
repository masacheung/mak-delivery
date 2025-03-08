const express = require("express");
const router = express.Router();
const pool = require("../db/connection.js"); // PostgreSQL connection

router.post("/", async (req, res) => {
  const { locations, date, restaurants } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO admin_config (pick_up_date, pick_up_locations, restaurants) VALUES ($1, $2, $3) RETURNING *",
      [date, locations, restaurants]
    );

    res.status(201).json({ message: "Event submitted", event: result.rows[0] });
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ error: "Database error" });
  }
});


module.exports = router;
