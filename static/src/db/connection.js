const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: "mak_delivery_database_user",
    host: process.env.DB_HOST,
    database: "mak_delivery_database",
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: { rejectUnauthorized: false },
});

module.exports = pool;
