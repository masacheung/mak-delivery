const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { normalizeUsPhoneE164 } = require('../utils/phoneNormalize');

function signingKey() {
  const secret = process.env.JWT_SECRET;
  if (typeof secret !== 'string' || !secret.trim()) return null;
  // A verification capability must never be accepted as a login/access token.
  return crypto.createHmac('sha256', secret).update('mak-phone-verification:v1').digest('hex');
}

const passwordVersion = user => crypto.createHash('sha256').update(user.password_hash).digest('hex');

function issueVerificationToken(user) {
  const key = signingKey();
  if (!key) return undefined;
  return jwt.sign({ sub: String(user.id), phone: normalizeUsPhoneE164(user.phone_number), pv: passwordVersion(user) }, key,
    { algorithm: 'HS256', audience: 'phone-verification', expiresIn: '7d' });
}

function acceptsVerificationToken(token, user) {
  const key = signingKey();
  if (!key || typeof token !== 'string' || !user || user.is_verified) return false;
  try {
    const claims = jwt.verify(token, key, { algorithms: ['HS256'], audience: 'phone-verification' });
    return claims.sub === String(user.id) && claims.phone === normalizeUsPhoneE164(user.phone_number) &&
      claims.pv === passwordVersion(user);
  } catch { return false; }
}

module.exports = { issueVerificationToken, acceptsVerificationToken };
