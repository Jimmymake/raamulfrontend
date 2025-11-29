// ==========================================
// AUTH CONTEXT - Global Authentication State
// ==========================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          const data = await authService.verifyToken();
          setUser(data.user || JSON.parse(savedUser));
          setToken(savedToken);
          setEmailVerified(data.user?.email_verified || false);
        } catch (error) {
          console.error('Token verification failed:', error);
          // If offline, keep user logged in
          if (error.message === 'Failed to fetch') {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
          }
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  // Login
  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      setToken(data.token);
      setUser(data.user);
      setEmailVerified(data.user?.email_verified || false);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  // Signup
  const signup = async (userData) => {
    try {
      const data = await authService.signup(userData);
      setToken(data.token);
      setUser(data.user);
      setEmailVerified(false); // New users need to verify email
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setEmailVerified(false);
  };

  // Update user data in context
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Check verification status
  const checkVerificationStatus = async () => {
    try {
      const data = await authService.getVerificationStatus();
      setEmailVerified(data.email_verified);
      return data.email_verified;
    } catch (error) {
      console.error('Failed to check verification status:', error);
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    emailVerified,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
    login,
    signup,
    logout,
    updateUser,
    checkVerificationStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

