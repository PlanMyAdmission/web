import React, { Suspense, lazy, useState, useEffect } from 'react';
import './AISuiteLauncher.css';

const AIAdmissionTool = lazy(() => import('./ai-admission/AIAdmissionTool'));

const AISuiteLauncher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configuration for the AI suite
  const SUITE_CONFIG = {
    buttonText: 'Launch AI Admission Suite',
    buttonPosition: 'top-right', // Options: 'top-right', 'top-left', 'bottom-right', 'bottom-left'
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
        event_label: 'floating_button',
      });
    }

    console.log('Plan My Admission AI Suite launched');
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
          <Suspense
            fallback={<div className="pma-suite-loading">Loading...</div>}
          >
            <AIAdmissionTool />
          </Suspense>
        </div>
      )}
    </>
  );
};

export default AISuiteLauncher;
