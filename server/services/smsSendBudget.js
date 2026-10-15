const crypto = require('crypto');
const net = require('net');
const pool = require('../db/connection');

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function ipBucket(ip) {
  const value = typeof ip === 'string' ? ip.trim().toLowerCase() : '';
  if (value.startsWith('::ffff:') && net.isIP(value.slice(7)) === 4) return value.slice(7);
  if (net.isIP(value) === 4) return value;
  if (net.isIP(value) === 6) return new URL(`http://[${value}]`).hostname.slice(1, -1);
  // Untrusted/missing forwarded addresses share a bucket; they never bypass other limits.
  return 'unknown';
}

function configuredDailyLimit() {
  const value = process.env.SMS_DAILY_LIMIT === undefined ? '200' : process.env.SMS_DAILY_LIMIT.trim();
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
    throw new Error('SMS_DAILY_LIMIT must be a positive integer.');
  }
  return Number(value);
}

function persistentSecret() {
  const value = process.env.JWT_SECRET;
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('An explicit persistent JWT_SECRET is required for SMS send limits.');
  }
  return value;
}

function retryDelay(times, limit, windowMs, now) {
  const active = times.filter(value => value > now - windowMs).sort((a, b) => a - b);
  // Handles lowering the global cap while older reservations are still active.
  return active.length >= limit ? active[active.length - limit] + windowMs - now : 0;
}

function createSmsSendBudget({ dbPool = pool, getSecret = persistentSecret, getDailyLimit = configuredDailyLimit } = {}) {
  async function reserveSmsSend({ phoneNumber, username, ip }) {
    if (typeof phoneNumber !== 'string' || !/^\+[1-9]\d{7,14}$/.test(phoneNumber)) {
      throw new Error('SMS send limits require a normalized E.164 phone number.');
    }
    if (typeof username !== 'string' || !username.trim()) throw new Error('SMS send limits require an account.');
    const secret = getSecret();
    const dailyLimit = getDailyLimit();
    if (typeof secret !== 'string' || !secret.trim() || !Number.isSafeInteger(dailyLimit) || dailyLimit < 1) {
      throw new Error('SMS send limits are not configured.');
    }
    const hash = (scope, value) => crypto.createHmac('sha256', secret).update(`sms-limit:v1:${scope}:${value}`).digest('hex');
    const phoneHash = hash('phone', phoneNumber);
    const accountHash = hash('account', username.normalize('NFC').trim().toLowerCase());
    const ipHash = hash('ip', ipBucket(ip));
    const db = await dbPool.connect();
    let inTransaction = false;
    try {
      await db.query('BEGIN');
      inTransaction = true;
      // All replicas take the same transaction lock before reading/inserting a reservation.
      await db.query('SELECT pg_advisory_xact_lock(1908475123, 617)');
      const { rows: clock } = await db.query('SELECT clock_timestamp() AS now');
      const now = new Date(clock[0].now).getTime();
      if (!Number.isFinite(now)) throw new Error('SMS send limits could not read the database clock.');
      await db.query("DELETE FROM sms_send_attempts WHERE created_at < $1::timestamptz - INTERVAL '7 days'", [new Date(now)]);
      const { rows } = await db.query(`SELECT created_at,phone_hash,account_hash,ip_hash FROM sms_send_attempts
        WHERE created_at > $1::timestamptz - INTERVAL '24 hours' ORDER BY created_at`, [new Date(now)]);
      const times = entries => entries.map(row => new Date(row.created_at).getTime());
      const phoneTimes = times(rows.filter(row => row.phone_hash === phoneHash));
      const accountTimes = times(rows.filter(row => row.account_hash === accountHash));
      const ipTimes = times(rows.filter(row => row.ip_hash === ipHash));
      const wait = Math.max(
        retryDelay(phoneTimes, 1, MINUTE, now), retryDelay(accountTimes, 1, MINUTE, now),
        retryDelay(phoneTimes, 5, HOUR, now), retryDelay(accountTimes, 5, HOUR, now),
        retryDelay(phoneTimes, 10, DAY, now), retryDelay(accountTimes, 10, DAY, now),
        retryDelay(ipTimes, 20, HOUR, now), retryDelay(ipTimes, 60, DAY, now),
        retryDelay(times(rows), dailyLimit, DAY, now)
      );
      if (wait > 0) {
        await db.query('COMMIT');
        inTransaction = false;
        const retryAfterSeconds = Math.max(1, Math.ceil(wait / 1000));
        return { allowed: false, retryAfterSeconds, message: retryAfterSeconds <= 60
          ? 'Please wait before requesting another text message.'
          : 'Text message request limit reached. Please try again later.' };
      }
      const { rows: inserted } = await db.query(`INSERT INTO sms_send_attempts(created_at,phone_hash,account_hash,ip_hash)
        VALUES($1,$2,$3,$4) RETURNING id`, [new Date(now), phoneHash, accountHash, ipHash]);
      await db.query('COMMIT');
      inTransaction = false;
      return { allowed: true, attemptId: inserted[0].id, resendAvailableAt: now + MINUTE, retryAfterSeconds: 60 };
    } catch (error) {
      if (inTransaction) {
        try { await db.query('ROLLBACK'); } catch { /* Preserve the original failure; never allow a send. */ }
      }
      throw error;
    } finally {
      db.release();
    }
  }

  async function recordSmsResult(attemptId, { status, sid, errorCode } = {}) {
    if (!/^\d+$/.test(String(attemptId))) throw new Error('Invalid SMS attempt ID.');
    const providerStatus = typeof status === 'string' && /^[a-z_]{1,32}$/.test(status) ? status : 'unknown';
    const providerSid = typeof sid === 'string' && /^[A-Z]{2}[a-fA-F0-9]{32}$/.test(sid) ? sid : null;
    const providerErrorCode = /^\d{1,10}$/.test(String(errorCode)) ? String(errorCode) : null;
    await dbPool.query('UPDATE sms_send_attempts SET provider_status=$2,provider_sid=$3,provider_error_code=$4 WHERE id=$1',
      [attemptId, providerStatus, providerSid, providerErrorCode]);
  }

  return { reserveSmsSend, recordSmsResult };
}

module.exports = { ...createSmsSendBudget(), createSmsSendBudget };
