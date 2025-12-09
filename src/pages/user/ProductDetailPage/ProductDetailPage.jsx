// ==========================================
// PRODUCT DETAIL PAGE - Full Product View
// ==========================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useNotification } from '../../../context/NotificationContext';
import { Navbar, LoadingSpinner, ProductImage, getProductImageUrl } from '../../../components/common';
import productService from '../../../services/productService';
import './ProductDetailPage.scss';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const normalizeProduct = (data) => {
    const prod = data?.product || data?.data || data;
    return prod || null;
  };

  // Derived helpers for text fields
  const getDescriptionText = (p) =>
    p?.description ||
    p?.long_description ||
    p?.product_description ||
    p?.details ||
    p?.desc ||
    p?.meta?.description ||
    'No description available. Please contact us for more information about this product.';

  const getDetailsText = (p) =>
    p?.details ||
    p?.long_description ||
    p?.product_details ||
    p?.meta?.details ||
    '';

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getById(id);
      const prod = normalizeProduct(data);
      setProduct(prod);
      
      // Fetch related products from same category
      const categoryId = prod?.category_id || prod?.categoryId || prod?.category?.id;
      if (categoryId) {
        const related = await productService.getAll({ category_id: categoryId, limit: 4 });
        setRelatedProducts((related.products || []).filter(p => p.id !== prod.id).slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      showNotification('Failed to load product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      showNotification(`${quantity}x ${product.name} added to cart!`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const getImages = () => {
    if (!product) return [];
    
    // Multiple images support
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(img => getProductImageUrl(img));
    }
    
    // Single image
    if (product.image) {
      return [getProductImageUrl(product.image)];
    }
    
    if (product.image_url) {
      return [getProductImageUrl(product.image_url)];
    }
    
    // Placeholder - will be handled by ProductImage component
    return [null];
  };

  const images = getImages();
  const descriptionText = getDescriptionText(product);
  const detailsText = getDetailsText(product);
  const features = Array.isArray(product?.features) ? product.features : [];
  const attributes = product?.attributes;

  if (loading) {
    return (
      <div className="product-detail">
        <Navbar />
        <div className="product-detail__loading">
          <LoadingSpinner size="large" text="Loading product..." />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <Navbar />
        <div className="product-detail__not-found">
          <div className="product-detail__not-found-icon">🔍</div>
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="product-detail__btn">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <Navbar />

      <main className="product-detail__main">
        <div className="product-detail__container">
          {/* Breadcrumb */}
          <nav className="product-detail__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Products</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="product-detail__content">
            {/* Gallery */}
            <div className="product-detail__gallery">
              <div className="product-detail__main-image">
                <ProductImage 
                  src={images[selectedImage]} 
                  alt={product.name}
                  size="xlarge"
                  className="product-detail__product-image"
                />
                {product.status === 'out_of_stock' && (
                  <div className="product-detail__badge product-detail__badge--out">Out of Stock</div>
                )}
                {product.discount_percentage > 0 && (
                  <div className="product-detail__badge product-detail__badge--sale">
                    -{product.discount_percentage}%
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="product-detail__thumbnails">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`product-detail__thumbnail ${selectedImage === idx ? 'product-detail__thumbnail--active' : ''}`}
                      onClick={() => setSelectedImage(idx)}
                    >
                      <ProductImage 
                        src={img} 
                        alt={`${product.name} view ${idx + 1}`}
                        size="tiny"
                        showShadow={false}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="product-detail__info">
              {product.category_name && (
                <span className="product-detail__category">{product.category_name}</span>
              )}

              <h1 className="product-detail__title">{product.name}</h1>

              {product.sku && (
                <span className="product-detail__sku">SKU: {product.sku}</span>
              )}

              <div className="product-detail__pricing">
                <span className="product-detail__price">
                  {product.price && !isNaN(parseFloat(product.price)) ? (
                    `KES ${parseFloat(product.price).toLocaleString()}`
                  ) : (
                    'Request Quote'
                  )}
                </span>
                {product.original_price && product.original_price > product.price && !isNaN(parseFloat(product.original_price)) && (
                  <span className="product-detail__original-price">
                    KES {parseFloat(product.original_price).toLocaleString()}
                  </span>
                )}
                {product.unit && (
                  <span className="product-detail__unit">/{product.unit}</span>
                )}
              </div>

              <div className="product-detail__stock">
                {(product.stock_quantity > 0 || product.stock > 0 || product.inStock) ? (
                  (product.stock_quantity > 10 || product.stock > 10) ? (
                    <span className="product-detail__stock--in">✓ In Stock</span>
                  ) : (
                    <span className="product-detail__stock--low">
                      ⚠ Only {(product.stock_quantity || product.stock || 0)} left
                    </span>
                  )
                ) : (
                  <span className="product-detail__stock--out">✗ Out of Stock</span>
                )}
              </div>

              {/* Product Details */}
              <div className="product-detail__details">
                <h3>Product Details</h3>
                {(detailsText || product.weight || product.purity || product.category || product.badge) ? (
                  <>
                    {detailsText && (
                      <p className="product-detail__details-body">{detailsText}</p>
                    )}

                    <div className="product-detail__details-grid">
                      {product.weight && (
                        <div className="product-detail__detail-item">
                          <span className="product-detail__detail-label">Weight:</span>
                          <span className="product-detail__detail-value">📦 {product.weight}</span>
                        </div>
                      )}
                      {product.purity && (
                        <div className="product-detail__detail-item">
                          <span className="product-detail__detail-label">Purity:</span>
                          <span className="product-detail__detail-value">{product.purity}</span>
                        </div>
                      )}
                      {product.category && (
                        <div className="product-detail__detail-item">
                          <span className="product-detail__detail-label">Category:</span>
                          <span className="product-detail__detail-value">{product.category}</span>
                        </div>
                      )}
                      {product.badge && (
                        <div className="product-detail__detail-item">
                          <span className="product-detail__detail-label">Grade:</span>
                          <span className="product-detail__detail-value">{product.badge}</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="product-detail__details-empty">
                    No details available. Please contact us for more information about this product.
                  </p>
                )}

                {features.length > 0 && (
                  <div className="product-detail__list">
                    <h4>Key Features</h4>
                    <ul>
                      {features.map((feat, idx) => (
                        <li key={idx}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {attributes && (
                  <div className="product-detail__list">
                    <h4>Attributes</h4>
                    <ul>
                      {Array.isArray(attributes)
                        ? attributes.map((attr, idx) => (
                            <li key={idx}>
                              <span className="product-detail__attr-key">{attr?.label || attr?.key || 'Attribute'}:</span>
                              <span className="product-detail__attr-value">{attr?.value || attr?.val || ''}</span>
                            </li>
                          ))
                        : Object.entries(attributes).map(([key, value]) => (
                            <li key={key}>
                              <span className="product-detail__attr-key">{key}:</span>
                              <span className="product-detail__attr-value">{value}</span>
                            </li>
                          ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="product-detail__description">
                <h3>Description</h3>
                <p>{descriptionText}</p>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div className="product-detail__specs">
                  <h3>Specifications</h3>
                  <ul>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <li key={key}>
                        <span>{key}</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="product-detail__actions">
                <div className="product-detail__quantity">
                  <label>Quantity:</label>
                  <div className="product-detail__quantity-controls">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock_quantity || product.stock || 99}
                    />
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock_quantity || product.stock || 99, q + 1))}
                      disabled={quantity >= (product.stock_quantity || product.stock || 99)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="product-detail__buttons">
                  <button 
                    className="product-detail__btn product-detail__btn--cart"
                    onClick={handleAddToCart}
                    disabled={(product.stock_quantity === 0 && product.stock === 0) || (!product.stock_quantity && !product.stock && !product.inStock)}
                  >
                    🛒 Add to Cart
                  </button>
                  <button 
                    className="product-detail__btn product-detail__btn--buy"
                    onClick={handleBuyNow}
                    disabled={(product.stock_quantity === 0 && product.stock === 0) || (!product.stock_quantity && !product.stock && !product.inStock)}
                  >
                    ⚡ Buy Now
                  </button>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="product-detail__delivery">
                <div className="product-detail__delivery-item">
                  <span className="product-detail__delivery-icon">🚚</span>
                  <div>
                    <strong>Free Delivery</strong>
                    <span>On orders over KES 5,000</span>
                  </div>
                </div>
                <div className="product-detail__delivery-item">
                  <span className="product-detail__delivery-icon">↩️</span>
                  <div>
                    <strong>Easy Returns</strong>
                    <span>30 days return policy</span>
                  </div>
                </div>
                <div className="product-detail__delivery-item">
                  <span className="product-detail__delivery-icon">🔒</span>
                  <div>
                    <strong>Secure Payment</strong>
                    <span>M-Pesa & Card payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="product-detail__related">
              <h2>Related Products</h2>
              <div className="product-detail__related-grid">
                {relatedProducts.map((relProduct) => (
                  <Link 
                    key={relProduct.id} 
                    to={`/products/${relProduct.id}`}
                    className="product-detail__related-card"
                  >
                    <div className="product-detail__related-image">
                      <img 
                        src={relProduct.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop`}
                        alt={relProduct.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop';
                        }}
                      />
                    </div>
                    <div className="product-detail__related-info">
                      <h4>{relProduct.name}</h4>
                      <span className="product-detail__related-price">
                        KES {parseFloat(relProduct.price).toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;




