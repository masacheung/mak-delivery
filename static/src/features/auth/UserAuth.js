import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Paper, Tab, Tabs, Alert } from '@mui/material';

const UserAuth = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phoneNumber: '',
    verificationCode: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setMessage('');
    setIsVerificationStep(false);
    setFormData({
      username: '',
      password: '',
      phoneNumber: '',
      verificationCode: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          phoneNumber: '',
          verificationCode: ''
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUser(null);
    setFormData({
      username: '',
      password: '',
      phoneNumber: '',
      verificationCode: ''
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
          User Authentication
        </Typography>
        
        {message && (
          <Alert severity={messageType} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

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
            >
              Resend Code
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
      </Paper>
    </Box>
  );
};

export default UserAuth; 