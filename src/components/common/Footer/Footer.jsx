// ==========================================
// FOOTER COMPONENT - Reusable Footer
// ==========================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    // If on landing page, scroll to section
    if (window.location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Otherwise navigate to landing page with hash
      navigate(`/#${id}`);
    }
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="https://images.cradlevoices.com/uploads/1764428213_6639a919f8.png" alt="Raamul Logo" />
              <div className="footer__logo-text">
                <span className="footer__logo-name">RAAMUL</span>
                <span className="footer__logo-sub">INTERNATIONAL LIMITED</span>
              </div>
            </div>
            <p className="footer__desc">
              Kenya's leading supplier of industrial minerals. Surface mining and trading in gypsum, 
              limestone, iron ore, and bauxite.
            </p>
            <p className="footer__quote">
              "We must ensure that sustainable company development is financially sustainable"
            </p>
          </div>

          <div className="footer__links">
            <h4>Quick Links</h4>
            <button onClick={() => navigate('/')}>
              Home
            </button>
            <button onClick={() => scrollToSection('about')}>
              About Us
            </button>
            <button onClick={() => navigate('/products')}>
              Products
            </button>
            <button onClick={() => scrollToSection('services')}>
              Services
            </button>
            <button onClick={() => scrollToSection('gallery')}>
              Gallery
            </button>
            <button onClick={() => scrollToSection('contact')}>
              Contact
            </button>
          </div>

          <div className="footer__links">
            <h4>Products</h4>
            <button onClick={() => navigate('/products')}>
              Gypsum Ore
            </button>
            <button onClick={() => navigate('/products')}>
              Limestone Ore
            </button>
            <button onClick={() => navigate('/products')}>
              Iron Ore
            </button>
            <button onClick={() => navigate('/products')}>
              Bauxite Ore
            </button>
            <button onClick={() => navigate('/products')}>
              Gypsum Powder
            </button>
          </div>

          <div className="footer__links">
            <h4>Contact</h4>
            <span>📍 Wuyi Plaza, Galana Road</span>
            <span>📍 Kilimani, Nairobi</span>
            <span>📞 +254 739 567 904</span>
            <span>✉️ ramulramul2023@gmail.com</span>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2024 Raamul International Limited. All rights reserved.</p>
          <p>P.O. Box 10971 – 00100, Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
