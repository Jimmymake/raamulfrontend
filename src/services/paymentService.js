// ==========================================
// PAYMENT SERVICE - M-Pesa Payment API calls
// ==========================================

import api from './api';

const paymentService = {
  // Initiate M-Pesa STK Push (backend handles Mam-Laka token)
  async initiate(orderId, phoneNumber) {
    return api.post('/payments/initiate', {
      order_id: orderId,
      phone_number: phoneNumber,
    });
  },

  // Check payment status by checkout request ID
  async checkStatus(checkoutRequestId) {
    return api.get(`/payments/status/${checkoutRequestId}`);
  },

  // Get all payments (with filters)
  async getAll(params = {}) {
    return api.get('/payments', params);
  },

  // Get payment by ID
  async getById(id) {
    return api.get(`/payments/${id}`);
  },

  // Get payments for an order
  async getByOrderId(orderId) {
    return api.get(`/payments/order/${orderId}`);
  },

  // Get payments for a user
  async getByUserId(userId, params = {}) {
    return api.get(`/payments/user/${userId}`, params);
  },

  // Get payment statistics (Admin)
  async getStatistics() {
    return api.get('/payments/statistics/all');
  },

  // Cancel a pending payment
  async cancel(id) {
    return api.patch(`/payments/${id}/cancel`);
  },

  // Format phone number for M-Pesa
  formatPhoneNumber(phone) {
    // Remove spaces and dashes
    let formatted = phone.replace(/[\s-]/g, '');
    
    // If starts with 0, replace with +254
    if (formatted.startsWith('0')) {
      formatted = '+254' + formatted.substring(1);
    }
    
    // If starts with 254 (no +), add +
    if (formatted.startsWith('254')) {
      formatted = '+' + formatted;
    }
    
    // Ensure it has + prefix
    if (!formatted.startsWith('+')) {
      formatted = '+254' + formatted;
    }
    
    return formatted;
  },
};

export default paymentService;
