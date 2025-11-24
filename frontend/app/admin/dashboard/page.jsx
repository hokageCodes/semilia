'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  // Fetch dashboard stats
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminAPI.getStats,
  });

  const overview = statsData?.data?.overview || {};
  const recentOrders = statsData?.data?.recentOrders || [];
  const lowStockProducts = statsData?.data?.lowStockProducts || [];

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₦${(overview.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: `${overview.paidOrders || 0} paid`,
    },
    {
      title: 'Total Orders',
      value: overview.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      change: `${overview.deliveredOrders || 0} delivered`,
    },
    {
      title: 'Total Products',
      value: overview.totalProducts || 0,
      icon: Package,
      color: 'bg-purple-500',
      change: `${lowStockProducts.length} low stock`,
    },
    {
      title: 'Total Users',
      value: overview.totalUsers || 0,
      icon: Users,
      color: 'bg-yellow',
      change: `${overview.activeUsers || 0} active`,
    },
  ];

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-yellow border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, here's what's happening today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.color} rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 text-yellow hover:text-yellow/80 font-medium transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.user?.name || order.guestEmail || 'Guest'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₦{(order.totalPrice + (order.shippingPrice || 0)).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/admin/orders`}
                        className="text-yellow hover:text-yellow/80 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all group"
        >
          <Package className="w-12 h-12 text-yellow mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Products</h3>
          <p className="text-gray-600 text-sm mb-4">
            Add, edit, or remove products from your store
          </p>
          <div className="flex items-center gap-2 text-yellow font-medium group-hover:gap-3 transition-all">
            Go to Products
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all group"
        >
          <ShoppingCart className="w-12 h-12 text-yellow mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Orders</h3>
          <p className="text-gray-600 text-sm mb-4">
            View and update order status, track shipments
          </p>
          <div className="flex items-center gap-2 text-yellow font-medium group-hover:gap-3 transition-all">
            Go to Orders
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all group"
        >
          <Users className="w-12 h-12 text-yellow mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Users</h3>
          <p className="text-gray-600 text-sm mb-4">
            View and manage customer accounts
          </p>
          <div className="flex items-center gap-2 text-yellow font-medium group-hover:gap-3 transition-all">
            Go to Users
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}

