'use client';

import { useState, useEffect } from 'react';

/**
 * ClientOnly component that only renders its children on the client side
 * This prevents hydration mismatches for components that depend on client-side APIs
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children to render only on client
 * @param {React.ReactNode} props.fallback - Fallback to render on server (optional)
 * @param {boolean} props.placeholder - Whether to show a placeholder while loading
 * @returns {React.ReactNode} - Rendered component
 */
export default function ClientOnly({ children, fallback = null, placeholder = false }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    if (placeholder) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      );
    }
    return fallback;
  }

  return children;
}
