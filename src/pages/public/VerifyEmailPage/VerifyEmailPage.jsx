// ==========================================
// VERIFY EMAIL PAGE
// ==========================================

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import authService from '../../../services/authService';
import { LoadingSpinner } from '../../../components/common';
import './VerifyEmailPage.scss';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, checkVerificationStatus } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setVerifying(false);
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      await authService.verifyEmail(token);
      setVerified(true);
      showSuccess('Email verified successfully!');
      
      // Update auth context
      if (isAuthenticated) {
        await checkVerificationStatus();
      }
    } catch (err) {
      setError(err.message || 'Verification failed. The link may be invalid or expired.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    setResending(true);
    try {
      await authService.resendVerification();
      showSuccess('Verification email sent! Check your inbox.');
    } catch (err) {
      showError(err.message || 'Failed to send verification email.');
    } finally {
      setResending(false);
    }
  };

  if (verifying) {
    return (
      <div className="verify-email">
        <LoadingSpinner fullScreen text="Verifying your email..." />
      </div>
    );
  }

  return (
    <div className="verify-email">
      <div className="verify-email__bg-glow" />

      <div className="verify-email__container">
        {/* Logo */}
        <Link to="/" className="verify-email__logo">
          <img src="/src/images/logo/logo.png" alt="Raamul Logo" />
          <div className="verify-email__logo-text">
            <span>RAAMUL</span>
            <span>INTERNATIONAL</span>
          </div>
        </Link>

        <div className="verify-email__card">
          {verified ? (
            <div className="verify-email__success">
              <div className="verify-email__icon verify-email__icon--success">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h1>Email Verified!</h1>
              <p>Your email has been successfully verified. You now have full access to all features.</p>
              <Link to="/products" className="verify-email__btn verify-email__btn--primary">
                Start Shopping
              </Link>
            </div>
          ) : error ? (
            <div className="verify-email__error">
              <div className="verify-email__icon verify-email__icon--error">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h1>Verification Failed</h1>
              <p>{error}</p>
              {isAuthenticated && (
                <button 
                  className="verify-email__btn verify-email__btn--primary"
                  onClick={handleResendVerification}
                  disabled={resending}
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              )}
              <Link to={isAuthenticated ? '/products' : '/auth'} className="verify-email__btn verify-email__btn--outline">
                {isAuthenticated ? 'Continue to Products' : 'Back to Login'}
              </Link>
            </div>
          ) : (
            <div className="verify-email__pending">
              <div className="verify-email__icon verify-email__icon--pending">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h1>Verify Your Email</h1>
              <p>
                We've sent a verification link to your email address. 
                Please check your inbox and click the link to verify your account.
              </p>
              <div className="verify-email__tips">
                <h4>Didn't receive the email?</h4>
                <ul>
                  <li>Check your spam or junk folder</li>
                  <li>Make sure you entered the correct email</li>
                  <li>Wait a few minutes and try again</li>
                </ul>
              </div>
              {isAuthenticated && (
                <button 
                  className="verify-email__btn verify-email__btn--primary"
                  onClick={handleResendVerification}
                  disabled={resending}
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              )}
              <Link to={isAuthenticated ? '/products' : '/auth'} className="verify-email__link">
                {isAuthenticated ? '← Back to Products' : '← Back to Login'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

