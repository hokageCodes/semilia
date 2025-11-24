'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for safe localStorage access that prevents hydration mismatches
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if no stored value exists
 * @returns {[any, function]} - [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage only on client side
      if (isClient && typeof window !== 'undefined') {
        // Handle different value types appropriately
        if (typeof valueToStore === 'string') {
          // For strings (like JWT tokens), store directly without JSON.stringify
          window.localStorage.setItem(key, valueToStore);
        } else {
          // For objects/arrays, use JSON.stringify
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, isClient]);

  // Load from localStorage on client side
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // Try to parse as JSON, but handle cases where it might be a plain string (like JWT tokens)
        try {
          setStoredValue(JSON.parse(item));
        } catch (parseError) {
          // If JSON.parse fails, it might be a plain string value
          console.warn(`Value for key "${key}" is not valid JSON, treating as string:`, parseError.message);
          setStoredValue(item);
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      // Clear the problematic value
      try {
        window.localStorage.removeItem(key);
      } catch (clearError) {
        console.error(`Error clearing localStorage key "${key}":`, clearError);
      }
    }
  }, [key, isClient]);

  return [storedValue, setValue];
}

/**
 * Custom hook for safe localStorage removal
 * @param {string} key - The localStorage key to remove
 */
export function useRemoveLocalStorage(key) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const removeValue = useCallback(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
      }
    }
  }, [key, isClient]);

  return removeValue;
}

/**
 * Custom hook for checking if we're on the client side
 * @returns {boolean} - True if on client side, false if on server side
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
