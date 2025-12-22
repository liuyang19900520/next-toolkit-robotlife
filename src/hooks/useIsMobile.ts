'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current viewport is mobile size
 * @param breakpoint - The breakpoint in pixels (default: 768)
 * @returns boolean indicating if the viewport is mobile
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Set initial value
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

