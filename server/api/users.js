const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const { getJwtSecret, requireUserAuth } = require("../middleware/authMiddleware.js");
const {
  createUser,
  getUserByUsername,
  getUserByPhoneNumber,
  getUserByUsernameAndPhone,
  verifyUser,
  verifyUserByPhone,
  updateVerificationCode,
  updatePassword,
} = require("../db/queries.js");
const { normalizeUsPhoneE164, normalizeVerificationCode } = require("../utils/phoneNormalize.js");

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let client;
let verifyService;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
  if (verifyServiceSid) {
    verifyService = client.verify.v2.services(verifyServiceSid);
  }
}

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationSMS = async (phoneNumber) => {
  if (!verifyService) {
    console.log("Twilio Verify not configured, using fallback");
    const code = generateVerificationCode();
    console.log("SMS would be sent to:", phoneNumber, "Code:", code);
    return { success: true, code: code, message: "Twilio Verify not configured, using mock" };
  }

  try {
    const verification = await verifyService.verifications.create({
      to: phoneNumber,
      channel: "sms",
    });

    console.log("Verification sent:", verification.status);
    return { success: true, sid: verification.sid, status: verification.status };
  } catch (error) {
    console.error("SMS verification sending error:", error);
    return { success: false, error: error.message };
  }
};

const verifyVerificationCode = async (phoneNumber, code) => {
  if (!verifyService) {
    console.log("Twilio Verify not configured, using fallback verification");
    return null;
  }

  try {
    const verification = await verifyService.verificationChecks.create({
      to: phoneNumber,
      code: code,
    });

    console.log("Verification check result:", verification.status);
    return { success: verification.status === "approved", status: verification.status };
  } catch (error) {
    console.error("SMS verification check error:", error);
    return { success: false, error: error.message };
  }
};

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const phoneNumber = normalizeUsPhoneE164(req.body.phoneNumber);

    if (!username || !password || !req.body.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Username, password, and phone number are required",
      });
    }

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Invalid US phone number. Use +1 followed by 10 digits.",
      });
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    const existingPhone = await getUserByPhoneNumber(phoneNumber);
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const smsResult = await sendVerificationSMS(phoneNumber);

    if (!smsResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code. Please try again.",
      });
    }

    let verificationCode = null;
    let verificationExpiresAt = null;

    if (smsResult.code) {
      verificationCode = smsResult.code;
      verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    }

    const newUser = await createUser(
      username,
      passwordHash,
      phoneNumber,
      verificationCode,
      verificationExpiresAt
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your phone number.",
      user: {
        id: newUser.id,
        username: newUser.username,
        phoneNumber: newUser.phone_number,
        isVerified: newUser.is_verified,
        role: newUser.role || "user",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const phoneNumber = normalizeUsPhoneE164(req.body.phoneNumber);
    const verificationCode = normalizeVerificationCode(req.body.verificationCode);

    if (!req.body.phoneNumber || !req.body.verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Phone number and verification code are required",
      });
    }

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Invalid US phone number. Use +1 followed by 10 digits.",
      });
    }

    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Please enter the verification code",
      });
    }

    const user = await getUserByPhoneNumber(phoneNumber);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const twilioResult = await verifyVerificationCode(phoneNumber, verificationCode);

    if (twilioResult && twilioResult.success) {
      const verifiedUser = await verifyUserByPhone(phoneNumber);
      if (verifiedUser) {
        return res.json({
          success: true,
          message: "Phone number verified successfully",
          user: {
            id: verifiedUser.id,
            username: verifiedUser.username,
            phoneNumber: verifiedUser.phone_number,
            isVerified: verifiedUser.is_verified,
          },
        });
      }
      console.error("Twilio approved verification but DB update returned no row", {
        phoneSuffix: phoneNumber.slice(-4),
      });
      return res.status(500).json({
        success: false,
        message: "Verification succeeded but the account could not be updated. Please try again or contact support.",
      });
    } else if (twilioResult && !twilioResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    const verifiedUser = await verifyUser(phoneNumber, verificationCode);

    if (!verifiedUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    res.json({
      success: true,
      message: "Phone number verified successfully",
      user: {
        id: verifiedUser.id,
        username: verifiedUser.username,
        phoneNumber: verifiedUser.phone_number,
        isVerified: verifiedUser.is_verified,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/resend-verification", async (req, res) => {
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
        message: "User not found",
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Phone number is already verified",
      });
    }

    const smsResult = await sendVerificationSMS(phoneNumber);

    if (!smsResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code",
      });
    }

    if (smsResult.code) {
      const verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await updateVerificationCode(phoneNumber, smsResult.code, verificationExpiresAt);
    }

    res.json({
      success: true,
      message: "Verification code resent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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

    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your phone number before logging in",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const role = user.role === "admin" ? "admin" : "user";

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
    console.log("Password reset update request:", {
      username,
      phoneNumber: phoneNumber ? `${phoneNumber.slice(0, 4)}…` : null,
      newPasswordLength: newPassword && newPassword.length,
    });

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
    console.log("User verification result:", verifiedUser);

    if (!verifiedUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid username and phone number combination",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await updatePassword(phoneNumber, passwordHash);
    console.log("Password update result:", updatedUser);

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
