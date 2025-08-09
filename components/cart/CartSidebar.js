'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSidebar({ isOpen, onClose }) {
  const { 
    cart, 
    cartCount, 
    removeFromCart, 
    updateQuantity, 
    loading, 
    loadingItems, // <---- added here
    clearCart 
  } = useCart();
  const { user } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-cream">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" style={{ color: '#000000' }} />
                <h2 className="text-lg font-bold" style={{ color: '#000000' }}>
                  Your Cart ({cart.items.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:opacity-70 transition-opacity"
                style={{ backgroundColor: '#ffcf04' }}
              >
                <X className="w-5 h-5" style={{ color: '#000000' }} />
              </button>
            </div>

            {/* User status indicator */}
            <div className="px-4 py-2 text-xs border-b" style={{ backgroundColor: '#f8f9fa', color: '#666' }}>
              {user ? (
                <span>✅ Logged in as {user.name} - Cart synced</span>
              ) : (
                <span>🛒 Guest cart - <Link href="/login" className="text-blue-600 hover:underline" onClick={onClose}>Login</Link> to save permanently</span>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#ffcf04' }} />
                  <span className="ml-3 text-black">Updating cart...</span>
                </div>
              ) : cart.items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: '#000000' }} />
                  <p className="text-lg font-medium mb-2" style={{ color: '#000000' }}>Your cart is empty</p>
                  <p className="text-sm mb-4" style={{ color: '#000000', opacity: '0.6' }}>Add some items to get started!</p>
                  <Link 
                    href="/shop"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: '#ffcf04', color: '#000000' }}
                  >
                    Browse Products
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.items.map((item, index) => {
                      const product = item.product;
                      const price = product?.price || item.price || 0;
                      const productId = product._id || product;
                      const itemLoading = loadingItems[productId] || false; // <-- per item loading flag

                      return (
                        <motion.div
                          key={item._id || `${productId}-${index}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow"
                          style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                        >
                          {/* Product Image */}
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={product?.images?.[0] || '/placeholder.jpg'}
                              alt={product?.name || 'Product'}
                              fill
                              sizes="64px"
                              className="object-cover rounded-lg"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate" style={{ color: '#000000' }}>
                              {product?.name || 'Product'}
                            </h3>
                            <p className="text-sm font-bold" style={{ color: '#000000' }}>
                              {formatPrice(price)}
                            </p>

                            {/* Stock indicator */}
                            {product?.stock && product.stock < 10 && (
                              <p className="text-xs text-orange-600 mt-1">
                                Only {product.stock} left in stock
                              </p>
                            )}

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(productId, item.quantity - 1)}
                                className="p-1 rounded-md transition-colors hover:opacity-80"
                                style={{ backgroundColor: '#ffcf04' }}
                                disabled={itemLoading}
                              >
                                <Minus className="w-3 h-3" style={{ color: '#000000' }} />
                              </button>

                              <span className="text-sm font-medium min-w-[2ch] text-center" style={{ color: '#000000' }}>
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => updateQuantity(productId, item.quantity + 1)}
                                className="p-1 rounded-md transition-colors hover:opacity-80"
                                style={{ backgroundColor: '#ffcf04' }}
                                disabled={itemLoading || (product?.stock && item.quantity >= product.stock)}
                              >
                                <Plus className="w-3 h-3" style={{ color: '#000000' }} />
                              </button>

                              <button
                                onClick={() => removeFromCart(productId)}
                                className="p-1 rounded-md transition-colors ml-2 hover:opacity-70"
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                disabled={itemLoading}
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </button>
                            </div>

                            {/* Subtotal */}
                            <p className="text-xs mt-1" style={{ color: '#666' }}>
                              Subtotal: {formatPrice(price * item.quantity)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t p-4 space-y-4 bg-white" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                {/* Cart Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span style={{ color: '#666' }}>Items ({cartCount}):</span>
                    <span style={{ color: '#000000' }}>{formatPrice(cart.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span style={{ color: '#666' }}>Shipping:</span>
                    <span style={{ color: '#000000' }}>Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-lg font-bold" style={{ color: '#000000' }}>Total:</span>
                    <span className="text-xl font-bold" style={{ color: '#000000' }}>
                      {formatPrice(cart.totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="block w-full py-3 font-semibold rounded-lg transition-all duration-200 hover:opacity-90 text-center"
                    style={{ 
                      backgroundColor: '#ffcf04',
                      color: '#000000'
                    }}
                  >
                    Proceed to Checkout
                  </Link>

                  <div className="flex gap-2">
                    <Link
                      href="/cart"
                      onClick={onClose}
                      className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-70 text-center"
                      style={{ 
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        color: '#000000'
                      }}
                    >
                      View Cart
                    </Link>

                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear your cart?')) {
                          clearCart();
                        }
                      }}
                      className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-70"
                      style={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444'
                      }}
                      disabled={loading}
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                {/* Guest user reminder */}
                {!user && (
                  <div className="text-xs text-center p-2 rounded" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                    💡 <Link href="/login" className="underline" onClick={onClose}>Login</Link> to save your cart permanently and access faster checkout
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
