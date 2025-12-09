// ==========================================
// ADMIN DASHBOARD - Overview & Stats
// ==========================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout/AdminLayout';
import { LoadingSpinner } from '../../../components/common';
import orderService from '../../../services/orderService';
import productService from '../../../services/productService';
import userService from '../../../services/userService';
import paymentService from '../../../services/paymentService';
import './AdminDashboard.scss';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersData, productsData, usersData, paymentsData] = await Promise.all([
        orderService.getAll({ limit: 5 }).catch(() => ({ orders: [], pagination: { total: 0 } })),
        productService.getAll({ limit: 1 }).catch(() => ({ products: [], pagination: { total: 0 } })),
        userService.getAll({ limit: 1 }).catch(() => ({ users: [], pagination: { total: 0 } })),
        paymentService.getStatistics().catch(() => ({ total_amount: 0 })),
      ]);

      const pendingOrders = ordersData.orders?.filter(o => o.order_status === 'pending').length || 0;

      setStats({
        totalOrders: ordersData.pagination?.total || ordersData.orders?.length || 0,
        pendingOrders,
        totalProducts: productsData.pagination?.total || productsData.products?.length || 0,
        totalUsers: usersData.pagination?.total || usersData.users?.length || 0,
        totalRevenue: paymentsData.total_amount || 0,
        recentOrders: ordersData.orders || [],
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statCards = [
    { 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      icon: '📦', 
      color: '#4a90ff',
      link: '/admin/orders' 
    },
    { 
      label: 'Pending Orders', 
      value: stats.pendingOrders, 
      icon: '⏳', 
      color: '#f59e0b',
      link: '/admin/orders?status=pending' 
    },
    { 
      label: 'Products', 
      value: stats.totalProducts, 
      icon: '🏷️', 
      color: '#10b981',
      link: '/admin/products' 
    },
    { 
      label: 'Users', 
      value: stats.totalUsers, 
      icon: '👥', 
      color: '#8b5cf6',
      link: '/admin/users' 
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="admin-dashboard__header">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your store.</p>
        </div>

        {loading ? (
          <div className="admin-dashboard__loading">
            <LoadingSpinner size="large" text="Loading dashboard..." />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="admin-dashboard__stats">
              {statCards.map((stat, index) => (
                <Link key={index} to={stat.link} className="admin-dashboard__stat-card">
                  <div className="admin-dashboard__stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="admin-dashboard__stat-info">
                    <span className="admin-dashboard__stat-value">{stat.value.toLocaleString()}</span>
                    <span className="admin-dashboard__stat-label">{stat.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Revenue Card */}
            <div className="admin-dashboard__revenue">
              <div className="admin-dashboard__revenue-content">
                <span className="admin-dashboard__revenue-label">Total Revenue</span>
                <span className="admin-dashboard__revenue-value">
                  KES {stats.totalRevenue.toLocaleString()}
                </span>
              </div>
              <Link to="/admin/payments" className="admin-dashboard__revenue-link">
                View Payments →
              </Link>
            </div>

            {/* Recent Orders */}
            <div className="admin-dashboard__section">
              <div className="admin-dashboard__section-header">
                <h2>Recent Orders</h2>
                <Link to="/admin/orders">View All →</Link>
              </div>
              
              {stats.recentOrders.length === 0 ? (
                <div className="admin-dashboard__empty">
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="admin-dashboard__orders-table">
                  <div className="admin-dashboard__table-header">
                    <span>Order ID</span>
                    <span>Customer</span>
                    <span>Amount</span>
                    <span>Status</span>
                    <span>Date</span>
                  </div>
                  {stats.recentOrders.map((order) => {
                    const pricing = parseJsonField(order.pricing) || {};
                    const customer = parseJsonField(order.customer) || {};
                    return (
                      <Link 
                        key={order.id} 
                        to={`/admin/orders/${order.id}`}
                        className="admin-dashboard__table-row"
                      >
                        <span className="admin-dashboard__order-id">{order.order_id}</span>
                        <span>{customer.name || 'N/A'}</span>
                        <span className="admin-dashboard__order-amount">
                          KES {(pricing.total || 0).toLocaleString()}
                        </span>
                        <span className={`admin-dashboard__status admin-dashboard__status--${order.order_status}`}>
                          {order.order_status}
                        </span>
                        <span className="admin-dashboard__order-date">
                          {formatDate(order.created_at)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="admin-dashboard__actions">
              <h2>Quick Actions</h2>
              <div className="admin-dashboard__action-buttons">
                <Link to="/admin/products/new" className="admin-dashboard__action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Product
                </Link>
                <Link to="/admin/orders" className="admin-dashboard__action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Manage Orders
                </Link>
                <Link to="/admin/users" className="admin-dashboard__action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  View Users
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;












