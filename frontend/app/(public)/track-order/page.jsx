'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '@/lib/api';
import { Search, Package, MapPin, Phone, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Truck, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

const statusConfig = {
  pending: { 
    color: 'text-yellow-600 bg-yellow-100', 
    icon: Clock, 
    label: 'Order Received',
    description: 'Your order has been received and is awaiting confirmation'
  },
  confirmed: { 
    color: 'text-blue-600 bg-blue-100', 
    icon: CheckCircle, 
    label: 'Order Confirmed',
    description: 'Your order has been confirmed and payment verified'
  },
  processing: { 
    color: 'text-purple-600 bg-purple-100', 
    icon: Package, 
    label: 'Processing',
    description: 'Your order is being prepared'
  },
  quality_check: { 
    color: 'text-indigo-600 bg-indigo-100', 
    icon: AlertCircle, 
    label: 'Quality Check',
    description: 'Your order is undergoing quality control'
  },
  packaging: { 
    color: 'text-orange-600 bg-orange-100', 
    icon: Package, 
    label: 'Packaging',
    description: 'Your order is being packaged'
  },
  ready_to_ship: { 
    color: 'text-cyan-600 bg-cyan-100', 
    icon: Truck, 
    label: 'Ready to Ship',
    description: 'Your order is ready for pickup by courier'
  },
  shipped: { 
    color: 'text-green-600 bg-green-100', 
    icon: Truck, 
    label: 'Shipped',
    description: 'Your order has been dispatched'
  },
  in_transit: { 
    color: 'text-teal-600 bg-teal-100', 
    icon: Truck, 
    label: 'In Transit',
    description: 'Your order is on its way to you'
  },
  out_for_delivery: { 
    color: 'text-emerald-600 bg-emerald-100', 
    icon: Truck, 
    label: 'Out for Delivery',
    description: 'Your order is out for delivery'
  },
  delivered: { 
    color: 'text-green-600 bg-green-100', 
    icon: Home, 
    label: 'Delivered',
    description: 'Your order has been successfully delivered'
  },
  cancelled: { 
    color: 'text-red-600 bg-red-100', 
    icon: XCircle, 
    label: 'Cancelled',
    description: 'Your order has been cancelled'
  },
  returned: { 
    color: 'text-gray-600 bg-gray-100', 
    icon: XCircle, 
    label: 'Returned',
    description: 'Your order has been returned'
  },
  refunded: { 
    color: 'text-gray-600 bg-gray-100', 
    icon: XCircle, 
    label: 'Refunded',
    description: 'Your order has been refunded'
  }
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [searchOrderNumber, setSearchOrderNumber] = useState('');

  const { data: orderData, isLoading, isError, error } = useQuery({
    queryKey: ['trackOrder', searchOrderNumber],
    queryFn: () => ordersAPI.trackOrder(searchOrderNumber),
    enabled: !!searchOrderNumber,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setSearchOrderNumber(orderNumber.trim());
    }
  };

  const order = orderData?.data;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600 text-lg mb-2">Enter your order number or order ID to track your package</p>
          <p className="text-sm text-gray-500">You can use either the order number (e.g., ORD-2025-6446) or the order ID</p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter order number (e.g., ORD-2024-001)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90 transition-colors"
            >
              Track
            </button>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for your order...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h3>
            <p className="text-gray-600 mb-4">
              {error?.response?.data?.message || 'Please check your order number and try again.'}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 bg-yellow text-black rounded-lg hover:bg-yellow/90 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="max-w-4xl mx-auto">
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
                  <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.orderStatus]?.color || 'text-gray-600 bg-gray-100'}`}>
                    {statusConfig[order.orderStatus]?.label || order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Current Status */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                {statusConfig[order.orderStatus]?.icon && (() => {
                  const IconComponent = statusConfig[order.orderStatus].icon;
                  return <IconComponent className="w-6 h-6 text-gray-600" />;
                })()}
                <div>
                  <p className="font-medium text-gray-900">
                    {statusConfig[order.orderStatus]?.label || order.orderStatus}
                  </p>
                  <p className="text-sm text-gray-600">
                    {statusConfig[order.orderStatus]?.description || 'Status update'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product?.mainImage || item.product?.images?.[0]?.url ? (
                          <Image
                            src={item.product.mainImage || item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Size: {item.size || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Color: {item.color || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₦{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">₦{(order.totalPrice - order.taxPrice - order.shippingPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="text-gray-900">₦{order.taxPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="text-gray-900">₦{order.shippingPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">₦{order.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info & Status History */}
              <div className="space-y-6">
                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{order.shippingInfo.fullName}</p>
                        <p className="text-sm text-gray-600">{order.shippingInfo.address}</p>
                        <p className="text-sm text-gray-600">
                          {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}
                        </p>
                        <p className="text-sm text-gray-600">{order.shippingInfo.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.shippingInfo.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
                  <div className="space-y-4">
                    {order.statusHistory?.map((status, index) => {
                      const config = statusConfig[status.status];
                      const Icon = config?.icon || Clock;
                      
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${config?.color || 'text-gray-600 bg-gray-100'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {config?.label || status.status}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(status.timestamp).toLocaleString()}
                            </p>
                            {status.note && (
                              <p className="text-sm text-gray-500 mt-1">{status.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tracking Info */}
                {(order.trackingNumber || order.estimatedDeliveryDate) && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h3>
                    <div className="space-y-3">
                      {order.trackingNumber && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tracking Number:</p>
                          <p className="text-gray-900 font-mono">{order.trackingNumber}</p>
                        </div>
                      )}
                      {order.estimatedDeliveryDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Estimated Delivery:</p>
                          <p className="text-gray-900">
                            {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90 transition-colors mr-4"
              >
                Continue Shopping
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
