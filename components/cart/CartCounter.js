'use client';

import { useCart } from '@/contexts/CartContext';

const CartCounter = ({ className = '', showZero = false }) => {
  const { cartCount, loading } = useCart();

  // Don't render if count is 0 and showZero is false
  if (!showZero && cartCount === 0) return null;

  return (
    <span 
      className={`
        inline-flex items-center justify-center
        bg-red-500 text-white text-xs font-medium
        rounded-full min-w-5 h-5 px-1
        transition-all duration-200
        ${loading ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {loading ? '...' : (cartCount > 99 ? '99+' : cartCount)}
    </span>
  );
};

export default CartCounter; 