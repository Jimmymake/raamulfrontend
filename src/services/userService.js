// ==========================================
// USER SERVICE - User/Profile API calls
// ==========================================

import api from './api';

const userService = {
  // Get current user profile
  async getProfile() {
    return api.get('/users/profile');
  },

  // Get user by ID
  async getById(id) {
    return api.get(`/users/${id}`);
  },

  // Update user profile
  async updateProfile(id, userData) {
    return api.put(`/users/${id}`, userData);
  },

  // Get all users (Admin)
  async getAll(params = {}) {
    return api.get('/users', params);
  },

  // Get user statistics (Admin)
  async getStats() {
    return api.get('/users/stats');
  },

  // Create user (Admin)
  async create(userData) {
    return api.post('/users', userData);
  },

  // Change user status (Admin)
  async changeStatus(id, status) {
    return api.patch(`/users/${id}/status`, { status });
  },

  // Delete user (Super Admin)
  async delete(id) {
    return api.delete(`/users/${id}`);
  },
};

export default userService;
















