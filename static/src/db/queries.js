const pool = require('./connection.js');

const createOrder = async (username, pickUpDate, pickUpLocation, total, orderDetails) => {
  const result = await pool.query(
    'INSERT INTO orders (username, pick_up_date, pick_up_location, total, order_details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [username, pickUpDate, pickUpLocation, total, orderDetails]
  );
  return result.rows[0];
};

// User management queries
const createUser = async (username, passwordHash, phoneNumber, verificationCode, verificationExpiresAt) => {
    const result = await pool.query(
        'INSERT INTO users (username, password_hash, phone_number, verification_code, verification_expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, phone_number, is_verified, created_at',
        [username, passwordHash, phoneNumber, verificationCode, verificationExpiresAt]
    );
    return result.rows[0];
};

const getUserByUsername = async (username) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );
    return result.rows[0];
};

const getUserByPhoneNumber = async (phoneNumber) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE phone_number = $1',
        [phoneNumber]
    );
    return result.rows[0];
};

const verifyUser = async (phoneNumber, verificationCode) => {
    // Handle Twilio Verify workflow
    if (verificationCode === 'twilio-verified') {
        // Twilio Verify API successful - just mark user as verified
        const result = await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires_at = NULL WHERE phone_number = $1 RETURNING id, username, phone_number, is_verified',
            [phoneNumber]
        );
        return result.rows[0];
    }
    
    // Database verification (fallback mode)
    const result = await pool.query(
        'UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires_at = NULL WHERE phone_number = $1 AND verification_code = $2 AND verification_expires_at > NOW() RETURNING id, username, phone_number, is_verified',
        [phoneNumber, verificationCode]
    );
    return result.rows[0];
};

// New function to verify user by phone number only (for Twilio Verify)
const verifyUserByPhone = async (phoneNumber) => {
    const result = await pool.query(
        'UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires_at = NULL WHERE phone_number = $1 RETURNING id, username, phone_number, is_verified',
        [phoneNumber]
    );
    return result.rows[0];
};

const updateVerificationCode = async (phoneNumber, verificationCode, verificationExpiresAt) => {
    const result = await pool.query(
        'UPDATE users SET verification_code = $1, verification_expires_at = $2 WHERE phone_number = $3 RETURNING id',
        [verificationCode, verificationExpiresAt, phoneNumber]
    );
    return result.rows[0];
};

// Password reset functionality
const setPasswordResetToken = async (phoneNumber, resetToken, resetExpiresAt) => {
    const result = await pool.query(
        'UPDATE users SET verification_code = $1, verification_expires_at = $2 WHERE phone_number = $3 RETURNING id, username, phone_number',
        [resetToken, resetExpiresAt, phoneNumber]
    );
    return result.rows[0];
};

const updatePassword = async (phoneNumber, passwordHash) => {
    console.log('Updating password for phone:', phoneNumber);
    const result = await pool.query(
        'UPDATE users SET password_hash = $1, verification_code = NULL, verification_expires_at = NULL WHERE phone_number = $2 RETURNING id, username, phone_number',
        [passwordHash, phoneNumber]
    );
    console.log('Update password result:', result.rows[0]);
    return result.rows[0];
};

const verifyPasswordResetToken = async (phoneNumber, resetToken) => {
    console.log('Verifying password reset token:', { phoneNumber, resetToken });
    const result = await pool.query(
        'SELECT id, username, phone_number FROM users WHERE phone_number = $1 AND verification_code = $2 AND verification_expires_at > NOW()',
        [phoneNumber, resetToken]
    );
    console.log('Verify password reset token result:', result.rows[0]);
    return result.rows[0];
};

module.exports = { 
    createOrder, 
    createUser, 
    getUserByUsername, 
    getUserByPhoneNumber, 
    verifyUser, 
    verifyUserByPhone,
    updateVerificationCode,
    setPasswordResetToken,
    updatePassword,
    verifyPasswordResetToken
};
