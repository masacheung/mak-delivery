const STORAGE_KEY = 'makPendingRegistration.v1';
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const MAX_RESEND_DELAY = 24 * 60 * 60 * 1000;

// Only resumable account details belong here. Never persist passwords or SMS codes.
function safeRegistration(value, now = Date.now()) {
  if (!value || typeof value.username !== 'string' || !value.username.trim() ||
      typeof value.phoneNumber !== 'string' || !/^\+1\d{10}$/.test(value.phoneNumber) ||
      !Number.isFinite(value.savedAt) || now - value.savedAt > MAX_AGE || value.savedAt > now + 60000) return null;
  return {
    username: value.username,
    phoneNumber: value.phoneNumber,
    savedAt: value.savedAt,
    resendAvailableAt: Number.isFinite(value.resendAvailableAt) ? Math.max(0, Math.min(value.resendAvailableAt, now + MAX_RESEND_DELAY)) : 0,
    ...(typeof value.verificationToken === 'string' && value.verificationToken.length > 0 && value.verificationToken.length <= 4096 && { verificationToken: value.verificationToken }),
  };
}

export function readPendingRegistration() {
  try {
    const pending = safeRegistration(JSON.parse(localStorage.getItem(STORAGE_KEY)));
    if (!pending) localStorage.removeItem(STORAGE_KEY);
    return pending;
  } catch { return null; }
}

export function savePendingRegistration(value) {
  const pending = safeRegistration(value);
  if (!pending) return null;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pending)); } catch { /* Continue in memory when device storage is unavailable. */ }
  return pending;
}

export function clearPendingRegistration() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* Device storage may be blocked. */ }
}

export function remainingResendSeconds(pending) {
  return Math.max(0, Math.ceil(((pending?.resendAvailableAt || 0) - Date.now()) / 1000));
}

export function resendDeadline(response, fallback = 0) {
  const now = Date.now();
  const deadline = Number.isFinite(response?.resendAvailableAt) ? response.resendAvailableAt : 0;
  const seconds = Number.isFinite(response?.retryAfterSeconds) ? Math.max(0, response.retryAfterSeconds) : 0;
  return Math.min(Math.max(deadline, seconds ? now + seconds * 1000 : 0, fallback), now + MAX_RESEND_DELAY);
}
