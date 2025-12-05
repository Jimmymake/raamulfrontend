// ==========================================
// 404 NOT FOUND PAGE
// ==========================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/common';
import './NotFoundPage.scss';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <Navbar />

      <main className="not-found__main">
        <div className="not-found__container">
          {/* Animated Background */}
          <div className="not-found__bg">
            <div className="not-found__bg-shape not-found__bg-shape--1" />
            <div className="not-found__bg-shape not-found__bg-shape--2" />
            <div className="not-found__bg-shape not-found__bg-shape--3" />
          </div>

          {/* Content */}
          <div className="not-found__content">
            <div className="not-found__code">
              <span>4</span>
              <span className="not-found__code-zero">0</span>
              <span>4</span>
            </div>

            <h1 className="not-found__title">Page Not Found</h1>
            
            <p className="not-found__message">
              Oops! The page you're looking for seems to have wandered off into the digital wilderness.
            </p>

            <div className="not-found__suggestions">
              <h3>Here's what you can do:</h3>
              <ul>
                <li>Check if the URL is correct</li>
                <li>Go back to the previous page</li>
                <li>Visit our homepage</li>
                <li>Browse our products</li>
              </ul>
            </div>

            <div className="not-found__actions">
              <button 
                className="not-found__btn not-found__btn--back"
                onClick={() => navigate(-1)}
              >
                ← Go Back
              </button>
              <Link to="/" className="not-found__btn not-found__btn--home">
                🏠 Go Home
              </Link>
              <Link to="/products" className="not-found__btn not-found__btn--products">
                🛒 Browse Products
              </Link>
            </div>
          </div>

          {/* Fun Element */}
          <div className="not-found__illustration">
            <div className="not-found__planet" />
            <div className="not-found__astronaut">🧑‍🚀</div>
            <div className="not-found__stars">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="not-found__star"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;



