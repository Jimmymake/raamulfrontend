// ==========================================
// ADMIN ORDERS - Order Management
// ==========================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout/AdminLayout';
import { LoadingSpinner } from '../../../components/common';
import { useNotification } from '../../../context/NotificationContext';
import orderService from '../../../services/orderService';
import trackingService from '../../../services/trackingService';
import './AdminOrders.scss';

const AdminOrders = () => {
  const { showSuccess, showError } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filter !== 'all') params.order_status = filter;
      
      const data = await orderService.getAll(params);
      setOrders(data.orders || []);
      if (data.pagination) {
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const parseJsonField = (field) => {
    if (typeof field === 'string') {
      try { return JSON.parse(field); } catch { return field; }
    }
    return field;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setUpdating(true);
    try {
      // Update order status
      await orderService.update(selectedOrder.id, { order_status: newStatus });
      
      // Add tracking entry
      if (statusNote) {
        await trackingService.addUpdate({
          order_id: selectedOrder.id,
          status: newStatus,
          notes: statusNote
        });
      }
      
      showSuccess('Order status updated');
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus('');
      setStatusNote('');
      fetchOrders();
    } catch (error) {
      showError(error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.order_status);
    setShowStatusModal(true);
  };

  const statusOptions = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
  const filters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <AdminLayout>
      <div className="admin-orders">
        <div className="admin-orders__header">
          <div>
            <h1>Orders</h1>
            <p>Manage and track all orders</p>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-orders__filters">
          {filters.map((status) => (
            <button
              key={status}
              className={`admin-orders__filter ${filter === status ? 'admin-orders__filter--active' : ''}`}
              onClick={() => {
                setFilter(status);
                setPagination(p => ({ ...p, page: 1 }));
              }}
            >
              {status === 'all' ? 'All Orders' : trackingService.getStatusInfo(status).label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="admin-orders__loading">
            <LoadingSpinner size="large" text="Loading orders..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-orders__empty">
            <p>No orders found</p>
          </div>
        ) : (
          <>
            <div className="admin-orders__table">
              <div className="admin-orders__table-header">
                <span>Order ID</span>
                <span>Customer</span>
                <span>Items</span>
                <span>Total</span>
                <span>Payment</span>
                <span>Status</span>
                <span>Date</span>
                <span>Actions</span>
              </div>
              {orders.map((order) => {
                const customer = parseJsonField(order.customer) || {};
                const items = parseJsonField(order.items) || [];
                const pricing = parseJsonField(order.pricing) || {};
                const payment = parseJsonField(order.payment) || {};
                const statusInfo = trackingService.getStatusInfo(order.order_status);

                return (
                  <div key={order.id} className="admin-orders__table-row">
                    <span className="admin-orders__order-id">{order.order_id}</span>
                    <div className="admin-orders__customer">
                      <span>{customer.name || 'N/A'}</span>
                      <small>{customer.email}</small>
                    </div>
                    <span>{items.length} items</span>
                    <span className="admin-orders__total">
                      KES {(pricing.total || 0).toLocaleString()}
                    </span>
                    <span className={`admin-orders__payment admin-orders__payment--${payment.status}`}>
                      {payment.status === 'completed' ? '✓ Paid' : payment.status === 'failed' ? '✗ Failed' : '⏳ Pending'}
                    </span>
                    <span 
                      className="admin-orders__status"
                      style={{ color: statusInfo.color, background: `${statusInfo.color}15` }}
                    >
                      {statusInfo.label}
                    </span>
                    <span className="admin-orders__date">{formatDate(order.created_at)}</span>
                    <div className="admin-orders__actions">
                      <Link 
                        to={`/admin/orders/${order.id}`}
                        className="admin-orders__action-btn"
                      >
                        View
                      </Link>
                      <button 
                        className="admin-orders__action-btn admin-orders__action-btn--status"
                        onClick={() => openStatusModal(order)}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="admin-orders__pagination">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                >
                  Previous
                </button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedOrder && (
          <div className="admin-orders__modal-overlay" onClick={() => setShowStatusModal(false)}>
            <div className="admin-orders__modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-orders__modal-header">
                <h2>Update Order Status</h2>
                <button onClick={() => setShowStatusModal(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              <div className="admin-orders__modal-content">
                <p className="admin-orders__modal-order">Order: <strong>{selectedOrder.order_id}</strong></p>
                
                <div className="admin-orders__field">
                  <label>New Status</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {trackingService.getStatusInfo(status).label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-orders__field">
                  <label>Status Note (Optional)</label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note about this status update..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="admin-orders__modal-actions">
                <button 
                  className="admin-orders__btn-cancel"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="admin-orders__btn-submit"
                  onClick={handleUpdateStatus}
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
















