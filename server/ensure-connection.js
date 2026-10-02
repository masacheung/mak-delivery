/**
 * Copies connection.example.js -> connection.js when the local file is missing.
 *
 * Local developers keep a gitignored server/db/connection.js with real creds
 * for a zero-setup `npm start`. Deploy environments (Render) build from the
 * repo, so this creates the env-var-based file for them at build time.
 */
const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "db", "connection.js");
const example = path.join(__dirname, "db", "connection.example.js");

if (!fs.existsSync(target) && fs.existsSync(example)) {
  fs.copyFileSync(example, target);
  console.log(
    "[ensure-connection] created server/db/connection.js from connection.example.js (env-var based)"
  );
}
