const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const pool = require('../db/connection');
(async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'db', 'migrations', '004_sms_send_safety.sql'), 'utf8');
    const db = await pool.connect();
    try { await db.query(sql); } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
    console.log('SMS safety migration applied. No SMS messages were sent.');
  } catch (error) {
    console.error('Migration failed:', error.code || error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
