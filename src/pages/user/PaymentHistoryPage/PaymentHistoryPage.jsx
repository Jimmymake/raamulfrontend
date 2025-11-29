// ==========================================
// PAYMENT HISTORY PAGE - View All Payments
// ==========================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Navbar, LoadingSpinner } from '../../../components/common';
import paymentService from '../../../services/paymentService';
import './PaymentHistoryPage.scss';

const PaymentHistoryPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchPayments();
  }, [pagination.page, filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filter !== 'all') params.status = filter;

      const data = await paymentService.getByUserId(user?.id, params);
      setPayments(data.payments || []);
      if (data.pagination) {
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
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

  const getStatusInfo = (status) => {
    const statuses = {
      pending: { label: 'Pending', color: '#f59e0b', icon: '⏳' },
      completed: { label: 'Completed', color: '#10b981', icon: '✓' },
      failed: { label: 'Failed', color: '#ef4444', icon: '✗' },
      cancelled: { label: 'Cancelled', color: '#6b7280', icon: '○' }
    };
    return statuses[status] || statuses.pending;
  };

  const filters = ['all', 'completed', 'pending', 'failed'];

  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  return (
    <div className="payment-history">
      <Navbar />

      <main className="payment-history__main">
        <div className="payment-history__container">
          <div className="payment-history__header">
            <div>
              <h1>Payment History</h1>
              <p>View all your payment transactions</p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="payment-history__summary">
            <div className="payment-history__summary-item">
              <span className="payment-history__summary-label">Total Payments</span>
              <span className="payment-history__summary-value">{payments.length}</span>
            </div>
            <div className="payment-history__summary-item">
              <span className="payment-history__summary-label">Successful</span>
              <span className="payment-history__summary-value payment-history__summary-value--success">
                {payments.filter(p => p.status === 'completed').length}
              </span>
            </div>
            <div className="payment-history__summary-item">
              <span className="payment-history__summary-label">Total Paid</span>
              <span className="payment-history__summary-value payment-history__summary-value--amount">
                KES {totalPaid.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="payment-history__filters">
            {filters.map((status) => (
              <button
                key={status}
                className={`payment-history__filter ${filter === status ? 'payment-history__filter--active' : ''}`}
                onClick={() => {
                  setFilter(status);
                  setPagination(p => ({ ...p, page: 1 }));
                }}
              >
                {status === 'all' ? 'All Payments' : getStatusInfo(status).label}
              </button>
            ))}
          </div>

          {/* Payments List */}
          {loading ? (
            <div className="payment-history__loading">
              <LoadingSpinner size="large" text="Loading payments..." />
            </div>
          ) : payments.length === 0 ? (
            <div className="payment-history__empty">
              <div className="payment-history__empty-icon">💳</div>
              <h2>No payments found</h2>
              <p>{filter === 'all' ? "You haven't made any payments yet." : `No ${filter} payments.`}</p>
              <Link to="/products" className="payment-history__btn">Browse Products</Link>
            </div>
          ) : (
            <>
              <div className="payment-history__list">
                {payments.map((payment) => {
                  const statusInfo = getStatusInfo(payment.status);
                  return (
                    <div key={payment.id} className="payment-history__card">
                      <div className="payment-history__card-header">
                        <div className="payment-history__card-icon" style={{ background: `${statusInfo.color}15`, color: statusInfo.color }}>
                          {statusInfo.icon}
                        </div>
                        <div className="payment-history__card-info">
                          <span className="payment-history__card-method">{payment.payment_method || 'M-Pesa'}</span>
                          <span className="payment-history__card-date">{formatDate(payment.created_at)}</span>
                        </div>
                        <div className="payment-history__card-amount">
                          <span className="payment-history__amount">KES {parseFloat(payment.amount).toLocaleString()}</span>
                          <span 
                            className="payment-history__status"
                            style={{ color: statusInfo.color, background: `${statusInfo.color}15` }}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="payment-history__card-details">
                        <div className="payment-history__detail">
                          <span className="payment-history__detail-label">Order ID</span>
                          <Link to={`/orders/${payment.order_id}`} className="payment-history__detail-value payment-history__detail-value--link">
                            {payment.order_id}
                          </Link>
                        </div>
                        {payment.transaction_id && (
                          <div className="payment-history__detail">
                            <span className="payment-history__detail-label">Transaction ID</span>
                            <span className="payment-history__detail-value">{payment.transaction_id}</span>
                          </div>
                        )}
                        {payment.phone_number && (
                          <div className="payment-history__detail">
                            <span className="payment-history__detail-label">Phone</span>
                            <span className="payment-history__detail-value">{payment.phone_number}</span>
                          </div>
                        )}
                        {payment.mpesa_receipt && (
                          <div className="payment-history__detail">
                            <span className="payment-history__detail-label">M-Pesa Receipt</span>
                            <span className="payment-history__detail-value">{payment.mpesa_receipt}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="payment-history__pagination">
                  <button
                    className="payment-history__page-btn"
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                  >
                    Previous
                  </button>
                  <span className="payment-history__page-info">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    className="payment-history__page-btn"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
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

export default PaymentHistoryPage;

