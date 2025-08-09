// components/cart/CartButton.js
'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function CartButton({ product, className = "", size = "default" }) {
  const { addToCart, loading } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    default: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-xl 
        transition-all duration-200 hover:opacity-90 focus:opacity-90 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]} ${className}
      `}
      style={{ 
        backgroundColor: '#ffcf04',
        color: '#000000'
      }}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        <ShoppingCart className="w-4 h-4 mr-2" />
      )}
      Add to Cart
    </button>
  );
}
