// ==========================================
// FOOTER COMPONENT
// ==========================================

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Main Footer */}
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-icon">🌍</span>
              <span className="footer__logo-text">Raamul<span>International</span></span>
            </Link>
            <p className="footer__tagline">
              Your trusted B2B e-commerce partner in Kenya. Quality products, competitive prices, reliable delivery.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h4 className="footer__title">Quick Links</h4>
            <nav className="footer__nav">
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>
              <Link to="/orders">My Orders</Link>
              <Link to="/profile">Profile</Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="footer__section">
            <h4 className="footer__title">Categories</h4>
            <nav className="footer__nav">
              <Link to="/products?category=electronics">Electronics</Link>
              <Link to="/products?category=fashion">Fashion</Link>
              <Link to="/products?category=home">Home & Living</Link>
              <Link to="/products?category=health">Health & Beauty</Link>
            </nav>
          </div>

          {/* Support */}
          <div className="footer__section">
            <h4 className="footer__title">Support</h4>
            <nav className="footer__nav">
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">Shipping Info</a>
              <a href="#">Returns Policy</a>
            </nav>
          </div>

          {/* Contact */}
          <div className="footer__section">
            <h4 className="footer__title">Contact Us</h4>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <span className="footer__contact-icon">📍</span>
                <span>Nairobi, Kenya</span>
              </div>
              <div className="footer__contact-item">
                <span className="footer__contact-icon">📞</span>
                <a href="tel:+254700123456">+254 700 123 456</a>
              </div>
              <div className="footer__contact-item">
                <span className="footer__contact-icon">✉️</span>
                <a href="mailto:info@raamul.co.ke">info@raamul.co.ke</a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer__newsletter">
          <div className="footer__newsletter-content">
            <h4>Subscribe to our newsletter</h4>
            <p>Get the latest products and deals straight to your inbox</p>
          </div>
          <form className="footer__newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email"
              className="footer__newsletter-input"
            />
            <button type="submit" className="footer__newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Raamul International. All rights reserved.
          </p>
          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div className="footer__payment">
            <span>We accept:</span>
            <div className="footer__payment-methods">
              <span className="footer__payment-badge">M-Pesa</span>
              <span className="footer__payment-badge">Visa</span>
              <span className="footer__payment-badge">Mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

