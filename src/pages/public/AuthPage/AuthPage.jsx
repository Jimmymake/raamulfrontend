// ==========================================
// AUTH PAGE - Login & Signup
// ==========================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import './AuthPage.scss';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    location: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(loginData.username, loginData.password);

    if (result.success) {
      showSuccess('Welcome back! 👋');
      navigate('/products');
    } else {
      showError(result.error);
    }

    setLoading(false);
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await signup({
      username: signupData.username,
      email: signupData.email,
      location: signupData.location,
      phone: signupData.phone,
      password: signupData.password
    });

    if (result.success) {
      showSuccess('Account created successfully! Please check your email to verify.');
      navigate('/products');
    } else {
      showError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth">
      {/* Background Effects */}
      <div className="auth__bg-glow auth__bg-glow--1" />
      <div className="auth__bg-glow auth__bg-glow--2" />

      <div className="auth__container">
        {/* Logo & Header */}
        <div className="auth__header">
          <Link to="/" className="auth__logo">
            <img src="/src/images/logo/logo.png" alt="Raamul Logo" />
            <div className="auth__logo-text">
              <span className="auth__logo-name">RAAMUL</span>
              <span className="auth__logo-sub">INTERNATIONAL</span>
            </div>
          </Link>
          <h1 className="auth__title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="auth__subtitle">
            {isLogin 
              ? 'Sign in to access our products and place orders' 
              : 'Join us to start ordering industrial minerals'
            }
          </p>
        </div>

        {/* Auth Card */}
        <div className="auth__card">
          {/* Tab Switcher */}
          <div className="auth__tabs">
            <button
              className={`auth__tab ${isLogin ? 'auth__tab--active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`auth__tab ${!isLogin ? 'auth__tab--active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN FORM */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="auth__form">
              <div className="auth__field">
                <label>Username</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="auth__field">
                <label>Password</label>
                <div className="auth__password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="auth__password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="auth__options">
                <Link to="/forgot-password" className="auth__forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="auth__submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth__spinner" />
                    Signing In...
                  </>
                ) : 'Sign In'}
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignup} className="auth__form">
              <div className="auth__row">
                <div className="auth__field">
                  <label>Username *</label>
                  <input
                    type="text"
                    value={signupData.username}
                    onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                    placeholder="johndoe"
                    required
                  />
                </div>
                <div className="auth__field">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="auth__field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  placeholder="+254712345678"
                  required
                />
              </div>

              <div className="auth__field">
                <label>Location *</label>
                <input
                  type="text"
                  value={signupData.location}
                  onChange={(e) => setSignupData({ ...signupData, location: e.target.value })}
                  placeholder="Nairobi, Kenya"
                  required
                />
              </div>

              <div className="auth__row">
                <div className="auth__field">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                  />
                </div>
                <div className="auth__field">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="auth__submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth__spinner" />
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="auth__divider">
            <span>or</span>
          </div>

          {/* Back to Home */}
          <Link to="/" className="auth__home-link">
            ← Back to Home
          </Link>
        </div>

        {/* Footer Text */}
        <p className="auth__footer">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

