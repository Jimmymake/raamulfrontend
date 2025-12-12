// ==========================================
// SEARCH BAR WITH AUTOCOMPLETE
// ==========================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../../services/productService';
import './SearchBar.scss';

const SearchBar = ({ placeholder = 'Search products...', onSearch, className = '' }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await productService.getAll({ search: query, limit: 6 });
        setSuggestions(data.products || []);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/products?search=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleSelectSuggestion = (product) => {
    setQuery(product.name);
    setShowSuggestions(false);
    navigate(`/products/${product.id}`);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  return (
    <div className={`search-bar ${className}`} ref={wrapperRef}>
      <div className="search-bar__input-wrapper">
        <span className="search-bar__icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="search-bar__input"
          autoComplete="off"
        />
        {loading && <span className="search-bar__loading">⟳</span>}
        {query && (
          <button 
            className="search-bar__clear"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              inputRef.current?.focus();
            }}
          >
            ✕
          </button>
        )}
      </div>

      {showSuggestions && query.length >= 2 && (
        <div className="search-bar__suggestions">
          {loading ? (
            <div className="search-bar__loading-state">Searching...</div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((product, index) => (
                <button
                  key={product.id}
                  className={`search-bar__suggestion ${index === selectedIndex ? 'search-bar__suggestion--active' : ''}`}
                  onClick={() => handleSelectSuggestion(product)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="search-bar__suggestion-image">
                    <img 
                      src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop';
                      }}
                    />
                  </div>
                  <div className="search-bar__suggestion-info">
                    <span className="search-bar__suggestion-name">
                      {highlightMatch(product.name, query)}
                    </span>
                    <span className="search-bar__suggestion-price">
                      KES {parseFloat(product.price).toLocaleString()}
                    </span>
                  </div>
                </button>
              ))}
              <button 
                className="search-bar__view-all"
                onClick={handleSearch}
              >
                View all results for "{query}" →
              </button>
            </>
          ) : (
            <div className="search-bar__no-results">
              <span>😕</span>
              <span>No products found for "{query}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
















