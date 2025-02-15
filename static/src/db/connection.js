const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: "mak_delivery_database_user",
    host: "cuo10arqf0us738q68sg-a.oregon-postgres.render.com",
    database: "mak_delivery_database",
    password: "ly8vsRHtMfW1E3I4azSVGbistOKRF9y5",
    port: 5432,
    ssl: { rejectUnauthorized: false },
});

module.exports = pool;
