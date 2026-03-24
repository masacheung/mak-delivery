import React from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from './AuthForm';

/**
 * Standalone auth card (same flows as /auth). Use inside a page or story; app routing uses AuthPage.
 */
const UserAuth = () => {
  const { login, logout, user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
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
          <Button variant="contained" color="primary" fullWidth onClick={logout} sx={{ mt: 2 }}>
            Logout
          </Button>
        </Paper>
      </Box>
    );
  }

  return <AuthForm variant="standalone" onLoginSuccess={(token, u) => login(token, u)} />;
};

export default UserAuth;
