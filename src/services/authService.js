// ==========================================
// AUTH SERVICE - Authentication API calls
// ==========================================

import api from './api';

const authService = {
  // Login user
  async login(username, password) {
    const data = await api.post('/auth/login', { username, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Signup new user
  async signup(userData) {
    const data = await api.post('/auth/signup', userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Verify token
  async verifyToken() {
    return api.get('/auth/verify');
  },

  // Forgot password - send reset email
  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },

  // Verify reset token
  async verifyResetToken(token) {
    return api.get(`/auth/verify-reset-token/${token}`);
  },

  // Reset password with token
  async resetPassword(token, newPassword) {
    return api.post('/auth/reset-password', { token, newPassword });
  },

  // Change password (authenticated)
  async changePassword(currentPassword, newPassword) {
    return api.post('/auth/change-password', { currentPassword, newPassword });
  },

  // Verify email
  async verifyEmail(token) {
    return api.get(`/auth/verify-email/${token}`);
  },

  // Resend verification email
  async resendVerification() {
    return api.post('/auth/resend-verification');
  },

  // Get verification status
  async getVerificationStatus() {
    return api.get('/auth/verification-status');
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};

export default authService;






