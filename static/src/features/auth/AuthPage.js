import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from './AuthForm';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return (
    <AuthForm
      variant="fullPage"
      onNavigateBack={() => navigate('/')}
      onLoginSuccess={(token, user) => {
        login(token, user);
        setTimeout(() => navigate(redirectTo), 1000);
      }}
    />
  );
};

export default AuthPage;
