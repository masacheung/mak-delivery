import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Paper, Tab, Tabs, Alert } from '@mui/material';

const UserAuth = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phoneNumber: '+1',
    verificationCode: '',
    resetCode: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [isPasswordResetStep, setIsPasswordResetStep] = useState(false);
  const [passwordResetStage, setPasswordResetStage] = useState('request'); // 'request', 'verify', 'update'
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [tempResetToken, setTempResetToken] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setMessage('');
    setIsVerificationStep(false);
    setIsPasswordResetStep(false);
    setPasswordResetStage('request');
    setResendCooldown(0);
    setTempResetToken('');
    setFormData({
      username: '',
      password: '',
      phoneNumber: '+1',
      verificationCode: '',
      resetCode: '',
      newPassword: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      // Always maintain +1 prefix and format phone number
      let formattedValue = value;
      
      // Remove all non-digit characters except +
      formattedValue = formattedValue.replace(/[^\d+]/g, '');
      
      // Ensure it starts with +1
      if (!formattedValue.startsWith('+1')) {
        formattedValue = '+1' + formattedValue.replace(/^\+?1?/, '');
      }
      
      // Limit to +1 + 10 digits
      if (formattedValue.length > 12) {
        formattedValue = formattedValue.substring(0, 12);
      }
      
      setFormData({
        ...formData,
        [name]: formattedValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+1\d{10}$/;
    return phoneRegex.test(phone);
  };

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password || !formData.phoneNumber) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      showMessage('Please enter a valid US phone number (+1 followed by 10 digits)', 'error');
      return;
    }

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          phoneNumber: formData.phoneNumber
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage(data.message, 'success');
        setIsVerificationStep(true);
        setResendCooldown(60); // Start 60-second cooldown
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showMessage('Registration failed. Please try again.', 'error');
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (!formData.verificationCode) {
      showMessage('Please enter the verification code', 'error');
      return;
    }

    try {
      const response = await fetch('/api/users/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          verificationCode: formData.verificationCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage(data.message, 'success');
        setIsVerificationStep(false);
        setActiveTab(1); // Switch to login tab
        setFormData({
          username: '',
          password: '',
          phoneNumber: '+1',
          verificationCode: '',
          resetCode: '',
          newPassword: ''
        });
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showMessage('Verification failed. Please try again.', 'error');
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) {
      showMessage(`Please wait ${resendCooldown} seconds before resending`, 'warning');
      return;
    }

    try {
      const response = await fetch('/api/users/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage(data.message, 'success');
        setResendCooldown(60); // Start 60-second cooldown
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      showMessage('Failed to resend verification code. Please try again.', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setIsLoggedIn(true);
        setUser(data.user);
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showMessage('Login failed. Please try again.', 'error');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (passwordResetStage === 'request') {
      if (!formData.phoneNumber) {
        showMessage('Please enter your phone number', 'error');
        return;
      }

      if (!validatePhoneNumber(formData.phoneNumber)) {
        showMessage('Please enter a valid US phone number (+1 followed by 10 digits)', 'error');
        return;
      }

      try {
        const response = await fetch('/api/users/reset-password-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: formData.phoneNumber
          }),
        });

        const data = await response.json();

        if (data.success) {
          showMessage(data.message, 'success');
          setPasswordResetStage('verify');
        } else {
          showMessage(data.message, 'error');
        }
      } catch (error) {
        console.error('Password reset request error:', error);
        showMessage('Failed to send reset code. Please try again.', 'error');
      }
    } else if (passwordResetStage === 'verify') {
      if (!formData.resetCode) {
        showMessage('Please enter the reset code', 'error');
        return;
      }

      try {
        const response = await fetch('/api/users/reset-password-verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: formData.phoneNumber,
            resetCode: formData.resetCode
          }),
        });

        const data = await response.json();
        console.log('Password reset verify response:', data);

        if (data.success) {
          showMessage(data.message, 'success');
          setTempResetToken(data.tempToken); // Store the temporary token
          console.log('Stored temp token:', data.tempToken);
          setPasswordResetStage('update');
        } else {
          showMessage(data.message, 'error');
        }
      } catch (error) {
        console.error('Password reset verification error:', error);
        showMessage('Failed to verify reset code. Please try again.', 'error');
      }
    } else if (passwordResetStage === 'update') {
      if (!formData.newPassword) {
        showMessage('Please enter your new password', 'error');
        return;
      }

      if (formData.newPassword.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
      }

      console.log('About to send password update with:', { phoneNumber: formData.phoneNumber, tempToken: tempResetToken, newPasswordLength: formData.newPassword.length });

      try {
        const response = await fetch('/api/users/reset-password-update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: formData.phoneNumber,
            tempToken: tempResetToken, // Use temporary token instead of resetCode
            newPassword: formData.newPassword
          }),
        });

        const data = await response.json();
        console.log('Password reset update response:', data);

        if (data.success) {
          showMessage(data.message, 'success');
          setIsPasswordResetStep(false);
          setPasswordResetStage('request');
          setTempResetToken('');
          setFormData({
            username: '',
            password: '',
            phoneNumber: '+1',
            verificationCode: '',
            resetCode: '',
            newPassword: ''
          });
        } else {
          showMessage(data.message, 'error');
        }
      } catch (error) {
        console.error('Password update error:', error);
        showMessage('Failed to update password. Please try again.', 'error');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUser(null);
    setTempResetToken('');
    setFormData({
      username: '',
      password: '',
      phoneNumber: '+1',
      verificationCode: '',
      resetCode: '',
      newPassword: ''
    });
    showMessage('Logged out successfully', 'success');
  };

  if (isLoggedIn) {
    return (
      <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome, {user?.username}!
          </Typography>
          <Typography variant="body1" gutterBottom align="center">
            Phone: {user?.phoneNumber}
          </Typography>
          <Typography variant="body2" gutterBottom align="center" color="success.main">
            Account Status: {user?.isVerified ? 'Verified' : 'Not Verified'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {isPasswordResetStep ? 'Reset Password' : 'User Authentication'}
        </Typography>
        
        {message && (
          <Alert severity={messageType} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {isPasswordResetStep ? (
          <Box component="form" onSubmit={handlePasswordReset} sx={{ mt: 2 }}>
            {passwordResetStage === 'request' && (
              <>
                <Typography variant="h6" gutterBottom>
                  Enter Your Phone Number
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Enter the phone number you used to create your account
                </Typography>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  margin="normal"
                  placeholder="+1234567890"
                  required
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 1 }}
                >
                  Send Reset Code
                </Button>
              </>
            )}

            {passwordResetStage === 'verify' && (
              <>
                <Typography variant="h6" gutterBottom>
                  Enter Reset Code
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Please enter the 6-digit reset code sent to {formData.phoneNumber}
                </Typography>
                <TextField
                  fullWidth
                  label="Reset Code"
                  name="resetCode"
                  value={formData.resetCode}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  inputProps={{ maxLength: 6 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 1 }}
                >
                  Verify Code
                </Button>
              </>
            )}

            {passwordResetStage === 'update' && (
              <>
                <Typography variant="h6" gutterBottom>
                  Set New Password
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Enter your new password
                </Typography>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 1 }}
                >
                  Update Password
                </Button>
              </>
            )}

            <Button
              fullWidth
              variant="text"
              onClick={() => {
                setIsPasswordResetStep(false);
                setPasswordResetStage('request');
                setTempResetToken('');
              }}
            >
              Back to Login
            </Button>
          </Box>
        ) : (
          <>
            {!isVerificationStep ? (
              <>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                  <Tab label="Register" />
                  <Tab label="Login" />
                </Tabs>

                {activeTab === 0 && (
                  <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      margin="normal"
                      placeholder="+1234567890"
                      helperText="US phone number starting with +1"
                      required
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Register
                    </Button>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Login
                    </Button>
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => setIsPasswordResetStep(true)}
                      sx={{ mt: 1 }}
                    >
                      Forgot Password?
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Box component="form" onSubmit={handleVerification} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Phone Verification
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Please enter the 6-digit verification code sent to {formData.phoneNumber}
                </Typography>
                <TextField
                  fullWidth
                  label="Verification Code"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  inputProps={{ maxLength: 6 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 1 }}
                >
                  Verify
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleResendVerification}
                  sx={{ mb: 1 }}
                  disabled={resendCooldown > 0}
                >
                  {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => setIsVerificationStep(false)}
                >
                  Back to Registration
                </Button>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default UserAuth; 