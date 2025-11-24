'use client';

import { useEffect } from 'react';
import { clearLocalStorage } from '@/utils/clearLocalStorage';

export default function DevLocalStorageCleanup() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    // Check for common localStorage issues
    const checkLocalStorage = () => {
      try {
        const keys = Object.keys(localStorage);
        let hasIssues = false;

        keys.forEach(key => {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              // Try to parse as JSON
              JSON.parse(value);
            }
          } catch (error) {
            console.warn(`⚠️ localStorage key "${key}" contains invalid JSON:`, error.message);
            hasIssues = true;
          }
        });

        if (hasIssues) {
          console.log('🧹 Found localStorage issues. You can clear them by running: clearLocalStorage() in the console');
        }
      } catch (error) {
        console.error('❌ Error checking localStorage:', error);
      }
    };

    // Check localStorage on mount
    checkLocalStorage();

    // Make clearLocalStorage available globally in development
    if (typeof window !== 'undefined') {
      window.clearLocalStorage = clearLocalStorage;
    }
  }, []);

  return null; // This component doesn't render anything
}
