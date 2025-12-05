// ==========================================
// ORDER SERVICE - Order API calls
// ==========================================

import api from './api';

const orderService = {
  // Create new order
  async create(orderData) {
    return api.post('/orders', orderData);
  },

  // Get all orders (with pagination & filters)
  async getAll(params = {}) {
    return api.get('/orders', params);
  },

  // Get order by database ID
  async getById(id) {
    return api.get(`/orders/${id}`);
  },

  // Get order by order_id string
  async getByOrderId(orderId) {
    return api.get(`/orders/order-id/${orderId}`);
  },

  // Get orders by customer ID
  async getByCustomerId(customerId, params = {}) {
    return api.get(`/orders/customer/${customerId}`, params);
  },

  // Update order (Admin)
  async update(id, orderData) {
    return api.put(`/orders/${id}`, orderData);
  },

  // Delete order (Admin)
  async delete(id) {
    return api.delete(`/orders/${id}`);
  },

  // Generate order ID
  generateOrderId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  },
};

export default orderService;




