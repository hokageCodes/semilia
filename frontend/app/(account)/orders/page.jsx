'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
  // Fetch user orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: ordersAPI.getMyOrders,
  });

  const orders = ordersData?.data?.orders || [];

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-yellow border-t-transparent rounded-full" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-md text-center">
        <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold text-black mb-2">No Orders Yet</h2>
        <p className="text-gray-600 mb-6">
          You haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90 transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-black mb-2">Order History</h2>
        <p className="text-gray-600">View and track your orders</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/orders/${order._id}`}
            className="block bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-gray-400" />
                  <p className="font-mono text-sm text-gray-600">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus?.toUpperCase()}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow transition-colors" />
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
              {order.items?.slice(0, 4).map((item, index) => (
                <div key={index} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.product?.mainImage || item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'}
                    alt={item.product?.name || 'Product'}
                    fill
                    className="object-cover"
                  />
                  {item.quantity > 1 && (
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      ×{item.quantity}
                    </div>
                  )}
                </div>
              ))}
              {order.items?.length > 4 && (
                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm font-semibold">
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">
                  {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-black">
                  ₦{(order.totalPrice + (order.shippingPrice || 0)).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {order.paymentMethod} • {order.paymentStatus}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

