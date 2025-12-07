// ==========================================
// FORGOT PASSWORD PAGE
// ==========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../../services/authService';
import { useNotification } from '../../../context/NotificationContext';
import './ForgotPasswordPage.scss';

const ForgotPasswordPage = () => {
  const { showSuccess, showError } = useNotification();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSent(true);
      showSuccess('If an account with that email exists, a reset link has been sent.');
    } catch (error) {
      showError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      {/* Background Effects */}
      <div className="forgot-password__bg-glow" />

      <div className="forgot-password__container">
        {/* Logo */}
        <Link to="/" className="forgot-password__logo">
          <img src="/src/images/logo/logo.png" alt="Raamul Logo" />
          <div className="forgot-password__logo-text">
            <span>RAAMUL</span>
            <span>INTERNATIONAL</span>
          </div>
        </Link>

        {/* Card */}
        <div className="forgot-password__card">
          {!sent ? (
            <>
              <div className="forgot-password__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <h1 className="forgot-password__title">Forgot Password?</h1>
              <p className="forgot-password__desc">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="forgot-password__form">
                <div className="forgot-password__field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="forgot-password__submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="forgot-password__spinner" />
                      Sending...
                    </>
                  ) : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="forgot-password__success">
              <div className="forgot-password__success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2>Check Your Email</h2>
              <p>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="forgot-password__success-note">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button 
                className="forgot-password__resend"
                onClick={() => setSent(false)}
              >
                Try Different Email
              </button>
            </div>
          )}

          <Link to="/auth" className="forgot-password__back">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;






