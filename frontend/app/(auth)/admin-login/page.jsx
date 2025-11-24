'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';

// Validation Schema
const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get('redirect') || '/admin/dashboard';

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      console.log('Attempting admin login with:', values);
      const result = await login(values);
      console.log('Login result:', result);
      
      if (result.success) {
        // Check if user is admin after successful login
        // The user will be available in the AuthContext after login
        setTimeout(() => {
          if (user?.role === 'admin') {
            router.push(redirect);
          } else {
            setFieldError('email', 'Admin access required. You need administrator privileges to access this panel.');
          }
        }, 100);
      } else {
        setFieldError('email', result.error || result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message || 'An error occurred. Please try again.';
      setFieldError('email', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
          alt="Admin Panel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <Shield className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">SEMILIA Admin</h1>
            <p className="text-xl">Manage your fashion empire</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <span className="text-yellow text-2xl font-bold">S</span>
              </div>
              <span className="text-3xl font-bold text-black">SEMILIA</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow/10 rounded-lg">
                <Shield className="w-6 h-6 text-yellow" />
              </div>
              <h2 className="text-3xl font-bold text-black">Admin Login</h2>
            </div>
            <p className="text-gray-600">Sign in to access the admin panel</p>
          </div>

          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field
                      name="email"
                      type="email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                        errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="admin@semilia.com"
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                        errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Sign In to Admin Panel
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>

          {/* Back to Store */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-gray-600 hover:text-yellow transition-colors text-sm"
            >
              ← Back to Store
            </Link>
          </div>

          {/* Admin Note */}
          <div className="mt-8 p-4 bg-yellow/10 border border-yellow/20 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Admin Access Only:</strong> This login is restricted to administrators only. 
              If you're a customer, please use the <Link href="/login" className="text-yellow hover:underline">regular login</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

