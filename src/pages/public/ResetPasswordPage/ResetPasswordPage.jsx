// ==========================================
// RESET PASSWORD PAGE
// ==========================================

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';
import { useNotification } from '../../../context/NotificationContext';
import { LoadingSpinner } from '../../../components/common';
import './ResetPasswordPage.scss';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const data = await authService.verifyResetToken(token);
        setTokenValid(data.valid);
      } catch (error) {
        setTokenValid(false);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, formData.password);
      setSuccess(true);
      showSuccess('Password reset successfully!');
    } catch (error) {
      showError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="reset-password">
        <LoadingSpinner fullScreen text="Validating reset link..." />
      </div>
    );
  }

  return (
    <div className="reset-password">
      <div className="reset-password__bg-glow" />

      <div className="reset-password__container">
        {/* Logo */}
        <Link to="/" className="reset-password__logo">
          <img src="/src/images/logo/logo.png" alt="Raamul Logo" />
          <div className="reset-password__logo-text">
            <span>RAAMUL</span>
            <span>INTERNATIONAL</span>
          </div>
        </Link>

        <div className="reset-password__card">
          {!tokenValid ? (
            <div className="reset-password__invalid">
              <div className="reset-password__invalid-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h2>Invalid or Expired Link</h2>
              <p>This password reset link is invalid or has expired.</p>
              <Link to="/forgot-password" className="reset-password__btn">
                Request New Link
              </Link>
            </div>
          ) : success ? (
            <div className="reset-password__success">
              <div className="reset-password__success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2>Password Reset!</h2>
              <p>Your password has been successfully reset.</p>
              <Link to="/auth" className="reset-password__btn">
                Sign In Now
              </Link>
            </div>
          ) : (
            <>
              <div className="reset-password__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
              </div>

              <h1 className="reset-password__title">Reset Password</h1>
              <p className="reset-password__desc">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="reset-password__form">
                <div className="reset-password__field">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                  />
                </div>

                <div className="reset-password__field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="reset-password__submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="reset-password__spinner" />
                      Resetting...
                    </>
                  ) : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          <Link to="/auth" className="reset-password__back">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

