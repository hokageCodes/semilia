'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowLeft,
  DollarSign,
  Calendar,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch order details
  const { data: orderData, isLoading } = useQuery({
    queryKey: ['admin-order', params.id],
    queryFn: () => adminAPI.getOrder(params.id),
  });

  // Confirm payment mutation
  const confirmPaymentMutation = useMutation({
    mutationFn: () => adminAPI.confirmPayment(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-order', params.id]);
      queryClient.invalidateQueries(['admin-orders']);
      toast.success('Payment confirmed successfully! Customer will receive confirmation email.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to confirm payment');
    },
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (newStatus) => adminAPI.updateOrderStatus(params.id, { orderStatus: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-order', params.id]);
      queryClient.invalidateQueries(['admin-orders']);
      toast.success('Order status updated!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    },
  });

  const order = orderData?.data?.order;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-yellow border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Order Not Found</h1>
          <Link
            href="/admin/orders"
            className="inline-block px-6 py-3 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-blue-100 text-blue-800',
      quality_check: 'bg-purple-100 text-purple-800',
      packaging: 'bg-indigo-100 text-indigo-800',
      ready_to_ship: 'bg-cyan-100 text-cyan-800',
      shipped: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-orange-100 text-orange-800',
      out_for_delivery: 'bg-pink-100 text-pink-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleConfirmPayment = () => {
    if (window.confirm('Are you sure you want to confirm payment for this order? This will send a confirmation email to the customer.')) {
      confirmPaymentMutation.mutate();
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (window.confirm(`Change order status to "${newStatus}"?`)) {
      updateStatusMutation.mutate(newStatus);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus?.toUpperCase().replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Information
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold capitalize">{order.paymentMethod}</p>
                  </div>
                  {order.isPaid && order.paidAt && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Paid At</p>
                        <p className="font-semibold">
                          {new Date(order.paidAt).toLocaleDateString()} {new Date(order.paidAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {order.paymentResult?.confirmedBy && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Confirmed By</p>
                          <p className="font-semibold">{order.paymentResult.confirmedBy}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Confirm Payment Button */}
                {order.paymentStatus !== 'completed' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleConfirmPayment}
                      disabled={confirmPaymentMutation.isPending}
                      className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {confirmPaymentMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-5 h-5" />
                          Confirm Payment
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      This will mark the payment as confirmed and send a confirmation email to the customer.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Status Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Order Status
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Order Status
                  </label>
                  <select
                    value={order.orderStatus || 'pending'}
                    onChange={handleStatusChange}
                    disabled={updateStatusMutation.isPending}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="quality_check">Quality Check</option>
                    <option value="packaging">Packaging</option>
                    <option value="ready_to_ship">Ready to Ship</option>
                    <option value="shipped">Shipped</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-black mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-black mb-1">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-600">
                          <p>Quantity: {item.qty}</p>
                          <p>Price: ₦{item.price?.toLocaleString()} each</p>
                        </div>
                        <p className="text-lg font-bold text-black">
                          ₦{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
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
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold text-black">{order.shippingInfo?.fullName}</p>
                <p>{order.shippingInfo?.address}</p>
                <p>
                  {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.postalCode}
                </p>
                <p>{order.shippingInfo?.country}</p>
                {order.shippingInfo?.phone && (
                  <p className="flex items-center gap-2 mt-3">
                    <Phone className="w-4 h-4" />
                    {order.shippingInfo.phone}
                  </p>
                )}
                {order.shippingInfo?.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {order.shippingInfo.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₦{order.totalPrice?.toLocaleString()}</span>
                </div>
                {order.shippingPrice > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">₦{order.shippingPrice?.toLocaleString()}</span>
                  </div>
                )}
                {order.taxPrice > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-semibold">₦{order.taxPrice?.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-black">
                      ₦{((order.totalPrice || 0) + (order.shippingPrice || 0) + (order.taxPrice || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                {order.user ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Registered User</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Guest Order</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

