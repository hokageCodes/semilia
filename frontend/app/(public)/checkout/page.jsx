'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { ordersAPI } from '@/lib/api';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, CreditCard, Truck, ArrowLeft, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// Validation Schema
const checkoutSchema = Yup.object().shape({
  // Contact Information
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),

  // Shipping Address
  address: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postalCode: Yup.string(),
  country: Yup.string().required('Country is required'),

  // Payment - Only bank transfer for now
  paymentMethod: Yup.string()
    .oneOf(['transfer'], 'Invalid payment method')
    .required('Payment method is required'),

  // Bank transfer confirmation (required)
  transferConfirmed: Yup.boolean()
    .oneOf([true], 'Please confirm that you have made the transfer')
    .required('Please confirm the bank transfer'),

  // Optional
  notes: Yup.string(),
});

// Bank account details (you can move this to env or config)
const BANK_DETAILS = {
  accountName: 'SEMILIA FASHION',
  accountNumber: '1234567890',
  bankName: 'Access Bank',
  // Add more banks if needed
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart, getCartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: ordersAPI.createOrder,
    onSuccess: (data) => {
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
      setTimeout(() => {
        router.push(`/orders/${data.data.order._id}`);
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to place order');
    },
  });

  // Redirect if cart is empty
  if (cart.length === 0 && !orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-4">Your cart is empty</h1>
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

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleSubmit = async (values) => {
    // Validate cart has items
    if (!cart || cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // For bank transfer, require confirmation
    if (!values.transferConfirmed) {
      toast.error('Please confirm that you have made the bank transfer');
      return;
    }

    // Prepare order data to match backend expectations
    const orderItems = cart.map(item => {
      // Get product ID - handle both object and ID string
      const productId = typeof item.product === 'object' 
        ? item.product._id 
        : item.product;
      
      if (!productId) {
        console.error('❌ Missing product ID for item:', item);
        throw new Error('Invalid product in cart');
      }

      return {
        product: productId,
        qty: item.quantity || 1,
        price: typeof item.product === 'object' ? (item.product.price || 0) : 0,
        // Note: Backend will populate name and image from product
      };
    });

    const orderData = {
      orderItems,
      shippingInfo: {
        fullName: values.name,
        address: values.address,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode || '',
        country: values.country,
        phone: values.phone,
        email: values.email,
      },
      paymentMethod: 'Transfer',
      shippingPrice: shipping,
      taxPrice: 0,
      guestEmail: !isAuthenticated ? values.email : undefined,
    };

    console.log('📦 Order Data:', JSON.stringify(orderData, null, 2));
    console.log('📦 Order Items Count:', orderItems.length);
    
    // Create order with bank transfer
    createOrderMutation.mutate(orderData);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="container-custom py-12">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </Link>
            <h1 className="text-4xl font-bold text-black">Checkout</h1>
          </div>

          <Formik
            initialValues={{
              name: user?.name || '',
              email: user?.email || '',
              phone: user?.phone || '',
              address: user?.address?.street || '',
              city: user?.address?.city || '',
              state: user?.address?.state || '',
              postalCode: user?.address?.postalCode || '',
              country: user?.address?.country || 'Nigeria',
              paymentMethod: 'transfer',
              transferConfirmed: false,
              notes: '',
            }}
            validationSchema={checkoutSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Checkout Form */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <h2 className="text-2xl font-bold text-black mb-6">Contact Information</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <Field
                            name="name"
                            type="text"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                              errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="John Doe"
                          />
                          {errors.name && touched.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <Field
                              name="email"
                              type="email"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                                errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="john@example.com"
                              disabled={isAuthenticated}
                            />
                            {errors.email && touched.email && (
                              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <Field
                              name="phone"
                              type="tel"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                                errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="+234 XXX XXX XXXX"
                            />
                            {errors.phone && touched.phone && (
                              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                        <Truck className="w-6 h-6" />
                        Shipping Address
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address *
                          </label>
                          <Field
                            name="address"
                            type="text"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                              errors.address && touched.address ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="123 Main Street"
                          />
                          {errors.address && touched.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <Field
                              name="city"
                              type="text"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                                errors.city && touched.city ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Lagos"
                            />
                            {errors.city && touched.city && (
                              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State *
                            </label>
                            <Field
                              name="state"
                              type="text"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                                errors.state && touched.state ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Lagos"
                            />
                            {errors.state && touched.state && (
                              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Postal Code
                            </label>
                            <Field
                              name="postalCode"
                              type="text"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                              placeholder="100001"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country *
                            </label>
                            <Field
                              as="select"
                              name="country"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                                errors.country && touched.country ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="Nigeria">Nigeria</option>
                              <option value="Ghana">Ghana</option>
                              <option value="Kenya">Kenya</option>
                              <option value="South Africa">South Africa</option>
                              <option value="UK">United Kingdom</option>
                              <option value="USA">United States</option>
                            </Field>
                            {errors.country && touched.country && (
                              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method - Bank Transfer Only */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                        <CreditCard className="w-6 h-6" />
                        Payment Method
                      </h2>
                      
                      <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                        <p className="font-semibold text-black mb-2">Bank Transfer</p>
                        <p className="text-sm text-gray-600">Transfer to our bank account</p>
                      </div>

                      {/* Bank Transfer Details */}
                      <div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <h3 className="text-lg font-bold text-black mb-4">Bank Account Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <p className="text-xs text-gray-500">Account Name</p>
                              <p className="font-semibold text-black">{BANK_DETAILS.accountName}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(BANK_DETAILS.accountName, 'accountName')}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {copiedField === 'accountName' ? (
                                <Check className="w-5 h-5 text-green-600" />
                              ) : (
                                <Copy className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <p className="text-xs text-gray-500">Account Number</p>
                              <p className="font-semibold text-black font-mono">{BANK_DETAILS.accountNumber}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'accountNumber')}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {copiedField === 'accountNumber' ? (
                                <Check className="w-5 h-5 text-green-600" />
                              ) : (
                                <Copy className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <p className="text-xs text-gray-500">Bank Name</p>
                              <p className="font-semibold text-black">{BANK_DETAILS.bankName}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(BANK_DETAILS.bankName, 'bankName')}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {copiedField === 'bankName' ? (
                                <Check className="w-5 h-5 text-green-600" />
                              ) : (
                                <Copy className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                          </div>

                          <div className="mt-4 p-4 bg-yellow/10 border border-yellow rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Amount to Transfer:</strong> ₦{total.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              Please include your order number in the transfer description/narration.
                            </p>
                          </div>

                          <div className="mt-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                              <Field
                                type="checkbox"
                                name="transferConfirmed"
                                className="mt-1 w-5 h-5 accent-yellow"
                              />
                              <span className="text-sm text-gray-700">
                                I confirm that I have made the bank transfer of ₦{total.toLocaleString()} to the account details above.
                              </span>
                            </label>
                            {errors.transferConfirmed && touched.transferConfirmed && (
                              <p className="text-red-500 text-sm mt-1">{errors.transferConfirmed}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <h2 className="text-xl font-bold text-black mb-4">Order Notes (Optional)</h2>
                      <Field
                        as="textarea"
                        name="notes"
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                        placeholder="Any special instructions for your order..."
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
                      <h2 className="text-2xl font-bold text-black mb-6">Order Summary</h2>

                      {/* Cart Items */}
                      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                        {cart.map((item, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                              <Image
                                src={item.product.mainImage || item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm line-clamp-1">{item.product.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.selectedSize && `Size: ${item.selectedSize}`}
                                {item.selectedSize && item.selectedColor && ' • '}
                                {item.selectedColor && `Color: ${item.selectedColor}`}
                              </p>
                              <p className="text-sm font-semibold mt-1">
                                {item.quantity} × ₦{item.product.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 pt-4 space-y-3">
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

                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-3xl font-bold text-black">
                              ₦{total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || createOrderMutation.isPending}
                        className="w-full mt-6 py-4 bg-yellow text-black rounded-xl font-bold text-lg hover:bg-yellow/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting || createOrderMutation.isPending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            Place Order
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-500 text-center mt-4">
                        By placing your order, you agree to our terms and conditions
                      </p>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Footer />
    </>
  );
}

