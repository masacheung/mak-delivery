const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const ordersRoute = require("./api/orders.js");
const adminRoute = require("./api/adminConfig.js");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the correct build directory
app.use(express.static(path.join(__dirname, "..", "build")));

// Admin credentials from environment variables
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "password";

// Admin login route
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.status(200).json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Orders API
app.use("/api/orders", ordersRoute);

// Orders API
app.use("/api/adminConfig", adminRoute);

// Serve the admin page
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// Handle all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
