// ==========================================
// LOADING SPINNER COMPONENT
// ==========================================

import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ 
  size = 'medium', 
  fullScreen = false,
  text = null 
}) => {
  const spinner = (
    <div className={`spinner spinner--${size}`}>
      <div className="spinner__circle" />
      {text && <span className="spinner__text">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;













