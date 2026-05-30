import React from "react";
import "../Styles/PromoBanner.css";

const PromoBanner = () => {
  return (
    <div className="promo-banner-card">
      {/* Immersive background graphics setup */}
      <div className="promo-bg-overlay"></div>
      <div className="promo-pizza-graphic">🍕</div>
      
      <div className="promo-content">
        <div className="promo-badge-tag">LIMITED TIME SPECIAL</div>
        <h2>Unlock Authentic Italian Flavors</h2>
        <p>Get an extra <span className="highlight-text">10% OFF</span> on your inaugural artisan pizza order.</p>
        
        <div className="promo-code-pill">
          <span className="code-label">USE CODE:</span>
          <strong className="code-string">FIRST10</strong>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;