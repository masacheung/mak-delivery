const path = require("path");
const fs = require("fs");

function loadEnv() {
  const candidates = [
    path.join(__dirname, "..", ".env"),
    path.join(__dirname, "..", "static", ".env"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      require("dotenv").config({ path: p });
      return;
    }
  }
  require("dotenv").config();
}
loadEnv();

const { getJwtSecret } = require("./middleware/authMiddleware.js");
try {
  getJwtSecret();
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const express = require("express");
const cors = require("cors");
const ordersRoute = require("./api/orders.js");
const adminRoute = require("./api/adminConfig.js");
const usersRoute = require("./api/users.js");
const notificationsRoute = require("./api/notifications.js");

const app = express();
const PORT = process.env.PORT || 3000;

const clientBuild = path.join(__dirname, "..", "static", "build");

app.use(express.json());
app.use(cors());

app.use(express.static(clientBuild));

app.use("/api/orders", ordersRoute);
app.use("/api/adminConfig", adminRoute);
app.use("/api/users", usersRoute);
app.use("/api/notifications", notificationsRoute);

app.get("/admin", (req, res) => {
  res.sendFile(path.join(clientBuild, "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuild, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
