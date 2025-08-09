'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cart, cartCount, removeFromCart, updateQuantity, loading, clearCart } = useCart();
  const { user } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Helper to decide if increment button should be disabled
  const isIncrementDisabled = (product, quantity) => {
    if (loading) return true;
    if (typeof product?.stock === 'number' && product.stock > 0) {
      return quantity >= product.stock;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#ffcf04' }} />
        <p className="ml-3 text-lg text-black">Loading your cart...</p>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-black">Your Shopping Cart ({cartCount} item{cartCount !== 1 ? 's' : ''})</h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl font-semibold mb-4 text-black">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Cart Items List */}
          <section className="md:col-span-2 space-y-6">
            {cart.items.map((item, idx) => {
              const product = item.product;
              const price = product?.price || item.price || 0;

              return (
                <div key={item._id || `${product._id || product}-${idx}`} className="flex gap-6 border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={product?.images?.[0] || '/placeholder.jpg'}
                      alt={product?.name || 'Product'}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-black truncate">{product?.name || 'Product'}</h2>
                      <p className="text-yellow-600 font-bold mt-1">{formatPrice(price)}</p>
                      {product?.stock && product.stock < 10 && (
                        <p className="text-sm text-orange-600 mt-1">Only {product.stock} left in stock</p>
                      )}
                    </div>

                    <div className="flex items-center mt-4 gap-4">
                      {/* Quantity Controls */}
                      <button
                        onClick={() => updateQuantity(product._id || product, item.quantity - 1)}
                        disabled={loading}
                        className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded-md text-black disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold text-black min-w-[2ch] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product._id || product, item.quantity + 1)}
                        disabled={isIncrementDisabled(product, item.quantity)}
                        className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded-md text-black disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        onClick={() => removeFromCart(product._id || product)}
                        disabled={loading}
                        className="ml-auto p-2 rounded-md text-red-600 hover:bg-red-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Subtotal: {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Summary & Checkout */}
          <aside className="border rounded-lg p-6 shadow-md h-fit sticky top-10 bg-white">
            <h2 className="text-xl font-bold mb-4 text-black">Order Summary</h2>
            <div className="space-y-3 text-black">
              <div className="flex justify-between">
                <span>Items ({cartCount}):</span>
                <span>{formatPrice(cart.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatPrice(cart.totalPrice)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block mt-6 py-3 bg-yellow-400 text-black text-center font-semibold rounded-lg hover:bg-yellow-500 transition"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your cart?')) {
                  clearCart();
                }
              }}
              disabled={loading}
              className="mt-3 w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
            >
              Clear Cart
            </button>

            {!user && (
              <p className="mt-4 text-sm text-yellow-700 bg-yellow-100 p-3 rounded">
                💡 <Link href="/login" className="underline">Login</Link> to save your cart permanently and speed up checkout.
              </p>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
