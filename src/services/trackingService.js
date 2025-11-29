// ==========================================
// TRACKING SERVICE - Order Tracking API calls
// ==========================================

import api from './api';

const trackingService = {
  // Add tracking update (Admin)
  async addUpdate(trackingData) {
    return api.post('/tracking', trackingData);
  },

  // Get tracking history for an order
  async getByOrderId(orderId) {
    return api.get(`/tracking/order/${orderId}`);
  },

  // Get latest tracking status for an order
  async getLatest(orderId) {
    return api.get(`/tracking/order/${orderId}/latest`);
  },

  // Get all tracking updates (Admin)
  async getAll(params = {}) {
    return api.get('/tracking', params);
  },

  // Delete tracking entry (Admin)
  async delete(id) {
    return api.delete(`/tracking/${id}`);
  },

  // Status definitions for UI
  statuses: {
    pending: { label: 'Pending', color: '#f59e0b', icon: '⏳' },
    confirmed: { label: 'Confirmed', color: '#3b82f6', icon: '✓' },
    processing: { label: 'Processing', color: '#8b5cf6', icon: '⚙️' },
    packed: { label: 'Packed', color: '#06b6d4', icon: '📦' },
    shipped: { label: 'Shipped', color: '#0ea5e9', icon: '🚚' },
    out_for_delivery: { label: 'Out for Delivery', color: '#10b981', icon: '🏃' },
    delivered: { label: 'Delivered', color: '#22c55e', icon: '✅' },
    cancelled: { label: 'Cancelled', color: '#ef4444', icon: '❌' },
    returned: { label: 'Returned', color: '#f97316', icon: '↩️' },
  },

  // Get status info
  getStatusInfo(status) {
    return this.statuses[status] || this.statuses.pending;
  },

  // Get status order for timeline
  getStatusOrder() {
    return ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
  },
};

export default trackingService;

