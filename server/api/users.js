const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getJwtSecret, requireUserAuth } = require("../middleware/authMiddleware.js");
const {
  createUser,
  getUserByUsername,
  getUserByPhoneNumber,
  getUserByUsernameAndPhone,
  verifyUserByPhone,
  changeUnverifiedUserPhone,
  updatePassword,
} = require("../db/queries.js");
const { normalizeUsPhoneE164, normalizeVerificationCode } = require("../utils/phoneNormalize.js");
const { issueVerificationToken, acceptsVerificationToken } = require('../services/verificationSession');
const { prepareSmsSend, sendReservedSms, checkSmsCode, recordResult } = require('../services/smsVerification');

const router = express.Router();
router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
const { createSession, revokeSession, sessionUser, accessToken, sameOrigin } = require('../services/loginSessions');

router.post('/refresh', async (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Invalid origin.' });
  try {
    const user = await sessionUser(req, getUserByUsername);
    if (!user) return res.status(401).json({ error: 'Please sign in again.' });
    res.set('Cache-Control', 'no-store').json({ token: accessToken(user), user: { id: user.id, username: user.username, role: user.role === 'admin' ? 'admin' : 'user', isVerified: user.is_verified } });
  } catch { res.status(503).json({ error: 'Unable to restore your session.' }); }
});
router.post('/logout', async (req, res) => {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Invalid origin.' });
  try { await revokeSession(req, res); res.json({ success: true }); }
  catch { res.status(503).json({ error: 'Unable to sign out. Please retry.' }); }
});

// Only return verification details after an account password has been checked.
const verificationDetails = user => ({
  username: user.username,
  phoneNumber: normalizeUsPhoneE164(user.phone_number),
  verificationToken: issueVerificationToken(user),
});
const pendingVerificationResponse = user => ({
  success: false,
  requiresVerification: true,
  verification: verificationDetails(user),
  message: 'Your account is not verified yet. Continue phone verification to finish signing up.',
});

function smsResponse(res, result, extra = {}) {
  if (result.retryAfterSeconds) res.set('Retry-After', String(result.retryAfterSeconds));
  return res.status(result.httpStatus || 200).json({
    ...extra,
    success: result.success,
    message: result.message,
    ...(result.code ? { code: result.code } : {}),
    ...(result.resendAvailableAt ? { resendAvailableAt: result.resendAvailableAt, retryAfterSeconds: result.retryAfterSeconds } : {}),
  });
}
const reserveFor = (req, phoneNumber, username) => prepareSmsSend({
  phoneNumber, username,
  // Never trust a caller-supplied X-Forwarded-For header for paid SMS limits.
  ip: req.socket.remoteAddress,
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const phoneNumber = normalizeUsPhoneE164(req.body.phoneNumber);
    if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Username, password, and a valid US phone number are required.' });
    }
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      if (!existingUser.is_verified && normalizeUsPhoneE164(existingUser.phone_number) === phoneNumber &&
          await bcrypt.compare(password, existingUser.password_hash)) {
        return res.status(409).json(pendingVerificationResponse(existingUser));
      }
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }
    if (await getUserByPhoneNumber(phoneNumber)) {
      return res.status(409).json({ success: false, message: 'Phone number already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const reservation = await reserveFor(req, phoneNumber, username);
    if (!reservation.success) return smsResponse(res, reservation);

    let newUser;
    try {
      // Keep the pending account recoverable even if the provider times out after accepting a text.
      newUser = await createUser(username, passwordHash, phoneNumber, null, null);
    } catch (error) {
      await recordResult(reservation, { status: 'canceled' });
      throw error;
    }
    const user = { ...newUser, password_hash: passwordHash };
    const result = await sendReservedSms(reservation, phoneNumber);
    if (!result.success) return smsResponse(res, result, pendingVerificationResponse(user));
    return smsResponse(res, { ...result, httpStatus: 201,
      message: 'Your account is saved. A verification text has been requested.' }, {
      verification: verificationDetails(user),
      user: { id: user.id, username: user.username, phoneNumber: user.phone_number, isVerified: user.is_verified, role: user.role || 'user' },
    });
  } catch (error) {
    console.error('[signup] registration failed', { code: error.code || 'unknown' });
    return res.status(error.code === '23505' ? 409 : 503).json({ success: false,
      message: error.code === '23505' ? 'This username or phone number is already registered. Please sign in.' : 'Unable to create your account. Please try again later.' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const phoneNumber = normalizeUsPhoneE164(req.body.phoneNumber);
    const verificationCode = normalizeVerificationCode(req.body.verificationCode);
    if (!phoneNumber || !/^\d{6}$/.test(verificationCode)) {
      return res.status(400).json({ success: false, message: 'Enter a valid phone number and the 6-digit verification code.' });
    }
    const user = await getUserByPhoneNumber(phoneNumber);
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    const result = await checkSmsCode(phoneNumber, verificationCode);
    if (!result.success) return smsResponse(res, result);
    const verifiedUser = await verifyUserByPhone(phoneNumber, user.id);
    if (!verifiedUser) return res.status(409).json({ success: false, message: 'Your account changed. Please sign in and verify your current phone number.' });
    return res.json({ success: true, message: 'Phone number verified successfully',
      user: { id: verifiedUser.id, username: verifiedUser.username, phoneNumber: verifiedUser.phone_number, isVerified: verifiedUser.is_verified } });
  } catch (error) {
    console.error('[signup] verification failed', { code: error.code || 'unknown' });
    return res.status(503).json({ success: false, message: 'Unable to verify your phone number. Please try again later.' });
  }
});

router.post('/resend-verification', async (req, res) => {
  try {
    const phoneNumber = normalizeUsPhoneE164(req.body.phoneNumber);
    const user = phoneNumber && await getUserByPhoneNumber(phoneNumber);
    if (!acceptsVerificationToken(req.body.verificationToken, user)) {
      return res.status(401).json({ success: false, code: 'VERIFICATION_SESSION_EXPIRED',
        message: 'Please sign in again to request another code.' });
    }
    const reservation = await reserveFor(req, phoneNumber, user.username);
    if (!reservation.success) return smsResponse(res, reservation);
    const result = await sendReservedSms(reservation, phoneNumber);
    return smsResponse(res, { ...result, message: result.success ? 'A verification text has been requested. Please check your phone.' : result.message });
  } catch (error) {
    console.error('[signup] resend failed', { code: error.code || 'unknown' });
    return res.status(503).json({ success: false, message: 'Unable to request a verification text. Please try again later.' });
  }
});

router.post('/change-verification-phone', async (req, res) => {
  try {
    const { username, password } = req.body;
    const currentPhone = normalizeUsPhoneE164(req.body.currentPhoneNumber);
    const phoneNumber = normalizeUsPhoneE164(req.body.phoneNumber);
    if (typeof username !== 'string' || typeof password !== 'string' || !password || !currentPhone || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Enter your account password and a valid new phone number.' });
    }
    const user = await getUserByUsername(username);
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ success: false, message: 'Incorrect username or password. Your phone number has not changed.' });
    }
    if (user.is_verified) return res.status(403).json({ success: false, message: 'This account is already verified. Please sign in.' });
    if (normalizeUsPhoneE164(user.phone_number) !== currentPhone) {
      return res.status(409).json({ ...pendingVerificationResponse(user), message: 'Your phone number changed elsewhere. Please check the current number.' });
    }
    if (phoneNumber === currentPhone) return res.status(400).json({ success: false, message: 'Enter a different phone number, or use Resend code.' });
    if (await getUserByPhoneNumber(phoneNumber)) return res.status(409).json({ success: false, message: 'That phone number is already registered.' });
    const reservation = await reserveFor(req, phoneNumber, user.username);
    if (!reservation.success) return smsResponse(res, reservation);
    let updated;
    try { updated = await changeUnverifiedUserPhone(user.id, user.phone_number, phoneNumber); }
    catch (error) { await recordResult(reservation, { status: 'canceled' }); throw error; }
    if (!updated) {
      await recordResult(reservation, { status: 'canceled' });
      return res.status(409).json({ success: false, message: 'Your account changed elsewhere. Please sign in again.' });
    }
    const nextUser = { ...user, ...updated };
    const result = await sendReservedSms(reservation, phoneNumber);
    if (!result.success) return smsResponse(res, result, pendingVerificationResponse(nextUser));
    return smsResponse(res, { ...result, message: 'Phone number updated. A verification text has been requested.' }, { verification: verificationDetails(nextUser) });
  } catch (error) {
    console.error('[signup] phone correction failed', { code: error.code || 'unknown' });
    return res.status(error.code === '23505' ? 409 : 503).json({ success: false,
      message: error.code === '23505' ? 'That phone number is already registered.' : 'Unable to change your phone number. Please try again later.' });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.is_verified) {
      return res.status(403).json(pendingVerificationResponse(user));
    }

    const role = user.role === "admin" ? "admin" : "user";

    let remembered = false;
    try {
      if (req.body.rememberMe === true) { await createSession(user, req, res); remembered = true; }
      else await revokeSession(req, res);
    } catch (error) {
      // Ordinary 24h sign-in remains available before the migration is applied.
      if (error.code !== '42P01') throw error;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        phoneNumber: user.phone_number,
        role,
      },
      getJwtSecret(),
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      remembered,
      token,
      user: {
        id: user.id,
        username: user.username,
        phoneNumber: user.phone_number,
        isVerified: user.is_verified,
        role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/reset-password-request", async (req, res) => {
  try {
    const { username } = req.body;
    const phoneNumber = normalizeUsPhoneE164(req.body.phoneNumber);

    if (!username || !req.body.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Username and phone number are required",
      });
    }

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Invalid US phone number. Use +1 followed by 10 digits.",
      });
    }

    const user = await getUserByUsernameAndPhone(username, phoneNumber);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this username and phone number combination",
      });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your phone number first",
      });
    }

    res.json({
      success: true,
      message: "User verified. You can now reset your password.",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/reset-password-update", async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const phoneNumber = normalizeUsPhoneE164(req.body.phoneNumber);

    if (!username || !req.body.phoneNumber || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Username, phone number, and new password are required",
      });
    }

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Invalid US phone number. Use +1 followed by 10 digits.",
      });
    }

    const verifiedUser = await getUserByUsernameAndPhone(username, phoneNumber);

    if (!verifiedUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid username and phone number combination",
      });
    }

    // An unfinished account must not acquire a new password/resend capability
    // through this legacy recovery flow without proving phone ownership.
    if (!verifiedUser.is_verified) {
      return res.status(403).json({ success: false, message: 'Please verify your phone number first' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await updatePassword(phoneNumber, passwordHash);

    if (updatedUser) {
      return res.json({
        success: true,
        message: "Password updated successfully. You can now login with your new password.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update password",
    });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/me", requireUserAuth, async (req, res) => {
  try {
    const user = await getUserByUsername(req.authUser.username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const role = user.role === "admin" ? "admin" : "user";

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        phoneNumber: user.phone_number,
        isVerified: user.is_verified,
        role,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await getUserByUsername(req.user.username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        phoneNumber: user.phone_number,
        isVerified: user.is_verified,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/find-username", async (req, res) => {
  try {
    const phoneNumber = normalizeUsPhoneE164(req.body.phoneNumber);

    if (!req.body.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Invalid US phone number. Use +1 followed by 10 digits.",
      });
    }

    const user = await getUserByPhoneNumber(phoneNumber);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number",
      });
    }

    res.json({
      success: true,
      username: user.username,
      message: "Username found successfully",
    });
  } catch (error) {
    console.error("Find username error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
