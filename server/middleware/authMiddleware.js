const jwt = require("jsonwebtoken");

/** Insecure default only when NODE_ENV is not production; never used in production. */
const DEV_FALLBACK_JWT_SECRET =
  "mak-delivery-local-dev-JWT_SECRET-NOT-FOR-PRODUCTION";

let warnedDevFallback = false;

/**
 * Single source of truth for signing/verifying JWTs (users + admin APIs).
 * - Production: JWT_SECRET must be set (non-empty).
 * - Non-production: JWT_SECRET optional; falls back to DEV_FALLBACK with a one-time console warning.
 */
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    if (!secret || typeof secret !== "string" || secret.trim().length === 0) {
      throw new Error(
        "JWT_SECRET must be set to a strong, non-empty string when NODE_ENV=production."
      );
    }
    return secret;
  }

  if (secret && typeof secret === "string" && secret.trim().length > 0) {
    return secret;
  }

  if (!warnedDevFallback) {
    console.warn(
      "[mak-delivery] JWT_SECRET is unset; using a fixed development-only default. Set JWT_SECRET in .env for stable tokens across restarts."
    );
    warnedDevFallback = true;
  }
  return DEV_FALLBACK_JWT_SECRET;
}

function requireUserAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (!payload.username) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.authUser = {
      userId: payload.userId,
      username: payload.username,
      phoneNumber: payload.phoneNumber,
      role: payload.role || "user",
    };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireAdminAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Admin authentication required" });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired admin token" });
  }
}

module.exports = { getJwtSecret, requireUserAuth, requireAdminAuth };
