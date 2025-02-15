const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the correct build directory
app.use(express.static(path.join(__dirname, "static", "build")));

// Handle React routing, return index.html for all unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "build", "index.html"));
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
