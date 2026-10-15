const twilio = require('twilio');
const { reserveSmsSend, recordSmsResult } = require('./smsSendBudget');

function verifyService() {
  if (process.env.SMS_ENABLED === 'false') return null;
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env;
  if (![TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID].every(value => typeof value === 'string' && value.trim())) return null;
  return twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { autoRetry: false }).verify.v2.services(TWILIO_VERIFY_SERVICE_SID);
}

const unavailable = () => ({ success: false, httpStatus: 503, code: 'SMS_UNAVAILABLE',
  message: 'Phone verification is temporarily unavailable. Please try again later.' });

function logFailure(operation, error) {
  // Provider errors can include phone numbers, credentials and request bodies.
  const code = /^[a-zA-Z0-9_]{1,32}$/.test(String(error?.code)) ? String(error.code) : 'unknown';
  console.error(`[sms] ${operation} failed (${code})`);
}

async function prepareSmsSend({ phoneNumber, username, ip }) {
  try {
    const service = verifyService();
    if (!service) return unavailable();
    const reservation = await reserveSmsSend({ phoneNumber, username, ip });
    if (!reservation.allowed) {
      return { success: false, httpStatus: 429, code: 'SMS_RATE_LIMITED', message: reservation.message,
        retryAfterSeconds: reservation.retryAfterSeconds, resendAvailableAt: Date.now() + reservation.retryAfterSeconds * 1000 };
    }
    return { success: true, service, ...reservation };
  } catch (error) {
    logFailure('send preparation', error);
    return unavailable();
  }
}

async function recordResult(reservation, result) {
  try { await recordSmsResult(reservation.attemptId, result); }
  catch (error) { logFailure('attempt audit', error); }
}

async function sendReservedSms(reservation, phoneNumber) {
  const retry = { resendAvailableAt: reservation.resendAvailableAt, retryAfterSeconds: reservation.retryAfterSeconds };
  try {
    const result = await reservation.service.verifications.create({ to: phoneNumber, channel: 'sms' });
    await recordResult(reservation, { status: result.status, sid: result.sid });
    if (result.status === 'pending') return { success: true, ...retry };
  } catch (error) {
    await recordResult(reservation, { status: 'failed', errorCode: error.code });
    logFailure('provider send', error);
  }
  return { success: false, httpStatus: 503, code: 'SMS_SEND_FAILED', ...retry,
    message: 'We could not confirm the text message was sent. Check your number, then try again after the countdown.' };
}

async function checkSmsCode(phoneNumber, code) {
  try {
    const service = verifyService();
    if (!service) return unavailable();
    const result = await service.verificationChecks.create({ to: phoneNumber, code });
    return { success: result.status === 'approved', httpStatus: 400, message: 'Invalid or expired verification code' };
  } catch (error) {
    logFailure('code check', error);
    // Twilio removes expired or already-consumed verification resources.
    if (error.status === 404) return { success: false, httpStatus: 400, message: 'Invalid or expired verification code' };
    return unavailable();
  }
}

module.exports = { prepareSmsSend, sendReservedSms, checkSmsCode, recordResult };
