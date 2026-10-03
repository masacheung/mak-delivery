import { useState, useEffect, useCallback } from 'react';
import { apiFetch, refreshSession } from '../utils/apiClient';
import { stopPushNotifications } from '../utils/pushNotifications';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    localStorage.setItem('makSignedOut', '1');
    await Promise.allSettled([stopPushNotifications(), apiFetch('/api/users/logout', { method: 'POST' })]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('makAdminToken');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const validateWithServer = useCallback(async () => {
    let token = localStorage.getItem('authToken');
    if (!token) { try { if (await refreshSession()) token = localStorage.getItem('authToken'); } catch { /* Sign-in remains available offline. */ } }
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
    localStorage.removeItem('makSignedOut');
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
