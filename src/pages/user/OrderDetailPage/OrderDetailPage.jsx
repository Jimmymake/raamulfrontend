// ==========================================
// ORDER DETAIL PAGE - Full Order View with Tracking
// ==========================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { Navbar, LoadingSpinner } from '../../../components/common';
import orderService from '../../../services/orderService';
import trackingService from '../../../services/trackingService';
import './OrderDetailPage.scss';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useNotification();
  
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const [orderData, trackingData] = await Promise.all([
        orderService.getById(id),
        trackingService.getByOrderId(id).catch(() => ({ tracking: [] }))
      ]);
      
      setOrder(orderData.order);
      setTracking(trackingData.tracking || []);
    } catch (error) {
      showError('Failed to load order details.');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => trackingService.getStatusInfo(status);
  const statusOrder = trackingService.getStatusOrder();

  if (loading) {
    return (
      <div className="order-detail">
        <Navbar />
        <LoadingSpinner fullScreen text="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail">
        <Navbar />
        <div className="order-detail__not-found">
          <h2>Order Not Found</h2>
          <Link to="/orders">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const items = parseJsonField(order.items) || [];
  const pricing = parseJsonField(order.pricing) || {};
  const shipping = parseJsonField(order.shipping) || {};
  const payment = parseJsonField(order.payment) || {};
  const customer = parseJsonField(order.customer) || {};
  const currentStatusInfo = getStatusInfo(order.order_status);
  const currentStatusIndex = statusOrder.indexOf(order.order_status);

  return (
    <div className="order-detail">
      <Navbar />

      <main className="order-detail__main">
        <div className="order-detail__container">
          {/* Back Link */}
          <Link to="/orders" className="order-detail__back">
            ← Back to Orders
          </Link>

          {/* Header */}
          <div className="order-detail__header">
            <div className="order-detail__header-info">
              <h1>Order {order.order_id}</h1>
              <p>Placed on {formatDate(order.created_at)}</p>
            </div>
            <div className="order-detail__header-status">
              <span 
                className="order-detail__status-badge"
                style={{ 
                  color: currentStatusInfo.color,
                  background: `${currentStatusInfo.color}15`
                }}
              >
                {currentStatusInfo.icon} {currentStatusInfo.label}
              </span>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="order-detail__tracking">
            <h2>Order Progress</h2>
            <div className="order-detail__timeline">
              {statusOrder.map((status, index) => {
                const statusInfo = getStatusInfo(status);
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const trackingEntry = tracking.find(t => t.status === status);

                return (
                  <div 
                    key={status}
                    className={`order-detail__timeline-item ${isCompleted ? 'order-detail__timeline-item--completed' : ''} ${isCurrent ? 'order-detail__timeline-item--current' : ''}`}
                  >
                    <div className="order-detail__timeline-marker">
                      <div 
                        className="order-detail__timeline-dot"
                        style={{ 
                          background: isCompleted ? statusInfo.color : '#333',
                          borderColor: isCompleted ? statusInfo.color : '#444'
                        }}
                      >
                        {isCompleted && '✓'}
                      </div>
                      {index < statusOrder.length - 1 && (
                        <div 
                          className="order-detail__timeline-line"
                          style={{ 
                            background: isCompleted && index < currentStatusIndex 
                              ? statusInfo.color 
                              : '#333'
                          }}
                        />
                      )}
                    </div>
                    <div className="order-detail__timeline-content">
                      <h4 style={{ color: isCompleted ? statusInfo.color : '#666' }}>
                        {statusInfo.label}
                      </h4>
                      {trackingEntry && (
                        <>
                          <p className="order-detail__timeline-note">{trackingEntry.notes}</p>
                          <span className="order-detail__timeline-time">
                            {formatDate(trackingEntry.created_at)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="order-detail__grid">
            {/* Order Items */}
            <div className="order-detail__section">
              <h2>Order Items</h2>
              <div className="order-detail__items">
                {items.map((item, index) => (
                  <div key={index} className="order-detail__item">
                    <div className="order-detail__item-image">
                      <img 
                        src={item.image || '/src/images/productimages/img8.jpg'} 
                        alt={item.name}
                      />
                    </div>
                    <div className="order-detail__item-info">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <div className="order-detail__item-price">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-detail__section">
              <h2>Order Summary</h2>
              <div className="order-detail__summary">
                <div className="order-detail__summary-row">
                  <span>Subtotal</span>
                  <span>KES {(pricing.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="order-detail__summary-row">
                  <span>Tax (16%)</span>
                  <span>KES {(pricing.tax || 0).toLocaleString()}</span>
                </div>
                <div className="order-detail__summary-row">
                  <span>Shipping</span>
                  <span>{pricing.shipping === 0 ? 'FREE' : `KES ${(pricing.shipping || 0).toLocaleString()}`}</span>
                </div>
                <div className="order-detail__summary-divider" />
                <div className="order-detail__summary-row order-detail__summary-row--total">
                  <span>Total</span>
                  <span>KES {(pricing.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="order-detail__section">
              <h2>Shipping Information</h2>
              <div className="order-detail__info-card">
                <div className="order-detail__info-row">
                  <span className="order-detail__info-label">Recipient</span>
                  <span>{customer.name || user?.username}</span>
                </div>
                <div className="order-detail__info-row">
                  <span className="order-detail__info-label">Address</span>
                  <span>{shipping.address || 'Not provided'}</span>
                </div>
                <div className="order-detail__info-row">
                  <span className="order-detail__info-label">Method</span>
                  <span>{shipping.method || 'Standard Delivery'}</span>
                </div>
                <div className="order-detail__info-row">
                  <span className="order-detail__info-label">Phone</span>
                  <span>{customer.phone || user?.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="order-detail__section">
              <h2>Payment Information</h2>
              <div className="order-detail__info-card">
                <div className="order-detail__info-row">
                  <span className="order-detail__info-label">Method</span>
                  <span>{payment.method || 'M-Pesa'}</span>
                </div>
                <div className="order-detail__info-row">
                  <span className="order-detail__info-label">Status</span>
                  <span 
                    className={`order-detail__payment-status order-detail__payment-status--${payment.status || 'pending'}`}
                  >
                    {payment.status === 'completed' ? '✓ Paid' : payment.status === 'failed' ? '✗ Failed' : '⏳ Pending'}
                  </span>
                </div>
                {payment.transaction_id && (
                  <div className="order-detail__info-row">
                    <span className="order-detail__info-label">Transaction ID</span>
                    <span>{payment.transaction_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="order-detail__actions">
            {order.order_status === 'pending' && payment.status !== 'completed' && (
              <Link to={`/payment/${order.id}`} className="order-detail__btn order-detail__btn--primary">
                Pay Now
              </Link>
            )}
            <button className="order-detail__btn order-detail__btn--outline">
              Download Invoice
            </button>
            <button className="order-detail__btn order-detail__btn--outline">
              Contact Support
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailPage;

