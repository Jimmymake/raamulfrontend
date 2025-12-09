// ==========================================
// PAYMENT PAGE - M-Pesa Payment
// ==========================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { Navbar, Footer, LoadingSpinner } from '../../../components/common';
import orderService from '../../../services/orderService';
import paymentService from '../../../services/paymentService';
import './PaymentPage.scss';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useNotification();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Auto-poll payment status when payment is initiated
  useEffect(() => {
    if (!paymentInitiated || !order?.order_id) return;

    const pollInterval = setInterval(async () => {
      try {
        // Fetch latest order status (updated by callback)
        const data = await orderService.getById(orderId);
        const orderData = data.order || data;
        
        if (orderData) {
          const payment = parseJsonField(orderData?.payment);
          const paymentStatus = payment?.payment_status || payment?.status;
          
          if (paymentStatus === 'completed' || paymentStatus === 'success') {
            clearInterval(pollInterval);
            showSuccess('Payment successful! Thank you for your order.');
            setTimeout(() => {
              navigate('/orders');
            }, 2000);
          } else if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
            clearInterval(pollInterval);
            showError('Payment failed. Please try again.');
            setPaymentInitiated(false);
          }
        }
      } catch (error) {
        console.error('[PaymentPage] Error polling payment status:', error);
        // Don't show error to user, just log it
      }
    }, 3000); // Poll every 3 seconds

    // Cleanup interval on unmount or when paymentInitiated changes
    return () => clearInterval(pollInterval);
  }, [paymentInitiated, order?.order_id, orderId, navigate, showSuccess, showError]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getById(orderId);
      // Handle both response structures: {order: {...}} or direct order object
      const orderData = data.order || data;
      
      if (!orderData || !orderData.id) {
        showError('Order not found.');
        navigate('/orders');
        return;
      }
      
      setOrder(orderData);
      
      // Check if payment already completed
      const payment = parseJsonField(orderData?.payment);
      const paymentStatus = payment?.payment_status || payment?.status;
      if (paymentStatus === 'completed' || paymentStatus === 'success') {
        showInfo('This order has already been paid.');
        navigate('/orders');
      }
    } catch (error) {
      console.error('[PaymentPage] Error fetching order:', error);
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

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      showError('Please enter your M-Pesa phone number.');
      return;
    }

    if (!order?.order_id) {
      showError('Order details not loaded. Please refresh the page.');
      return;
    }

    setProcessing(true);

    try {
      // Format phone and send to backend (backend handles Mam-Laka token)
      const formattedPhone = paymentService.formatPhoneNumber(phoneNumber);
      console.log('[PaymentPage] Initiating payment for order:', order.order_id);
      const data = await paymentService.initiate(order.order_id, formattedPhone);
      
      setCheckoutRequestId(data.checkoutRequestId || data.checkout_request_id);
      setPaymentInitiated(true);
      showSuccess('Payment request sent! Please check your phone for the M-Pesa prompt.');
    } catch (error) {
      console.error('[PaymentPage] Payment error:', error);
      showError(error.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!checkoutRequestId) return;
    
    setCheckingPayment(true);

    try {
      const data = await paymentService.checkStatus(checkoutRequestId);
      
      // Check both possible field names from backend
      const status = data.payment?.payment_status || data.payment?.status;
      
      if (status === 'completed' || status === 'success') {
        showSuccess('Payment successful! Thank you for your order.');
        navigate('/orders');
      } else if (status === 'failed' || status === 'cancelled') {
        showError('Payment failed. Please try again.');
        setPaymentInitiated(false);
      } else {
        showInfo('Payment is still processing. Please wait...');
      }
    } catch (error) {
      showError('Could not check payment status. Please try again.');
    } finally {
      setCheckingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <Navbar />
        <LoadingSpinner fullScreen text="Loading order details..." />
      </div>
    );
  }

  const pricing = parseJsonField(order?.pricing) || {};

  return (
    <div className="payment-page">
      <Navbar />

      <main className="payment-page__main">
        <div className="payment-page__container">
          <Link to="/orders" className="payment-page__back">
            ← Back to Orders
          </Link>

          <div className="payment-page__layout">
            {/* Payment Form */}
            <div className="payment-page__form-card">
              <div className="payment-page__icon">
                <img src="/src/images/logo/mpesa.png" alt="M-Pesa" />
              </div>
              
              <h1>Pay with M-Pesa</h1>
              <p>Complete your payment securely via M-Pesa</p>

              {!paymentInitiated ? (
                <form onSubmit={handlePayment} className="payment-page__form">
                  <div className="payment-page__field">
                    <label>M-Pesa Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g., 0712345678"
                      required
                    />
                    <span className="payment-page__hint">
                      Enter the phone number registered with M-Pesa
                    </span>
                  </div>

                  <div className="payment-page__amount">
                    <span>Amount to Pay</span>
                    <span className="payment-page__amount-value">
                      KES {pricing.total?.toLocaleString() || 0}
                    </span>
                  </div>

                  <button 
                    type="submit" 
                    className="payment-page__submit"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <span className="payment-page__spinner" />
                        Sending Payment Request...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </form>
              ) : (
                <div className="payment-page__waiting">
                  <div className="payment-page__waiting-icon">📱</div>
                  <h3>Check Your Phone</h3>
                  <p>
                    An M-Pesa prompt has been sent to <strong>{phoneNumber}</strong>.
                    <br />
                    Enter your M-Pesa PIN to complete the payment.
                  </p>
                  <p className="payment-page__auto-check">
                    <small>We're automatically checking your payment status...</small>
                  </p>

                  <button 
                    className="payment-page__check-btn"
                    onClick={async () => {
                      // Immediately check payment status
                      await checkPaymentStatus();
                      // Also refresh order to get latest status
                      await fetchOrder();
                    }}
                    disabled={checkingPayment}
                  >
                    {checkingPayment ? 'Checking...' : "I've Completed Payment"}
                  </button>

                  <button 
                    className="payment-page__retry-btn"
                    onClick={() => setPaymentInitiated(false)}
                  >
                    Use Different Number
                  </button>
                </div>
              )}

              <div className="payment-page__security">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Secure payment powered by Safaricom M-Pesa</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="payment-page__summary">
              <h2>Order Summary</h2>
              <p className="payment-page__order-id">Order: {order?.order_id}</p>

              <div className="payment-page__items">
                {parseJsonField(order?.items)?.map((item, index) => (
                  <div key={index} className="payment-page__item">
                    <div className="payment-page__item-info">
                      <span className="payment-page__item-name">{item.name}</span>
                      <span className="payment-page__item-qty">x{item.quantity}</span>
                    </div>
                    <span className="payment-page__item-price">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="payment-page__divider" />

              <div className="payment-page__pricing">
                <div className="payment-page__pricing-row">
                  <span>Subtotal</span>
                  <span>KES {pricing.subtotal?.toLocaleString() || 0}</span>
                </div>
              </div>

              <div className="payment-page__divider" />

              <div className="payment-page__total">
                <span>Total</span>
                <span>KES {pricing.total?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentPage;


