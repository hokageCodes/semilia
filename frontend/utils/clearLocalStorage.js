/**
 * Utility function to safely clear localStorage and handle any parsing errors
 */
export const clearLocalStorage = () => {
  if (typeof window === 'undefined') return;

  try {
    // Clear all localStorage items
    localStorage.clear();
    console.log('✅ localStorage cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
    
    // If clear() fails, try to remove items individually
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (itemError) {
          console.warn(`Could not remove key "${key}":`, itemError);
        }
      });
    } catch (individualError) {
      console.error('❌ Error removing individual localStorage items:', individualError);
    }
  }
};

/**
 * Utility function to safely get and parse JSON from localStorage
 */
export const safeGetJSON = (key, defaultValue = null) => {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Could not parse JSON for key "${key}":`, error.message);
    return defaultValue;
  }
};

/**
 * Utility function to safely set JSON in localStorage
 */
export const safeSetJSON = (key, value) => {
  if (typeof window === 'undefined') return;

  try {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Could not set value for key "${key}":`, error);
  }
};
