// ==========================================
// WISHLIST PAGE - Favorites/Saved Items
// ==========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';
import { useNotification } from '../../../context/NotificationContext';
import { Navbar, Footer } from '../../../components/common';
import './WishlistPage.scss';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    showNotification(`${product.name} added to cart!`, 'success');
  };

  const handleRemove = (product) => {
    removeFromWishlist(product.id);
    showNotification(`${product.name} removed from wishlist`, 'info');
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach(product => addToCart(product, 1));
    showNotification(`${wishlist.length} items added to cart!`, 'success');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="wishlist-page">
      <Navbar />

      <main className="wishlist-page__main">
        <div className="wishlist-page__container">
          {/* Header */}
          <div className="wishlist-page__header">
            <div>
              <h1>My Wishlist</h1>
              <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
            </div>
            {wishlist.length > 0 && (
              <div className="wishlist-page__header-actions">
                <button 
                  className="wishlist-page__btn wishlist-page__btn--outline"
                  onClick={handleMoveAllToCart}
                >
                  🛒 Add All to Cart
                </button>
                <button 
                  className="wishlist-page__btn wishlist-page__btn--danger"
                  onClick={() => {
                    clearWishlist();
                    showNotification('Wishlist cleared', 'info');
                  }}
                >
                  🗑️ Clear All
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          {wishlist.length === 0 ? (
            <div className="wishlist-page__empty">
              <div className="wishlist-page__empty-icon">💖</div>
              <h2>Your wishlist is empty</h2>
              <p>Save items you love by clicking the heart icon on products</p>
              <Link to="/products" className="wishlist-page__btn wishlist-page__btn--primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="wishlist-page__grid">
              {wishlist.map((product) => (
                <div key={product.id} className="wishlist-page__card">
                  <button 
                    className="wishlist-page__remove"
                    onClick={() => handleRemove(product)}
                    aria-label="Remove from wishlist"
                  >
                    ✕
                  </button>

                  <Link to={`/products/${product.id}`} className="wishlist-page__image">
                    <img 
                      src={product.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop`}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop';
                      }}
                    />
                    {product.stock_quantity === 0 && (
                      <span className="wishlist-page__badge wishlist-page__badge--out">Out of Stock</span>
                    )}
                  </Link>

                  <div className="wishlist-page__info">
                    <span className="wishlist-page__category">{product.category_name || 'General'}</span>
                    <Link to={`/products/${product.id}`} className="wishlist-page__name">
                      {product.name}
                    </Link>
                    <div className="wishlist-page__pricing">
                      <span className="wishlist-page__price">
                        KES {parseFloat(product.price).toLocaleString()}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="wishlist-page__original">
                          KES {parseFloat(product.original_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="wishlist-page__added">
                      Added {formatDate(product.addedAt)}
                    </span>
                  </div>

                  <div className="wishlist-page__actions">
                    <button 
                      className="wishlist-page__btn wishlist-page__btn--primary wishlist-page__btn--full"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity === 0}
                    >
                      {product.stock_quantity === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;













