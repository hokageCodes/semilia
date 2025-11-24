'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import { CheckCircle, Package, Truck, CreditCard, MapPin, Phone, Mail } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();

  // Fetch order details
  const { data: orderData, isLoading } = useQuery({
    queryKey: ['order', params.id],
    queryFn: () => ordersAPI.getOrder(params.id),
  });

  const order = orderData?.data?.order;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-yellow border-t-transparent rounded-full" />
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-4">Order Not Found</h1>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream">
        <div className="container-custom py-12">
          {/* Success Header */}
          <div className="bg-white rounded-xl p-8 shadow-lg text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-black mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg mb-4">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div className="inline-block bg-cream px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-2xl font-bold text-black">#{order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Track your order using:</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <span className="bg-yellow px-3 py-1 rounded text-sm font-mono">
                  {order.orderNumber || 'ORD-' + order._id.slice(-8).toUpperCase()}
                </span>
                <span className="text-gray-400">or</span>
                <span className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                  {order._id}
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-black mb-6">Order Status</h2>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Order Status</p>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                    <p className="font-semibold capitalize">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.product?.mainImage || item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'}
                          alt={item.product?.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">{item.product?.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>• Color: {item.color}</span>}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity} × ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-black">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Shipping Address
                </h2>
                <div className="text-gray-700 space-y-1">
                  <p className="font-semibold text-black">{order.user?.name || 'Guest'}</p>
                  <p>{order.shippingAddress?.street}</p>
                  <p>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                    {order.shippingAddress?.postalCode}
                  </p>
                  <p>{order.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
                <h2 className="text-2xl font-bold text-black mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₦{order.totalPrice?.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {order.shippingPrice === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₦${order.shippingPrice?.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Paid</span>
                      <span className="text-3xl font-bold text-black">
                        ₦{(order.totalPrice + (order.shippingPrice || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-200 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{order.user?.email || order.guestEmail}</span>
                  </div>
                  {order.user?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{order.user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href="/shop"
                    className="block w-full py-3 bg-yellow text-black text-center rounded-xl font-semibold hover:bg-yellow/90 transition-all mb-3"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block w-full py-3 bg-gray-100 text-black text-center rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    View All Orders
                  </Link>
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

