import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/apiClient';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const validateWithServer = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }

    try {
      const response = await apiFetch('/api/users/me', { auth: 'user' });

      if (!response.ok) {
        logout();
        return false;
      }

      const data = await response.json();
      if (!data.success || !data.user) {
        logout();
        return false;
      }

      localStorage.setItem('userData', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      const cached = localStorage.getItem('userData');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
          setIsAuthenticated(true);
          return true;
        } catch {
          /* fall through */
        }
      }
      logout();
      return false;
    }
  }, [logout]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await validateWithServer();
      if (!cancelled) {
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [validateWithServer]);

  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    await validateWithServer();
    setLoading(false);
  }, [validateWithServer]);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
  };
};
