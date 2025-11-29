// ==========================================
// ACCESS DENIED PAGE
// ==========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Navbar } from '../../../components/common';
import './AccessDeniedPage.scss';

const AccessDeniedPage = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="access-denied">
      <Navbar />

      <main className="access-denied__main">
        <div className="access-denied__container">
          {/* Background Effects */}
          <div className="access-denied__bg">
            <div className="access-denied__bg-shape access-denied__bg-shape--1" />
            <div className="access-denied__bg-shape access-denied__bg-shape--2" />
          </div>

          {/* Content */}
          <div className="access-denied__content">
            <div className="access-denied__icon">🚫</div>
            <h1 className="access-denied__title">Access Denied</h1>
            <p className="access-denied__message">
              {isAdmin 
                ? "This page is only accessible to regular users. As an administrator, please use the Admin Panel."
                : "You don't have permission to access this page. This area is restricted to administrators only."
              }
            </p>

            <div className="access-denied__actions">
              {isAdmin ? (
                <Link to="/admin" className="access-denied__btn access-denied__btn--primary">
                  Go to Admin Panel
                </Link>
              ) : (
                <Link to="/products" className="access-denied__btn access-denied__btn--primary">
                  Browse Products
                </Link>
              )}
              <Link to="/" className="access-denied__btn access-denied__btn--outline">
                Go to Home
              </Link>
            </div>

            <div className="access-denied__help">
              <p>Need help? <Link to="/contact">Contact Support</Link></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccessDeniedPage;

