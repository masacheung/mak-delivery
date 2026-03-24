/**
 * US numbers only: normalize to E.164 (+1 + 10 digits) so register / verify / Twilio use the same key.
 * @param {unknown} raw
 * @returns {string|null}
 */
function normalizeUsPhoneE164(raw) {
  if (raw == null) return null;
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  return null;
}

/** Strip spaces / tabs from pasted SMS codes. */
function normalizeVerificationCode(raw) {
  if (raw == null) return "";
  return String(raw).replace(/\s/g, "").trim();
}

module.exports = { normalizeUsPhoneE164, normalizeVerificationCode };
