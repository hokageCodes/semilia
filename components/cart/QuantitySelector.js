'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Plus, Minus } from 'lucide-react';

export default function QuantitySelector({ product, initialQuantity = 1, onQuantityChange }) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const { addToCart, loading } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    if (onQuantityChange) onQuantityChange(newQuantity);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Quantity Controls */}
      <div className="flex items-center gap-2 border rounded-lg p-1" style={{ borderColor: 'rgba(0,0,0,0.2)' }}>
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="p-2 rounded-md transition-colors hover:opacity-80"
          style={{ backgroundColor: '#ffcf04' }}
          disabled={quantity <= 1}
        >
          <Minus className="w-4 h-4" style={{ color: '#000000' }} />
        </button>
        
        <span className="text-lg font-medium min-w-[3ch] text-center" style={{ color: '#000000' }}>
          {quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="p-2 rounded-md transition-colors hover:opacity-80"
          style={{ backgroundColor: '#ffcf04' }}
        >
          <Plus className="w-4 h-4" style={{ color: '#000000' }} />
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="flex-1 py-3 px-6 font-semibold rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50"
        style={{ 
          backgroundColor: '#ffcf04',
          color: '#000000'
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Adding...
          </div>
        ) : (
          'Add to Cart'
        )}
      </button>
    </div>
  );
}