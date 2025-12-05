// ==========================================
// LAZY IMAGE - Image with lazy loading & skeleton
// ==========================================

import React, { useState, useRef, useEffect } from 'react';
import './LazyImage.scss';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderColor = '#e2e8f0',
  aspectRatio = '1/1',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef}
      className={`lazy-image ${className}`}
      style={{ aspectRatio }}
    >
      {/* Skeleton placeholder */}
      <div 
        className={`lazy-image__skeleton ${isLoaded ? 'lazy-image__skeleton--hidden' : ''}`}
        style={{ backgroundColor: placeholderColor }}
      >
        <div className="lazy-image__shimmer" />
      </div>

      {/* Actual image */}
      {isInView && !error && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image__img ${isLoaded ? 'lazy-image__img--loaded' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="lazy-image__error">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default LazyImage;



