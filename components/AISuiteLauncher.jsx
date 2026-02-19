'use client';

import React, { Suspense, lazy, useState, useEffect } from 'react';
import '@/components/AISuiteLauncher.css';
const AIAdmissionTool = lazy(
  () => import('@components/ai-admission/AIAdmissionTool'),
);
const AISuiteLauncher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const SUITE_CONFIG = {
    buttonText: 'Launch AI Admission Suite',
    buttonPosition: 'top-right',
  };
  const launchAISuite = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'ai_suite_launched', {
        event_category: 'engagement',
        event_label: 'floating_button',
      });
    }
  };
  const closePMASuite = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };
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
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  return (
    <>
      {}
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

      {}
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
