const express = require("express");
const router = express.Router();
const pool = require("../db/connection.js"); // PostgreSQL connection

router.post("/", async (req, res) => {
  const { wechatId, pickupLocation, date, orderDetails, total } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO orders (wechat_id, pick_up_location, pick_up_date, order_details, total) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [wechatId, pickupLocation, date, orderDetails, total]
    );

    res.status(201).json({ message: "Order submitted", order: result.rows[0] });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
