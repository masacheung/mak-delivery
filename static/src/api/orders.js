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
  const { pick_up_location, pick_up_date, restaurantId } = req.query;

  if (!pick_up_date) {
    return res.status(400).json({ error: "Date are required." });
  }

  if (pick_up_location && restaurantId) {
    try {
      const result = await pool.query(
        "SELECT * FROM orders WHERE pick_up_location = $1 AND pick_up_date = $2 AND order_details::jsonb ? $3 ORDER BY id ASC",
        [pick_up_location, pick_up_date, restaurantId]
      );

      if (result.rows.length === 0) {
        return res.status(200).json({ message: "No orders found for the given criteria.", orders: [] });
      }

      const orders = result.rows.map((order) => ({
        id: order.id,
        username: order.username,
        order_details: typeof order.order_details === "string" ? JSON.parse(order.order_details) : order.order_details,
        total: order.total,
        notes: order.notes
      }));

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Database error" });
    }
  } else if (pick_up_location) {
      try {
          const result = await pool.query(
            "SELECT * FROM orders WHERE pick_up_location = $1 AND pick_up_date = $2 ORDER BY id ASC",
            [pick_up_location, pick_up_date]
          );

          if (result.rows.length === 0) {
            return res.status(200).json({ message: "No orders found for the given criteria.", orders: [] });
          }

          const orders = result.rows.map((order) => ({
            id: order.id,
            username: order.username,
            order_details: typeof order.order_details === "string" ? JSON.parse(order.order_details) : order.order_details,
            total: order.total,
            notes: order.notes
          }));

          res.json(orders);
        } catch (error) {
          console.error("Error fetching orders:", error);
          res.status(500).json({ error: "Database error" });
        }
  } else if (restaurantId) {
    try {
      const result = await pool.query(
        "SELECT * FROM orders WHERE order_details::jsonb ? $1 AND pick_up_date = $2 ORDER BY id ASC",
        [restaurantId, pick_up_date]
      );

      if (result.rows.length === 0) {
        return res.status(200).json({ message: "No orders found for the given criteria.", orders: [] });
      }

      const orders = result.rows.map((order) => ({
        id: order.id,
        username: order.username,
        order_details: typeof order.order_details === "string" ? JSON.parse(order.order_details) : order.order_details,
        total: order.total,
        notes: order.notes
      }));

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Database error" });
    }
  } else {
    try {
      const result = await pool.query(
        "SELECT * FROM orders WHERE pick_up_date = $1 ORDER BY id ASC",
        [pick_up_date]
      );

      if (result.rows.length === 0) {
        return res.status(200).json({ message: "No orders found for the given criteria.", orders: [] });
      }

      const orders = result.rows.map((order) => ({
        id: order.id,
        username: order.username,
        order_details: typeof order.order_details === "string" ? JSON.parse(order.order_details) : order.order_details,
        total: order.total,
        notes: order.notes
      }));

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Database error" });
    }
  }
});

module.exports = router;
