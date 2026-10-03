const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');
const { getJwtSecret } = require('../middleware/authMiddleware');
const COOKIE = 'makSession';
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const passwordVersion = user => hash(user.password_hash);
function readCookie(req) {
  const raw = (req.headers.cookie || '').split(';').map(value => value.trim()).find(value => value.startsWith(`${COOKIE}=`));
  return raw ? raw.slice(COOKIE.length + 1) : '';
}
function cookieOptions() { return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/users' }; }
function accessToken(user) { return jwt.sign({ userId: user.id, username: user.username, phoneNumber: user.phone_number, role: user.role === 'admin' ? 'admin' : 'user' }, getJwtSecret(), { expiresIn: '24h' }); }
async function revokeSession(req, res) {
  const token = readCookie(req);
  if (token) await pool.query('DELETE FROM login_sessions WHERE token_hash=$1', [hash(token)]);
  res.clearCookie(COOKIE, cookieOptions());
}
async function createSession(user, req, res) {
  const token = crypto.randomBytes(32).toString('hex');
  await pool.query(`INSERT INTO login_sessions(token_hash,username,password_version,expires_at) VALUES($1,$2,$3,NOW()+INTERVAL '30 days')`, [hash(token), user.username, passwordVersion(user)]);
  await revokeSession(req, res);
  res.cookie(COOKIE, token, { ...cookieOptions(), maxAge: 30 * 86400000 });
}
async function sessionUser(req, getUser) {
  const token = readCookie(req);
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  const { rows } = await pool.query('SELECT username,password_version FROM login_sessions WHERE token_hash=$1 AND expires_at>NOW()', [hash(token)]);
  if (!rows.length) return null;
  const user = await getUser(rows[0].username);
  return user?.is_verified && passwordVersion(user) === rows[0].password_version ? user : null;
}
function sameOrigin(req) {
  if (!req.headers.origin) return true;
  try { return new URL(req.headers.origin).host === req.get('host'); } catch { return false; }
}
module.exports = { accessToken, createSession, revokeSession, sessionUser, sameOrigin };
