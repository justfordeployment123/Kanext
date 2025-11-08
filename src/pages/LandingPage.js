import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  return (
    <div className={`landing-page ${fadeIn ? 'fade-in' : ''}`}>
      {/* Top Right Navigation */}
      <div className="landing-nav">
        <a href="/login" className="nav-link">Login</a>
        <span className="nav-divider">·</span>
        <a href="#about" className="nav-link">About</a>
      </div>

      {/* Center Content */}
      <div className="landing-content">
        <div className="logo">
          <h1 className="brand-name">KaNeXT IQ™</h1>
        </div>

        <h2 className="tagline">The Future of Sports Intelligence</h2>

        <div className="module-line">
          Basketball IQ™ — Guided by your AI Assistant, Coach K™.
        </div>

        <div className="divider-line"></div>

        <div className="cta-buttons">
          <button 
            className="primary-cta" 
            onClick={() => navigate('/login')}
          >
            Enter Platform
          </button>
          <button 
            className="secondary-cta"
            onClick={() => navigate('/about')}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

