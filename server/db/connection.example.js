/**
 * Connection template — committed to the repo, safe to share (env-var based).
 *
 * Local dev: copy this file to `connection.js` (gitignored) and either leave
 * it as-is (uses env vars from static/.env) or put hardcoded local creds in
 * `connection.js` for a zero-setup `npm start`.
 *
 * Deploy (Render): `server/ensure-connection.js` copies this file to
 * `connection.js` at build time, so the production build always has a
 * working, env-driven connection module.
 */
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
