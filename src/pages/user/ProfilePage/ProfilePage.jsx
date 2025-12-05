// ==========================================
// PROFILE PAGE - User Profile & Settings
// ==========================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { Navbar, LoadingSpinner } from '../../../components/common';
import userService from '../../../services/userService';
import authService from '../../../services/authService';
import './ProfilePage.scss';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile form
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });
  
  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await userService.updateProfile(user.id, profileData);
      updateUser(data.user);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      showError(error.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      showSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showError(error.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-page__main">
        <div className="profile-page__container">
          <div className="profile-page__header">
            <h1>Account Settings</h1>
            <p>Manage your profile and preferences</p>
          </div>

          <div className="profile-page__layout">
            {/* Sidebar */}
            <div className="profile-page__sidebar">
              <div className="profile-page__user-card">
                <div className="profile-page__avatar">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3>{user?.username}</h3>
                <span className="profile-page__role">{user?.role}</span>
                <span className="profile-page__email">{user?.email}</span>
              </div>

              <nav className="profile-page__nav">
                <button
                  className={`profile-page__nav-item ${activeTab === 'profile' ? 'profile-page__nav-item--active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </button>
                <button
                  className={`profile-page__nav-item ${activeTab === 'security' ? 'profile-page__nav-item--active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Security
                </button>
                <button
                  className="profile-page__nav-item profile-page__nav-item--logout"
                  onClick={handleLogout}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="profile-page__content">
              {activeTab === 'profile' && (
                <div className="profile-page__section">
                  <h2>Profile Information</h2>
                  <p>Update your account details</p>

                  <form onSubmit={handleProfileUpdate} className="profile-page__form">
                    <div className="profile-page__form-row">
                      <div className="profile-page__field">
                        <label>Username</label>
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                          placeholder="Your username"
                          required
                        />
                      </div>
                      <div className="profile-page__field">
                        <label>Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          placeholder="Your email"
                          required
                        />
                      </div>
                    </div>

                    <div className="profile-page__form-row">
                      <div className="profile-page__field">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="+254712345678"
                        />
                      </div>
                      <div className="profile-page__field">
                        <label>Location</label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    <button type="submit" className="profile-page__submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="profile-page__section">
                  <h2>Change Password</h2>
                  <p>Update your password to keep your account secure</p>

                  <form onSubmit={handlePasswordChange} className="profile-page__form">
                    <div className="profile-page__field">
                      <label>Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        required
                      />
                    </div>

                    <div className="profile-page__form-row">
                      <div className="profile-page__field">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Min. 6 characters"
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="profile-page__field">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="profile-page__submit" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;




