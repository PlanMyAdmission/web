'use client';

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackAiToolEvent } from '@/lib/analytics/events.js';
import styles from './AISuiteLauncher.module.css';

const HIDDEN_PATHS = ['/essay-review', '/ai-university-matchmaker'];
const cx = (...classNames) =>
  classNames
    .flatMap((value) => `${value || ''}`.split(/\s+/))
    .map((name) => styles[name])
    .filter(Boolean)
    .join(' ');
const AIAdmissionTool = lazy(
  () => import('@/components/ai-admission/AIAdmissionTool'),
);
const AISuiteLauncher = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const hidden =
    mounted && HIDDEN_PATHS.some((path) => pathname?.startsWith(path));
  const SUITE_CONFIG = {
    buttonText: 'Launch AI Admission Suite',
    buttonPosition: 'top-right',
  };
  const launchAISuite = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    trackAiToolEvent({
      toolName: 'admission_suite',
      action: 'launch',
      status: 'opened',
      surface: 'floating_button',
    });
  };
  const closePMASuite = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    trackAiToolEvent({
      toolName: 'admission_suite',
      action: 'close',
      status: 'dismissed',
      surface: 'modal',
    });
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
  if (!mounted) return null;
  if (hidden && !isModalOpen) return null;

  return (
    <>
      {!hidden && (
      <div
        id="pmaAISuiteLauncher"
        className={cx('pma-launcher', SUITE_CONFIG.buttonPosition)}
        onClick={launchAISuite}
      >
        <div className={cx('pma-launcher-button')}>
          <div className={cx('pma-launcher-icon')}>🎓</div>
          <div className={cx('pma-launcher-text')}>
            {SUITE_CONFIG.buttonText}
          </div>
          <div className={cx('pma-launcher-pulse')}></div>
        </div>
      </div>
      )}

      {isModalOpen && (
        <div className={cx('pma-suite-modal', 'active')}>
          <button
            className={cx('pma-close-button')}
            onClick={closePMASuite}
            aria-label="Close AI Suite"
          >
            ×
          </button>
          <Suspense
            fallback={<div className={cx('pma-suite-loading')}>Loading...</div>}
          >
            <AIAdmissionTool />
          </Suspense>
        </div>
      )}
    </>
  );
};
export default AISuiteLauncher;
