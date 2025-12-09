// ==========================================
// PRODUCTS PAGE - Browse & Add to Cart
// ==========================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useNotification } from '../../../context/NotificationContext';
import { Navbar, Footer, LoadingSpinner, ProductImage, getProductImageUrl } from '../../../components/common';
import productService from '../../../services/productService';
import './ProductsPage.scss';

const ProductsPage = () => {
  const { user } = useAuth();
  const { addToCart, getCartCount } = useCart();
  const { showSuccess } = useNotification();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Fetch products
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        status: 'active'
      };

      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const data = await productService.getAll(params);
      setProducts(data.products || []);
      
      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          ...data.pagination
        }));
      }

      // Extract categories
      if (page === 1 && !searchQuery) {
        const cats = productService.getCategories(data.products || []);
        setCategories(cats);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to demo products if API fails
      setProducts(getDemoProducts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [selectedCategory]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddToCart = (product) => {
    addToCart(product);
    showSuccess(`${product.name} added to cart!`);
  };

  const handlePageChange = (newPage) => {
    fetchProducts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = getCartCount();

  return (
    <div className="products-page">
      <Navbar />

      <main className="products-page__main">
        <div className="products-page__container">
          {/* Header */}
          <div className="products-page__header">
            <div>
              <h1>Our Products</h1>
              <p>Browse and order premium industrial minerals</p>
            </div>
            <div className="products-page__search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="products-page__categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`products-page__category ${selectedCategory === cat ? 'products-page__category--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="products-page__loading">
              <LoadingSpinner size="large" text="Loading products..." />
            </div>
          ) : products.length === 0 ? (
            <div className="products-page__empty">
              <div className="products-page__empty-icon">📦</div>
              <h2>No products found</h2>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              <div className="products-page__grid">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="products-page__pagination">
                  <button
                    className="products-page__page-btn"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </button>
                  
                  <div className="products-page__page-info">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  
                  <button
                    className="products-page__page-btn"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart }) => {
  const inStock = product.stock > 0 || product.inStock !== false;
  
  // Get image URL - handles arrays, objects, and strings
  const getImage = () => {
    if (product.images && product.images.length > 0) {
      return getProductImageUrl(product.images[0]);
    }
    if (product.image) {
      return getProductImageUrl(product.image);
    }
    return null; // Will use placeholder
  };

  return (
    <div className="product-card">
      <div className="product-card__image-wrapper">
        <ProductImage 
          src={getImage()} 
          alt={product.name}
          size="medium"
          className="product-card__product-image"
        />
        {!inStock && (
          <div className="product-card__out-of-stock">Out of Stock</div>
        )}
        {(product.purity || product.badge) && (
          <div className="product-card__badge">
            {product.purity || product.badge}
          </div>
        )}
      </div>
      
      <div className="product-card__content">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description || product.desc}</p>
        
        {product.weight && (
          <div className="product-card__meta">
            <span className="product-card__weight">📦 {product.weight}</span>
          </div>
        )}
        
        <div className="product-card__footer">
          <div className="product-card__price">
            <span className="product-card__amount">
              {product.price ? `KES ${Number(product.price).toLocaleString()}` : 'Request Quote'}
            </span>
            {product.unit && <span className="product-card__unit">/{product.unit}</span>}
          </div>
          
          <div className="product-card__actions">
            <button 
              className={`product-card__btn ${!inStock ? 'product-card__btn--disabled' : ''}`}
              disabled={!inStock}
              onClick={() => inStock && onAddToCart(product)}
            >
              {inStock ? 'Add to Cart' : 'Notify Me'}
            </button>
            <Link 
              to={`/products/${product.id}`}
              className="product-card__btn product-card__btn--secondary"
            >
              More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo products fallback
const getDemoProducts = () => [
  { id: 1, name: 'Gypsum Rock Lumps', category: 'Gypsum', purity: '89-93%', desc: 'High-quality natural gypsum for cement & construction', price: 15000, unit: 'tonne', inStock: true },
  { id: 2, name: 'Limestone Ore', category: 'Limestone', purity: '85-90%', desc: 'Premium limestone for industrial applications', price: 12000, unit: 'tonne', inStock: true },
  { id: 3, name: 'Iron Ore', category: 'Iron', purity: '60-65%', desc: 'Quality iron ore for steel manufacturing', price: 25000, unit: 'tonne', inStock: true },
  { id: 4, name: 'Bauxite Ore', category: 'Bauxite', purity: '45-50%', desc: 'Raw bauxite for aluminum production', price: 18000, unit: 'tonne', inStock: true },
  { id: 5, name: 'Gypsum Powder', category: 'Gypsum', purity: '90%+', desc: 'Processed gypsum powder for various uses', price: 22000, unit: 'tonne', inStock: false },
  { id: 6, name: 'Gypsum Wallboards', category: 'Gypsum', purity: 'N/A', desc: 'Construction-ready gypsum boards', price: 3500, unit: 'piece', inStock: false },
];

export default ProductsPage;

