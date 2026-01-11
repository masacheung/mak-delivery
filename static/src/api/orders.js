const express = require("express");
const router = express.Router();
const pool = require("../db/connection.js"); // PostgreSQL connection

router.post("/", async (req, res) => {
  const { username, pickupLocation, date, orderDetails, total, notes } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO orders (username, pick_up_location, pick_up_date, order_details, total, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [username, pickupLocation, date, orderDetails, total, notes]
    );

    res.status(201).json({ message: "Order submitted", order: result.rows[0] });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.put("/update/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { username, pickupLocation, date, orderDetails, total, notes } = req.body;

  try {
    const result = await pool.query(
      "UPDATE orders SET username = $1, pick_up_location = $2, pick_up_date = $3, order_details = $4, total = $5, notes = $6 WHERE id = $7 RETURNING *",
      [username, pickupLocation, date, orderDetails, total, notes, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order updated", order: result.rows[0] });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET: Fetch order by username and order_id
router.get("/", async (req, res) => {
  const { username, orderId } = req.query;

  if (!username || !orderId) {
    return res.status(400).json({ error: "Username and Order ID are required." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE username = $1 AND id = $2",
      [username, orderId]
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

// **NEW ROUTE: Search orders by pickup location and date**
router.get("/search", async (req, res) => {
  const { pick_up_location, pick_up_date, restaurantId, payment_status } = req.query;

  if (!pick_up_date) {
    return res.status(400).json({ error: "Date are required." });
  }

  // Build query dynamically based on filters
  let query = "SELECT * FROM orders WHERE pick_up_date = $1";
  const params = [pick_up_date];
  let paramIndex = 2;

  if (pick_up_location) {
    query += ` AND pick_up_location = $${paramIndex}`;
    params.push(pick_up_location);
    paramIndex++;
  }

  if (restaurantId) {
    query += ` AND order_details::jsonb ? $${paramIndex}`;
    params.push(restaurantId);
    paramIndex++;
  }

  if (payment_status && payment_status !== 'All') {
    query += ` AND payment_status = $${paramIndex}`;
    params.push(payment_status);
    paramIndex++;
  }

  query += " ORDER BY id ASC";

  try {
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }

    const orders = result.rows.map((order) => ({
      id: order.id,
      username: order.username,
      order_details: typeof order.order_details === "string" ? JSON.parse(order.order_details) : order.order_details,
      total: order.total,
      notes: order.notes,
      payment_status: order.payment_status || 'Unpaid'
    }));

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Update payment status for an order
router.put("/payment/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { payment_status } = req.body;

  const validStatuses = ['Unpaid', 'Zelle', 'Venmo', 'Cash'];
  
  if (!payment_status || !validStatuses.includes(payment_status)) {
    return res.status(400).json({ error: "Invalid payment status. Must be one of: Unpaid, Zelle, Venmo, Cash" });
  }

  try {
    const result = await pool.query(
      "UPDATE orders SET payment_status = $1 WHERE id = $2 RETURNING *",
      [payment_status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Payment status updated", order: result.rows[0] });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
