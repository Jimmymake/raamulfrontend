// ==========================================
// PRODUCT IMAGE COMPONENT
// Handles PNG product images with transparent backgrounds
// ==========================================

import React, { useState } from 'react';
import './ProductImage.scss';

// SVG placeholder for missing product images
const PLACEHOLDER_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="250" viewBox="0 0 200 250">
    <defs>
      <linearGradient id="bag" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f1f5f9"/>
        <stop offset="100%" style="stop-color:#e2e8f0"/>
      </linearGradient>
    </defs>
    <rect fill="url(#bag)" width="200" height="250" rx="8"/>
    <rect x="40" y="30" width="120" height="180" fill="#fff" rx="4" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="100" cy="70" r="25" fill="#0ea5e9" opacity="0.2"/>
    <text x="100" y="130" text-anchor="middle" fill="#64748b" font-family="system-ui" font-size="12" font-weight="600">RAAMUL</text>
    <text x="100" y="150" text-anchor="middle" fill="#94a3b8" font-family="system-ui" font-size="10">INTERNATIONAL</text>
    <rect x="60" y="170" width="80" height="20" fill="#0ea5e9" opacity="0.1" rx="4"/>
    <text x="100" y="184" text-anchor="middle" fill="#0ea5e9" font-family="system-ui" font-size="9" font-weight="600">PRODUCT</text>
  </svg>
`;

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(PLACEHOLDER_SVG.trim());

/**
 * Get the proper image URL from various formats
 * @param {string|object} image - Image URL string or image object
 * @returns {string} - Resolved image URL
 */
export const getProductImageUrl = (image) => {
  if (!image) return PLACEHOLDER_IMAGE;
  
  // If it's an object with url property
  if (typeof image === 'object' && image.url) {
    return image.url;
  }
  
  // If it's a string
  if (typeof image === 'string') {
    // Already a full URL (http/https)
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // Data URL (base64 or SVG)
    if (image.startsWith('data:')) {
      return image;
    }
    
    // Local path starting with /
    if (image.startsWith('/')) {
      return image;
    }
    
    // Relative path - prepend /
    return `/${image}`;
  }
  
  return PLACEHOLDER_IMAGE;
};

const ProductImage = ({ 
  src, 
  alt = 'Product', 
  size = 'medium',
  className = '',
  showShadow = true,
  onClick = null
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const imageUrl = error ? PLACEHOLDER_IMAGE : getProductImageUrl(src);
  
  const handleError = () => {
    setError(true);
    setLoading(false);
  };
  
  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div 
      className={`product-image product-image--${size} ${className} ${onClick ? 'product-image--clickable' : ''}`}
      onClick={onClick}
    >
      {loading && (
        <div className="product-image__skeleton">
          <div className="product-image__skeleton-shimmer" />
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={`product-image__img ${showShadow ? 'product-image__img--shadow' : ''} ${loading ? 'product-image__img--loading' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
};

export { PLACEHOLDER_IMAGE };
export default ProductImage;













