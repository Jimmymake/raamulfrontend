// ==========================================
// CART PAGE - Shopping Cart & Checkout
// ==========================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useNotification } from '../../../context/NotificationContext';
import { Navbar, Footer, ProductImage, getProductImageUrl } from '../../../components/common';
import orderService from '../../../services/orderService';
import './CartPage.scss';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getSubtotal,
    getShipping,
    getTax,
    getTotal 
  } = useCart();
  const { showSuccess, showError } = useNotification();
  
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    
    const orderData = {
      order_id: orderService.generateOrderId(),
      customer: {
        name: user?.username,
        email: user?.email,
        phone: user?.phone || ''
      },
      items: cartItems.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      pricing: {
        subtotal: getSubtotal(),
        tax: 0,
        shipping: 0,
        total: getSubtotal()
      },
      shipping: {
        address: user?.location || '',
        method: 'Standard Delivery'
      },
      payment: {
        method: 'M-Pesa',
        status: 'pending'
      },
      order_status: 'pending'
    };

    try {
      console.log('[checkout] Creating order:', orderData);
      const data = await orderService.create(orderData);
      console.log('[checkout] Order created:', data);
      
      // Handle both response structures: {order: {...}} or direct order object
      const createdOrder = data.order || data;
      const orderId = createdOrder?.id;
      
      if (!orderId) {
        throw new Error('Failed to get order ID from response');
      }
      
      clearCart();
      showSuccess('Order created successfully!');
      navigate(`/payment/${orderId}`);
    } catch (error) {
      console.error('[checkout] Error creating order:', error);
      showError(error.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-page__main">
        <div className="cart-page__container">
          <div className="cart-page__header">
            <h1>Shopping Cart</h1>
            <p>{cartItems.length} item(s) in your cart</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-page__empty">
              <div className="cart-page__empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any products yet.</p>
              <Link to="/products" className="cart-page__btn cart-page__btn--primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="cart-page__layout">
              {/* Cart Items */}
              <div className="cart-page__items">
                <div className="cart-page__items-header">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span></span>
                </div>

                {cartItems.map(item => (
                  <div key={item.id} className="cart-page__item">
                    <div className="cart-page__item-product">
                      <ProductImage 
                        src={item.images?.[0] || item.image}
                        alt={item.name}
                        size="small"
                        className="cart-page__item-image"
                      />
                      <div className="cart-page__item-details">
                        <h3>{item.name}</h3>
                        <p>{item.purity || item.category}</p>
                      </div>
                    </div>
                    
                    <div className="cart-page__item-price">
                      KES {Number(item.price).toLocaleString()}
                      <span className="cart-page__item-unit">/{item.unit || 'unit'}</span>
                    </div>
                    
                    <div className="cart-page__item-quantity">
                      <button 
                        className="cart-page__qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="cart-page__qty-value">{item.quantity}</span>
                      <button 
                        className="cart-page__qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="cart-page__item-total">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </div>
                    
                    <button 
                      className="cart-page__remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}

                <div className="cart-page__actions">
                  <button 
                    className="cart-page__btn cart-page__btn--outline"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                  <Link to="/products" className="cart-page__btn cart-page__btn--ghost">
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="cart-page__summary">
                <h2>Order Summary</h2>
                
                <div className="cart-page__summary-row">
                  <span>Subtotal</span>
                  <span>KES {getSubtotal().toLocaleString()}</span>
                </div>
                
                <div className="cart-page__summary-divider" />
                
                <div className="cart-page__summary-row cart-page__summary-row--total">
                  <span>Total</span>
                  <span>KES {getTotal().toLocaleString()}</span>
                </div>

                <button 
                  className="cart-page__checkout-btn"
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <div className="cart-page__payment-methods">
                  <p>We accept:</p>
                  <div className="cart-page__methods">
                    <span>M-Pesa</span>
                    <span>Bank Transfer</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;

