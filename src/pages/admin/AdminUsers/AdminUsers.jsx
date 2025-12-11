// ==========================================
// ADMIN USERS - User Management
// ==========================================

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout/AdminLayout';
import { LoadingSpinner } from '../../../components/common';
import { useNotification } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';
import userService from '../../../services/userService';
import './AdminUsers.scss';

const AdminUsers = () => {
  const { showSuccess, showError } = useNotification();
  const { user: currentUser, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchQuery, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (searchQuery) params.search = searchQuery;
      if (roleFilter !== 'all') params.role = roleFilter;
      
      const data = await userService.getAll(params);
      setUsers(data.users || []);
      if (data.pagination) {
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      showError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await userService.changeStatus(userId, newStatus);
      showSuccess('User status updated');
      fetchUsers();
    } catch (error) {
      showError(error.message || 'Failed to update status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!isSuperAdmin) {
      showError('Only Super Admins can change user roles');
      return;
    }

    try {
      await userService.updateProfile(userId, { role: newRole });
      showSuccess('User role updated');
      fetchUsers();
    } catch (error) {
      showError(error.message || 'Failed to update role');
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const roles = ['all', 'user', 'admin', 'super_admin'];

  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="admin-users__header">
          <div>
            <h1>Users</h1>
            <p>Manage user accounts</p>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-users__controls">
          <div className="admin-users__search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="admin-users__role-filters">
            {roles.map((role) => (
              <button
                key={role}
                className={`admin-users__role-btn ${roleFilter === role ? 'admin-users__role-btn--active' : ''}`}
                onClick={() => {
                  setRoleFilter(role);
                  setPagination(p => ({ ...p, page: 1 }));
                }}
              >
                {role === 'all' ? 'All Roles' : role.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="admin-users__loading">
            <LoadingSpinner size="large" text="Loading users..." />
          </div>
        ) : users.length === 0 ? (
          <div className="admin-users__empty">
            <p>No users found</p>
          </div>
        ) : (
          <>
            <div className="admin-users__table">
              <div className="admin-users__table-header">
                <span>User</span>
                <span>Phone</span>
                <span>Location</span>
                <span>Role</span>
                <span>Status</span>
                <span>Joined</span>
                <span>Actions</span>
              </div>
              {users.map((user) => (
                <div key={user.id} className="admin-users__table-row">
                  <div className="admin-users__user-info">
                    <div className="admin-users__avatar">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <span className="admin-users__username">{user.username}</span>
                      <small>{user.email}</small>
                    </div>
                  </div>
                  <span>{user.phone || 'N/A'}</span>
                  <span className="admin-users__location">{user.location || 'N/A'}</span>
                  <span className={`admin-users__role admin-users__role--${user.role}`}>
                    {user.role?.replace('_', ' ')}
                  </span>
                  <span className={`admin-users__status admin-users__status--${user.status || 'active'}`}>
                    {user.status || 'active'}
                  </span>
                  <span className="admin-users__date">{formatDate(user.created_at)}</span>
                  <div className="admin-users__actions">
                    <button 
                      className="admin-users__action-btn"
                      onClick={() => openUserModal(user)}
                    >
                      View
                    </button>
                    {user.id !== currentUser?.id && (
                      <button 
                        className={`admin-users__action-btn ${user.status === 'active' ? 'admin-users__action-btn--danger' : 'admin-users__action-btn--success'}`}
                        onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                      >
                        {user.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="admin-users__pagination">
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

        {/* User Detail Modal */}
        {showModal && selectedUser && (
          <div className="admin-users__modal-overlay" onClick={() => setShowModal(false)}>
            <div className="admin-users__modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-users__modal-header">
                <h2>User Details</h2>
                <button onClick={() => setShowModal(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              <div className="admin-users__modal-content">
                <div className="admin-users__modal-avatar">
                  {selectedUser.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <div className="admin-users__detail-grid">
                  <div className="admin-users__detail-item">
                    <label>Username</label>
                    <span>{selectedUser.username}</span>
                  </div>
                  <div className="admin-users__detail-item">
                    <label>Email</label>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="admin-users__detail-item">
                    <label>Phone</label>
                    <span>{selectedUser.phone || 'Not provided'}</span>
                  </div>
                  <div className="admin-users__detail-item">
                    <label>Location</label>
                    <span>{selectedUser.location || 'Not provided'}</span>
                  </div>
                  <div className="admin-users__detail-item">
                    <label>Role</label>
                    {isSuperAdmin && selectedUser.id !== currentUser?.id ? (
                      <select 
                        value={selectedUser.role}
                        onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    ) : (
                      <span className={`admin-users__role admin-users__role--${selectedUser.role}`}>
                        {selectedUser.role?.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <div className="admin-users__detail-item">
                    <label>Email Verified</label>
                    <span className={selectedUser.email_verified ? 'admin-users__verified' : 'admin-users__not-verified'}>
                      {selectedUser.email_verified ? '✓ Verified' : '✗ Not Verified'}
                    </span>
                  </div>
                  <div className="admin-users__detail-item">
                    <label>Joined</label>
                    <span>{formatDate(selectedUser.created_at)}</span>
                  </div>
                  <div className="admin-users__detail-item">
                    <label>Status</label>
                    <span className={`admin-users__status admin-users__status--${selectedUser.status || 'active'}`}>
                      {selectedUser.status || 'active'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-users__modal-actions">
                <button className="admin-users__btn-close" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;













