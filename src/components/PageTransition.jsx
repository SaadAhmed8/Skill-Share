// src/components/PageTransition.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function PageTransition({ children }) {
  const location = useLocation();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* Top 3px solid black route-change progress bar */}
      <div
        key={`progress-${location.pathname}`}
        className="route-progress-bar"
        aria-hidden="true"
      />

      {/* Routed content fading in & moving up 8px */}
      <div
        key={location.pathname}
        className="page-fade-in"
      >
        {children}
      </div>
    </>
  );
}

