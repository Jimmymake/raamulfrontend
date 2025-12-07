// ==========================================
// ORDERS PAGE - Order History & Tracking
// ==========================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Navbar, LoadingSpinner } from '../../../components/common';
import orderService from '../../../services/orderService';
import trackingService from '../../../services/trackingService';
import './OrdersPage.scss';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: pagination.limit };
      if (filter !== 'all') {
        params.order_status = filter;
      }

      const data = await orderService.getAll(params);
      setOrders(data.orders || []);
      
      if (data.pagination) {
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [filter]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    return trackingService.getStatusInfo(status);
  };

  const getPaymentInfo = (status) => {
    const statuses = {
      pending: { label: 'Pending', color: '#f59e0b' },
      completed: { label: 'Paid', color: '#10b981' },
      failed: { label: 'Failed', color: '#ef4444' }
    };
    return statuses[status] || statuses.pending;
  };

  const parseJsonField = (field) => {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    }
    return field;
  };

  const handlePageChange = (newPage) => {
    fetchOrders(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="orders-page">
      <Navbar />

      <main className="orders-page__main">
        <div className="orders-page__container">
          <div className="orders-page__header">
            <div>
              <h1>My Orders</h1>
              <p>Track and manage your orders</p>
            </div>
            <Link to="/products" className="orders-page__new-btn">
              + New Order
            </Link>
          </div>

          {/* Filters */}
          <div className="orders-page__filters">
            {filters.map(status => (
              <button
                key={status}
                className={`orders-page__filter ${filter === status ? 'orders-page__filter--active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status === 'all' ? 'All Orders' : trackingService.getStatusInfo(status).label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="orders-page__loading">
              <LoadingSpinner size="large" text="Loading orders..." />
            </div>
          ) : orders.length === 0 ? (
            <div className="orders-page__empty">
              <div className="orders-page__empty-icon">📦</div>
              <h2>No orders found</h2>
              <p>{filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders.`}</p>
              <Link to="/products" className="orders-page__btn">Browse Products</Link>
            </div>
          ) : (
            <>
              <div className="orders-page__list">
                {orders.map(order => {
                  const statusInfo = getStatusInfo(order.order_status);
                  const payment = parseJsonField(order.payment);
                  const paymentInfo = getPaymentInfo(payment?.status);
                  const isExpanded = expandedOrder === order.id;
                  const items = parseJsonField(order.items) || [];
                  const pricing = parseJsonField(order.pricing) || {};
                  const shipping = parseJsonField(order.shipping) || {};

                  return (
                    <div key={order.id} className="orders-page__order">
                      {/* Order Header */}
                      <div 
                        className="orders-page__order-header"
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <div className="orders-page__order-info">
                          <div className="orders-page__order-col">
                            <span className="orders-page__label">Order</span>
                            <span className="orders-page__value orders-page__value--id">{order.order_id}</span>
                          </div>
                          <div className="orders-page__order-col">
                            <span className="orders-page__label">Date</span>
                            <span className="orders-page__value">{formatDate(order.created_at)}</span>
                          </div>
                          <div className="orders-page__order-col">
                            <span className="orders-page__label">Items</span>
                            <span className="orders-page__value">{items.length}</span>
                          </div>
                          <div className="orders-page__order-col">
                            <span className="orders-page__label">Total</span>
                            <span className="orders-page__value orders-page__value--total">
                              KES {(pricing.total || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="orders-page__order-status">
                          <span 
                            className="orders-page__status-badge"
                            style={{ 
                              color: statusInfo.color, 
                              background: `${statusInfo.color}15` 
                            }}
                          >
                            {statusInfo.label}
                          </span>
                          <span 
                            className="orders-page__payment-badge"
                            style={{ color: paymentInfo.color }}
                          >
                            {paymentInfo.label}
                          </span>
                          <button className="orders-page__expand-btn">
                            <svg 
                              width="20" 
                              height="20" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2"
                              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Order Details */}
                      {isExpanded && (
                        <div className="orders-page__order-details">
                          <div className="orders-page__details-grid">
                            {/* Items */}
                            <div className="orders-page__details-section">
                              <h4>Order Items</h4>
                              <div className="orders-page__items-list">
                                {items.map((item, index) => (
                                  <div key={index} className="orders-page__item-row">
                                    <div className="orders-page__item-info">
                                      <span className="orders-page__item-name">{item.name}</span>
                                      <span className="orders-page__item-qty">x{item.quantity}</span>
                                    </div>
                                    <span className="orders-page__item-price">
                                      KES {(item.price * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Pricing */}
                            <div className="orders-page__details-section">
                              <h4>Pricing</h4>
                              <div className="orders-page__pricing">
                                <div className="orders-page__pricing-row">
                                  <span>Subtotal</span>
                                  <span>KES {(pricing.subtotal || 0).toLocaleString()}</span>
                                </div>
                                <div className="orders-page__pricing-row">
                                  <span>Tax (16%)</span>
                                  <span>KES {(pricing.tax || 0).toLocaleString()}</span>
                                </div>
                                <div className="orders-page__pricing-row">
                                  <span>Shipping</span>
                                  <span>{pricing.shipping === 0 ? 'FREE' : `KES ${(pricing.shipping || 0).toLocaleString()}`}</span>
                                </div>
                                <div className="orders-page__pricing-row orders-page__pricing-row--total">
                                  <span>Total</span>
                                  <span>KES {(pricing.total || 0).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Shipping */}
                            <div className="orders-page__details-section">
                              <h4>Shipping</h4>
                              <div className="orders-page__shipping">
                                <p>{shipping.address || 'No address provided'}</p>
                                <p className="orders-page__shipping-method">{shipping.method || 'Standard Delivery'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="orders-page__order-actions">
                            {order.order_status === 'pending' && payment?.status !== 'completed' && (
                              <Link to={`/payment/${order.id}`} className="orders-page__action-btn orders-page__action-btn--primary">
                                Pay Now
                              </Link>
                            )}
                            <button className="orders-page__action-btn orders-page__action-btn--outline">
                              Track Order
                            </button>
                            {order.order_status === 'pending' && (
                              <button className="orders-page__action-btn orders-page__action-btn--danger">
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="orders-page__pagination">
                  <button
                    className="orders-page__page-btn"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </button>
                  <span className="orders-page__page-info">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    className="orders-page__page-btn"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;






