'use client';

import { useEffect } from 'react';

/**
 * Locks body scroll while `active` is true and restores it on cleanup.
 * Handles iOS Safari by saving/restoring the scroll position alongside
 * the overflow toggle.
 *
 * Usage:
 *   useBodyScrollLock(isModalOpen);
 */
export default function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return;

    const scrollY = window.scrollY;
    const { overflow, position, top, width } = document.body.style;

    // Standard lock
    document.body.style.overflow = 'hidden';
    // iOS Safari: overflow:hidden alone doesn't prevent scroll;
    // position:fixed + top offset keeps the viewport from jumping.
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      // Restore the scroll position that was lost due to position:fixed
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}
