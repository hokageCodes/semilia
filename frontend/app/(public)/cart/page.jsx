'use client';

import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useCart();
  const router = useRouter();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 2500; // Free shipping over ₦50,000
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-400" />
            <h1 className="text-3xl font-bold text-black mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-yellow text-black rounded-xl font-medium hover:bg-yellow/90 transition-all"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="container-custom py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Shopping Cart</h1>
              <p className="text-gray-600">{getCartCount()} items in your cart</p>
            </div>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.product.slug || item.product._id}`}
                      className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden"
                    >
                      {(() => {
                        // Handle both full product object and simplified structure
                        const imageUrl = 
                          item.product.mainImage?.trim() || 
                          item.product.images?.[0]?.url?.trim() ||
                          item.product.image?.trim();
                        
                        // Filter out placeholder images
                        const placeholderPatterns = [
                          '/placeholder.jpg',
                          'placeholder.jpg',
                          'via.placeholder.com',
                          'placeholder'
                        ];
                        
                        const isPlaceholder = imageUrl && placeholderPatterns.some(pattern => 
                          imageUrl.toLowerCase().includes(pattern.toLowerCase())
                        );
                        
                        return imageUrl && !isPlaceholder ? (
                          <Image
                            src={imageUrl}
                            alt={item.product.name || 'Product'}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                            unoptimized
                            onError={(e) => {
                              console.error('Image load error:', imageUrl);
                              e.target.style.display = 'none';
                              if (e.target.parentElement) {
                                e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-200 text-gray-400 text-xs">No Image</div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400 text-xs">
                            No Image
                          </div>
                        );
                      })()}
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link
                            href={`/products/${item.product.slug || item.product._id}`}
                            className="font-bold text-lg text-black hover:text-yellow transition-colors line-clamp-1"
                          >
                            {item.product.name || 'Product'}
                          </Link>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                            {item.selectedSize && (
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                Color: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(
                              typeof item.product === 'string' ? item.product : item.product._id,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center bg-gray-100 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(
                                typeof item.product === 'string' ? item.product : item.product._id,
                                item.quantity - 1,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                            className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                typeof item.product === 'string' ? item.product : item.product._id,
                                item.quantity + 1,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                            className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-black">
                            ₦{((item.product.price || 0) * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₦{(item.product.price || 0).toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
                <h2 className="text-2xl font-bold text-black mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getCartCount()} items)</span>
                    <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₦${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  {subtotal < 50000 && shipping > 0 && (
                    <p className="text-sm text-gray-500 bg-yellow/10 p-3 rounded-lg">
                      Add ₦{(50000 - subtotal).toLocaleString()} more for free shipping!
                    </p>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-black">Total</span>
                      <span className="text-3xl font-bold text-black">
                        ₦{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full py-4 bg-yellow text-black rounded-xl font-bold text-lg hover:bg-yellow/90 transition-all transform hover:scale-105 shadow-lg mb-4"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/shop"
                  className="block text-center text-gray-600 hover:text-yellow font-medium transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>14-day return policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Free shipping over ₦50,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

