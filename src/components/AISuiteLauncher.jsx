import React, { useState, useEffect } from 'react';
import './AISuiteLauncher.css';

const AISuiteLauncher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configuration for the AI suite
  const SUITE_CONFIG = {
    appUrl: 'https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/17ce0c7c65e61adbc702a7f105a2b033/1a368b7f-031e-44d0-800a-9d972be0478d/index.html',
    buttonText: 'Launch AI Admission Suite',
    buttonPosition: 'top-right' // Options: 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  };

  // Launch AI Suite in fullscreen modal
  const launchAISuite = () => {
    setIsModalOpen(true);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Analytics tracking (if gtag is available)
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'ai_suite_launched', {
        event_category: 'engagement',
        event_label: 'floating_button'
      });
    }
    
    console.log('🎓 Plan My Admission AI Suite launched');
  };

  // Close AI Suite
  const closePMASuite = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Keyboard shortcut (Alt + A) to launch AI Suite
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        launchAISuite();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      {/* Launch Button */}
      <div 
        id="pmaAISuiteLauncher" 
        className={`pma-launcher ${SUITE_CONFIG.buttonPosition}`}
        onClick={launchAISuite}
      >
        <div className="pma-launcher-button">
          <div className="pma-launcher-icon">🎓</div>
          <div className="pma-launcher-text">{SUITE_CONFIG.buttonText}</div>
          <div className="pma-launcher-pulse"></div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="pma-suite-modal active">
          <button 
            className="pma-close-button" 
            onClick={closePMASuite}
            aria-label="Close AI Suite"
          >
            ×
          </button>
          <iframe 
            src={SUITE_CONFIG.appUrl} 
            className="pma-suite-frame" 
            title="Plan My Admission AI Suite"
            loading="lazy"
          />
        </div>
      )}
    </>
  );
};

export default AISuiteLauncher;
