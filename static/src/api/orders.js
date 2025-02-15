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

// GET: Fetch order by wechat_id and order_id
router.get("/", async (req, res) => {
  const { wechatId, orderId } = req.query;

  if (!wechatId || !orderId) {
    return res.status(400).json({ error: "WeChat ID and Order ID are required." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE wechat_id = $1 AND id = $2",
      [wechatId, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    const order = result.rows[0];

    // Ensure order_details is parsed correctly if stored as JSON
    if (typeof order.order_details === "string") {
      order.order_details = JSON.parse(order.order_details);
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
