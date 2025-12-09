// ==========================================
// NAVBAR COMPONENT
// ==========================================

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import './Navbar.scss';

const Navbar = ({ transparent = false }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/products', label: 'Products' },
    { path: '/orders', label: 'My Orders' },
  ];

  return (
    <nav className={`navbar ${transparent ? 'navbar--transparent' : ''}`}>
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img 
            src="https://images.cradlevoices.com/uploads/1764428213_6639a919f8.png" 
            alt="Raamul Logo" 
            className="navbar__logo-img"
          />
          <div className="navbar__logo-text">
            <span className="navbar__logo-name">RAAMUL</span>
            <span className="navbar__logo-sub">INTERNATIONAL</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar__links">
          {/* Show user routes only for non-admin users */}
          {isAuthenticated && !isAdmin && navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${isActive(link.path) ? 'navbar__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          
          {isAuthenticated && !isAdmin && (
            <Link
              to="/cart"
              className={`navbar__link navbar__link--cart ${isActive('/cart') ? 'navbar__link--active' : ''}`}
            >
              Cart
              {cartCount > 0 && (
                <span className="navbar__cart-badge">{cartCount}</span>
              )}
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={`navbar__link ${isActive('/admin') || location.pathname.startsWith('/admin') ? 'navbar__link--active' : ''}`}
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="navbar__right">
          {isAuthenticated ? (
            <div className="navbar__user">
              <button 
                className="navbar__user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="navbar__avatar">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="navbar__username">{user?.username || 'User'}</span>
                <svg 
                  className={`navbar__chevron ${userMenuOpen ? 'navbar__chevron--open' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <span className="navbar__dropdown-name">{user?.username}</span>
                    <span className="navbar__dropdown-email">{user?.email}</span>
                    <span className="navbar__dropdown-role">{user?.role}</span>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  
                  {/* Admin-specific menu items */}
                  {isAdmin ? (
                    <>
                      <Link 
                        to="/admin" 
                        className="navbar__dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link 
                        to="/admin/products" 
                        className="navbar__dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                        Products
                      </Link>
                      <Link 
                        to="/admin/orders" 
                        className="navbar__dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        Orders
                      </Link>
                      <Link 
                        to="/admin/users" 
                        className="navbar__dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        Users
                      </Link>
                      <Link 
                        to="/admin/settings" 
                        className="navbar__dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* Regular user menu items */}
                      <Link 
                        to="/profile" 
                        className="navbar__dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="navbar__dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                        My Orders
                      </Link>
                      <Link 
                        to="/payments" 
                        className="navbar__dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Payment History
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="navbar__dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        Wishlist
                      </Link>
                    </>
                  )}
                  
                  <div className="navbar__dropdown-divider" />
                  <button 
                    className="navbar__dropdown-item navbar__dropdown-item--logout"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/auth" className="navbar__btn navbar__btn--outline">
                Sign In
              </Link>
              <Link to="/auth" className="navbar__btn navbar__btn--primary">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="navbar__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar__mobile-menu">
          {isAuthenticated && !isAdmin && navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="navbar__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && !isAdmin && (
            <Link
              to="/cart"
              className="navbar__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart ({cartCount})
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="navbar__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Panel
            </Link>
          )}
          {!isAuthenticated && (
            <>
              <Link
                to="/auth"
                className="navbar__mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

