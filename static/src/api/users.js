const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const pool = require('../db/connection.js');
const { 
    createUser, 
    getUserByUsername, 
    getUserByPhoneNumber, 
    verifyUser,
    verifyUserByPhone, 
    updateVerificationCode,
    setPasswordResetToken,
    verifyPasswordResetToken,
    updatePassword
} = require('../db/queries.js');

const router = express.Router();

// Initialize Twilio client
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

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Generate verification code (fallback for when Twilio Verify is not configured)
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send SMS verification using Twilio Verify API
const sendVerificationSMS = async (phoneNumber) => {
    if (!verifyService) {
        console.log('Twilio Verify not configured, using fallback');
        const code = generateVerificationCode();
        console.log('SMS would be sent to:', phoneNumber, 'Code:', code);
        return { success: true, code: code, message: 'Twilio Verify not configured, using mock' };
    }
    
    try {
        const verification = await verifyService.verifications.create({
            to: phoneNumber,
            channel: 'sms'
        });
        
        console.log('Verification sent:', verification.status);
        return { success: true, sid: verification.sid, status: verification.status };
    } catch (error) {
        console.error('SMS verification sending error:', error);
        return { success: false, error: error.message };
    }
};

// Verify SMS code using Twilio Verify API
const verifyVerificationCode = async (phoneNumber, code) => {
    if (!verifyService) {
        console.log('Twilio Verify not configured, using fallback verification');
        // In fallback mode, we'll use database verification
        return null; // This will trigger database verification
    }
    
    try {
        const verification = await verifyService.verificationChecks.create({
            to: phoneNumber,
            code: code
        });
        
        console.log('Verification check result:', verification.status);
        return { success: verification.status === 'approved', status: verification.status };
    } catch (error) {
        console.error('SMS verification check error:', error);
        return { success: false, error: error.message };
    }
};

// Register user
router.post('/register', async (req, res) => {
    try {
        const { username, password, phoneNumber } = req.body;

        // Validate input
        if (!username || !password || !phoneNumber) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username, password, and phone number are required' 
            });
        }

        // Check if user already exists
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'Username already exists' 
            });
        }

        // Check if phone number already exists
        const existingPhone = await getUserByPhoneNumber(phoneNumber);
        if (existingPhone) {
            return res.status(409).json({ 
                success: false, 
                message: 'Phone number already registered' 
            });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Send verification SMS using Twilio Verify API
        const smsResult = await sendVerificationSMS(phoneNumber);

        if (!smsResult.success) {
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to send verification code. Please try again.' 
            });
        }

        // For fallback mode, we still need to store the code in database
        let verificationCode = null;
        let verificationExpiresAt = null;
        
        if (smsResult.code) {
            // Fallback mode - store code in database
            verificationCode = smsResult.code;
            verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        }

        // Create user
        const newUser = await createUser(
            username, 
            passwordHash, 
            phoneNumber, 
            verificationCode, 
            verificationExpiresAt
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your phone number.',
            user: {
                id: newUser.id,
                username: newUser.username,
                phoneNumber: newUser.phone_number,
                isVerified: newUser.is_verified
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Verify phone number
router.post('/verify', async (req, res) => {
    try {
        const { phoneNumber, verificationCode } = req.body;

        if (!phoneNumber || !verificationCode) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number and verification code are required' 
            });
        }

        // Check if user exists
        const user = await getUserByPhoneNumber(phoneNumber);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Try Twilio Verify API first
        const twilioResult = await verifyVerificationCode(phoneNumber, verificationCode);
        
        if (twilioResult && twilioResult.success) {
            // Twilio Verify API successful - mark user as verified
            const verifiedUser = await verifyUserByPhone(phoneNumber);
            if (verifiedUser) {
                return res.json({
                    success: true,
                    message: 'Phone number verified successfully',
                    user: {
                        id: verifiedUser.id,
                        username: verifiedUser.username,
                        phoneNumber: verifiedUser.phone_number,
                        isVerified: verifiedUser.is_verified
                    }
                });
            }
        } else if (twilioResult && !twilioResult.success) {
            // Twilio Verify API failed
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired verification code' 
            });
        }

        // Fallback to database verification
        const verifiedUser = await verifyUser(phoneNumber, verificationCode);

        if (!verifiedUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired verification code' 
            });
        }

        res.json({
            success: true,
            message: 'Phone number verified successfully',
            user: {
                id: verifiedUser.id,
                username: verifiedUser.username,
                phoneNumber: verifiedUser.phone_number,
                isVerified: verifiedUser.is_verified
            }
        });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Resend verification code
router.post('/resend-verification', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number is required' 
            });
        }

        const user = await getUserByPhoneNumber(phoneNumber);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        if (user.is_verified) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number is already verified' 
            });
        }

        // Send verification SMS using Twilio Verify API
        const smsResult = await sendVerificationSMS(phoneNumber);

        if (!smsResult.success) {
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to send verification code' 
            });
        }

        // For fallback mode, update the code in database
        if (smsResult.code) {
            const verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            await updateVerificationCode(phoneNumber, smsResult.code, verificationExpiresAt);
        }

        res.json({
            success: true,
            message: 'Verification code resent successfully'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        if (!user.is_verified) {
            return res.status(403).json({ 
                success: false, 
                message: 'Please verify your phone number before logging in' 
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username,
                phoneNumber: user.phone_number 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                phoneNumber: user.phone_number,
                isVerified: user.is_verified
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Password reset request
router.post('/reset-password-request', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number is required' 
            });
        }

        const user = await getUserByPhoneNumber(phoneNumber);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'No account found with this phone number' 
            });
        }

        if (!user.is_verified) {
            return res.status(403).json({ 
                success: false, 
                message: 'Please verify your phone number first' 
            });
        }

        // Send verification SMS using Twilio Verify API
        const smsResult = await sendVerificationSMS(phoneNumber);

        if (!smsResult.success) {
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to send reset code. Please try again.' 
            });
        }

        // For fallback mode, store the code as reset token
        if (smsResult.code) {
            const resetExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            await setPasswordResetToken(phoneNumber, smsResult.code, resetExpiresAt);
        }

        res.json({
            success: true,
            message: 'Password reset code sent to your phone number'
        });

    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Verify password reset code
router.post('/reset-password-verify', async (req, res) => {
    try {
        const { phoneNumber, resetCode } = req.body;
        console.log('Password reset verify request:', { phoneNumber, resetCode });

        if (!phoneNumber || !resetCode) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number and reset code are required' 
            });
        }

        const user = await getUserByPhoneNumber(phoneNumber);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        let isValidCode = false;
        
        // Try Twilio Verify API first
        const twilioResult = await verifyVerificationCode(phoneNumber, resetCode);
        console.log('Twilio verification result:', twilioResult);
        
        if (twilioResult && twilioResult.success) {
            isValidCode = true;
        } else if (twilioResult && !twilioResult.success) {
            // Twilio Verify API failed
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired reset code' 
            });
        } else {
            // Fallback to database verification
            const verifiedUser = await verifyPasswordResetToken(phoneNumber, resetCode);
            console.log('Database verification result:', verifiedUser);
            if (verifiedUser) {
                isValidCode = true;
            }
        }

        if (!isValidCode) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired reset code' 
            });
        }

        // Generate a temporary reset token (valid for 10 minutes)
        const tempResetToken = Math.floor(100000 + Math.random() * 900000).toString();
        
        console.log('Generated temp token:', tempResetToken);
        
        // Store the temporary token in the database using PostgreSQL's timestamp functions
        await pool.query(
            'UPDATE users SET verification_code = $1, verification_expires_at = NOW() + INTERVAL \'10 minutes\' WHERE phone_number = $2',
            [tempResetToken, phoneNumber]
        );

        res.json({
            success: true,
            message: 'Reset code verified successfully',
            canResetPassword: true,
            tempToken: tempResetToken // Send this to frontend
        });

    } catch (error) {
        console.error('Password reset verification error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Update password after reset
router.post('/reset-password-update', async (req, res) => {
    try {
        const { phoneNumber, tempToken, newPassword } = req.body;
        console.log('Password reset update request:', { phoneNumber, tempToken, newPasswordLength: newPassword?.length });

        if (!phoneNumber || !tempToken || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number, temp token, and new password are required' 
            });
        }

        // Verify the temporary token from database
        const verifiedUser = await verifyPasswordResetToken(phoneNumber, tempToken);
        console.log('Temp token verification result:', verifiedUser);
        
        if (!verifiedUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired reset session' 
            });
        }

        // Hash new password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        const updatedUser = await updatePassword(phoneNumber, passwordHash);
        console.log('Password update result:', updatedUser);
        
        if (updatedUser) {
            return res.json({
                success: true,
                message: 'Password updated successfully. You can now login with your new password.'
            });
        } else {
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to update password' 
            });
        }

    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
};

// Protected route example
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await getUserByUsername(req.user.username);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                phoneNumber: user.phone_number,
                isVerified: user.is_verified,
                createdAt: user.created_at
            }
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

module.exports = router; 