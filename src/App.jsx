// ==========================================
// APP - Main Application Component
// ==========================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import { Toast, LoadingSpinner } from './components/common';

// Pages - Public
import LandingPage from './pages/public/LandingPage/LandingPage';
import AuthPage from './pages/public/AuthPage/AuthPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage/ResetPasswordPage';
import VerifyEmailPage from './pages/public/VerifyEmailPage/VerifyEmailPage';
import NotFoundPage from './pages/public/NotFoundPage/NotFoundPage';
import AboutPage from './pages/public/AboutPage/AboutPage';
import ContactPage from './pages/public/ContactPage/ContactPage';
import AccessDeniedPage from './pages/public/AccessDeniedPage/AccessDeniedPage';

// Pages - User
import ProductsPage from './pages/user/ProductsPage/ProductsPage';
import ProductDetailPage from './pages/user/ProductDetailPage/ProductDetailPage';
import CartPage from './pages/user/CartPage/CartPage';
import OrdersPage from './pages/user/OrdersPage/OrdersPage';
import OrderDetailPage from './pages/user/OrderDetailPage/OrderDetailPage';
import OrderTrackingPage from './pages/user/OrderTrackingPage/OrderTrackingPage';
import ProfilePage from './pages/user/ProfilePage/ProfilePage';
import PaymentPage from './pages/user/PaymentPage/PaymentPage';
import PaymentHistoryPage from './pages/user/PaymentHistoryPage/PaymentHistoryPage';
import WishlistPage from './pages/user/WishlistPage/WishlistPage';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings/AdminSettings';

// Global Styles
import './index.scss';

// ==========================================
// PROTECTED ROUTE - Requires Authentication
// ==========================================
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// ==========================================
// PUBLIC ONLY ROUTE - Redirect if authenticated
// ==========================================
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (isAuthenticated) {
    // Redirect admin to admin panel, users to products
    return <Navigate to={isAdmin ? "/admin" : "/products"} replace />;
  }

  return children;
};

// ==========================================
// USER ONLY ROUTE - Blocks Admins
// ==========================================
const UserOnlyRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Block admins from user routes
  if (isAdmin) {
    return <AccessDeniedPage />;
  }

  return children;
};

// ==========================================
// ADMIN ROUTE - Requires Admin Role
// ==========================================
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Block non-admins from admin routes
  if (!isAdmin) {
    return <AccessDeniedPage />;
  }

  return children;
};

// ==========================================
// APP ROUTES
// ==========================================
const AppRoutes = () => {
  return (
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
          
      {/* Auth Routes - Redirect if logged in */}
          <Route 
            path="/auth" 
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            } 
          />
      <Route 
        path="/forgot-password" 
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        } 
      />
      <Route 
        path="/reset-password/:token" 
        element={
          <PublicOnlyRoute>
            <ResetPasswordPage />
          </PublicOnlyRoute>
        } 
      />
      
      {/* Email Verification - Can be accessed by anyone */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

      {/* User Routes - Regular Users Only (Admins Blocked) */}
          <Route 
            path="/products" 
            element={
          <UserOnlyRoute>
                <ProductsPage />
          </UserOnlyRoute>
        } 
      />
      <Route 
        path="/products/:id" 
        element={
          <UserOnlyRoute>
            <ProductDetailPage />
          </UserOnlyRoute>
            } 
          />
              <Route 
            path="/cart" 
            element={
          <UserOnlyRoute>
                <CartPage />
          </UserOnlyRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
          <UserOnlyRoute>
                <OrdersPage />
          </UserOnlyRoute>
            } 
          />
      <Route 
        path="/orders/:id" 
        element={
          <UserOnlyRoute>
            <OrderDetailPage />
          </UserOnlyRoute>
        } 
      />
      <Route 
        path="/orders/:id/track" 
        element={
          <UserOnlyRoute>
            <OrderTrackingPage />
          </UserOnlyRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <UserOnlyRoute>
            <ProfilePage />
          </UserOnlyRoute>
        } 
      />
      <Route 
        path="/payment/:orderId" 
        element={
          <UserOnlyRoute>
            <PaymentPage />
          </UserOnlyRoute>
        } 
      />
      <Route 
        path="/payments" 
        element={
          <UserOnlyRoute>
            <PaymentHistoryPage />
          </UserOnlyRoute>
        } 
      />
      <Route 
        path="/wishlist" 
        element={
          <UserOnlyRoute>
            <WishlistPage />
          </UserOnlyRoute>
        } 
      />

      {/* Admin Routes - Require Admin Role */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/products" 
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/products/new" 
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/orders" 
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/orders/:id" 
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/payments" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        } 
      />

      {/* 404 - Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
        </Routes>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            <Router>
              <Toast />
              <AppRoutes />
      </Router>
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
