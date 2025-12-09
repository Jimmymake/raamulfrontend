// ==========================================
// ORDER TRACKING PAGE - Visual Tracking
// ==========================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar, LoadingSpinner } from '../../../components/common';
import orderService from '../../../services/orderService';
import trackingService from '../../../services/trackingService';
import './OrderTrackingPage.scss';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderAndTracking();
  }, [id]);

  const fetchOrderAndTracking = async () => {
    setLoading(true);
    try {
      const [orderData, trackingData] = await Promise.all([
        orderService.getById(id),
        trackingService.getOrderTracking(id)
      ]);
      setOrder(orderData);
      setTracking(trackingData.tracking || []);
    } catch (error) {
      console.error('Failed to fetch tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusSteps = () => {
    return [
      { key: 'pending', label: 'Order Placed', icon: '📝', description: 'Your order has been received' },
      { key: 'confirmed', label: 'Confirmed', icon: '✓', description: 'Order confirmed and payment verified' },
      { key: 'processing', label: 'Processing', icon: '⚙️', description: 'Your order is being prepared' },
      { key: 'shipped', label: 'Shipped', icon: '🚚', description: 'Your order is on the way' },
      { key: 'delivered', label: 'Delivered', icon: '📦', description: 'Order delivered successfully' }
    ];
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    const steps = getStatusSteps();
    const index = steps.findIndex(s => s.key === order.status);
    return index >= 0 ? index : 0;
  };

  const steps = getStatusSteps();
  const currentStep = getCurrentStepIndex();

  if (loading) {
    return (
      <div className="order-tracking">
        <Navbar />
        <div className="order-tracking__loading">
          <LoadingSpinner size="large" text="Loading tracking info..." />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking">
        <Navbar />
        <div className="order-tracking__not-found">
          <div className="order-tracking__not-found-icon">🔍</div>
          <h2>Order not found</h2>
          <p>The order you're looking for doesn't exist.</p>
          <Link to="/orders" className="order-tracking__btn">View Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <Navbar />

      <main className="order-tracking__main">
        <div className="order-tracking__container">
          {/* Header */}
          <div className="order-tracking__header">
            <Link to={`/orders/${id}`} className="order-tracking__back">
              ← Back to Order Details
            </Link>
            <h1>Track Order #{order.id}</h1>
            <p>Placed on {formatDate(order.created_at)}</p>
          </div>

          {/* Status Banner */}
          <div className={`order-tracking__banner order-tracking__banner--${order.status}`}>
            <div className="order-tracking__banner-icon">
              {steps[currentStep]?.icon}
            </div>
            <div className="order-tracking__banner-info">
              <h2>{steps[currentStep]?.label}</h2>
              <p>{steps[currentStep]?.description}</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="order-tracking__progress">
            <div className="order-tracking__steps">
              {steps.map((step, index) => {
                const isActive = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div 
                    key={step.key}
                    className={`order-tracking__step ${isActive ? 'order-tracking__step--active' : ''} ${isCurrent ? 'order-tracking__step--current' : ''}`}
                  >
                    <div className="order-tracking__step-marker">
                      <span className="order-tracking__step-icon">{step.icon}</span>
                      {index < steps.length - 1 && (
                        <div className={`order-tracking__step-line ${index < currentStep ? 'order-tracking__step-line--active' : ''}`} />
                      )}
                    </div>
                    <div className="order-tracking__step-info">
                      <span className="order-tracking__step-label">{step.label}</span>
                      <span className="order-tracking__step-desc">{step.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="order-tracking__timeline">
            <h3>Tracking Updates</h3>
            
            {tracking.length === 0 ? (
              <div className="order-tracking__timeline-empty">
                <p>No tracking updates yet.</p>
              </div>
            ) : (
              <div className="order-tracking__timeline-list">
                {tracking.map((event, index) => (
                  <div key={index} className="order-tracking__event">
                    <div className="order-tracking__event-dot" />
                    <div className="order-tracking__event-content">
                      <div className="order-tracking__event-header">
                        <span className="order-tracking__event-status">{event.status}</span>
                        <span className="order-tracking__event-time">{formatDate(event.created_at)}</span>
                      </div>
                      {event.location && (
                        <span className="order-tracking__event-location">📍 {event.location}</span>
                      )}
                      {event.notes && (
                        <p className="order-tracking__event-notes">{event.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shipping Info */}
          <div className="order-tracking__info-grid">
            <div className="order-tracking__info-card">
              <h4>📦 Shipping Address</h4>
              <p>{order.shipping_address || 'Not specified'}</p>
            </div>

            <div className="order-tracking__info-card">
              <h4>🚚 Delivery Method</h4>
              <p>{order.delivery_method || 'Standard Delivery'}</p>
              <span className="order-tracking__info-sub">
                Estimated: 3-5 business days
              </span>
            </div>

            <div className="order-tracking__info-card">
              <h4>💳 Payment Status</h4>
              <p className={`order-tracking__payment-status order-tracking__payment-status--${order.payment_status}`}>
                {order.payment_status === 'paid' ? '✓ Paid' : 
                 order.payment_status === 'pending' ? '⏳ Pending' : 
                 '✗ Failed'}
              </p>
              <span className="order-tracking__info-sub">
                {order.payment_method || 'M-Pesa'}
              </span>
            </div>

            <div className="order-tracking__info-card">
              <h4>📞 Need Help?</h4>
              <p>Contact Support</p>
              <span className="order-tracking__info-sub">
                +254 700 123 456
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="order-tracking__actions">
            <Link to={`/orders/${id}`} className="order-tracking__btn order-tracking__btn--primary">
              View Order Details
            </Link>
            <Link to="/orders" className="order-tracking__btn order-tracking__btn--secondary">
              View All Orders
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderTrackingPage;










