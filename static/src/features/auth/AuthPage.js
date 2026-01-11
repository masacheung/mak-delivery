import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, Typography, Box, Paper, Tab, Tabs, Alert, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../hooks/useAuth';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phoneNumber: '+1',
    verificationCode: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [isPasswordResetStep, setIsPasswordResetStep] = useState(false);
  const [isFindUsernameStep, setIsFindUsernameStep] = useState(false);
  const [passwordResetStage, setPasswordResetStage] = useState('request'); // 'request', 'update'
  const [resendCooldown, setResendCooldown] = useState(0);
  const [tempResetToken, setTempResetToken] = useState('');
  const [foundUsername, setFoundUsername] = useState('');
  const [findUsernamePhoneNumber, setFindUsernamePhoneNumber] = useState('+1');

  // Get redirect URL from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/';

  // If user is already authenticated, redirect them
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

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
    setIsFindUsernameStep(false);
    setPasswordResetStage('request');
    setResendCooldown(0);
    setTempResetToken('');
    setFoundUsername('');
    setFindUsernamePhoneNumber('+1');
    setFormData({
      username: '',
      password: '',
      phoneNumber: '+1',
      verificationCode: '',
      resetCode: '',
      newPassword: '',
      confirmPassword: ''
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
          username: formData.username, // Keep username for easier login
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
        login(data.token, data.user);
        showMessage(data.message, 'success');
        
        // Redirect to the original destination
        setTimeout(() => {
          navigate(redirectTo);
        }, 1000);
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
      if (!formData.username || !formData.phoneNumber) {
        showMessage('Please enter your username and phone number', 'error');
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
            username: formData.username,
            phoneNumber: formData.phoneNumber
          }),
        });

        const data = await response.json();

        if (data.success) {
          showMessage(data.message, 'success');
          setPasswordResetStage('update');
        } else {
          showMessage(data.message, 'error');
        }
      } catch (error) {
        console.error('Password reset request error:', error);
        showMessage('Failed to verify credentials. Please try again.', 'error');
      }
    } else if (passwordResetStage === 'update') {
      if (!formData.newPassword || !formData.confirmPassword) {
        showMessage('Please enter your new password and confirm it', 'error');
        return;
      }

      if (formData.newPassword.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
      }

      try {
        const response = await fetch('/api/users/reset-password-update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            phoneNumber: formData.phoneNumber,
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
            newPassword: '',
            confirmPassword: ''
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

  const handleBack = () => {
    navigate('/');
  };

  const handleFindUsername = async (e) => {
    e.preventDefault();
    
    if (!findUsernamePhoneNumber) {
      showMessage('Please enter your phone number', 'error');
      return;
    }

    if (!validatePhoneNumber(findUsernamePhoneNumber)) {
      showMessage('Please enter a valid US phone number (+1 followed by 10 digits)', 'error');
      return;
    }

    try {
      const response = await fetch('/api/users/find-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: findUsernamePhoneNumber
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFoundUsername(data.username);
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message, 'error');
        setFoundUsername('');
      }
    } catch (error) {
      console.error('Find username error:', error);
      showMessage('Failed to find username. Please try again.', 'error');
      setFoundUsername('');
    }
  };

  const handleFindUsernamePhoneChange = (e) => {
    const { value } = e.target;
    
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
    
    setFindUsernamePhoneNumber(formattedValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: 2 }}>
      <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1, textAlign: 'center' }}>
              {isPasswordResetStep ? 'Reset Password' : isFindUsernameStep ? 'Find Username' : 'Authentication'}
            </Typography>
          </Box>
          
          {message && (
            <Alert severity={messageType} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          {isFindUsernameStep ? (
            <Box component="form" onSubmit={handleFindUsername} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Find Your Username
              </Typography>
              <Typography variant="body2" gutterBottom>
                Enter your phone number to retrieve your username
              </Typography>
              <TextField
                fullWidth
                label="Phone Number"
                name="findUsernamePhoneNumber"
                value={findUsernamePhoneNumber}
                onChange={handleFindUsernamePhoneChange}
                margin="normal"
                placeholder="+1234567890"
                required
              />
              {foundUsername && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Your username is:
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {foundUsername}
                  </Typography>
                </Box>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 1 }}
              >
                Find Username
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => {
                  setIsFindUsernameStep(false);
                  setFoundUsername('');
                  setFindUsernamePhoneNumber('+1');
                }}
              >
                Back to Login
              </Button>
            </Box>
          ) : isPasswordResetStep ? (
            <Box component="form" onSubmit={handlePasswordReset} sx={{ mt: 2 }}>
              {passwordResetStage === 'request' && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Reset Password
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Enter your username and phone number to reset your password
                  </Typography>
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
                    Submit
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
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
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
                setFormData({
                  ...formData,
                  username: '',
                  newPassword: '',
                  confirmPassword: '',
                  phoneNumber: '+1'
                });
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
                        onClick={() => setIsFindUsernameStep(true)}
                        sx={{ mt: 1 }}
                      >
                        Forget Username?
                      </Button>
                      <Button
                        fullWidth
                        variant="text"
                        onClick={() => setIsPasswordResetStep(true)}
                        sx={{ mt: 0.5 }}
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
    </Box>
  );
};

export default AuthPage; 