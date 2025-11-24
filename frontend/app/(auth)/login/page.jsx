'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/ui/Button';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';

// Validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    await login(values, rememberMe);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center text-white hover:text-cream transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <div>
            <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
            <p className="text-xl text-cream opacity-90">
              Sign in to continue your fashion journey
            </p>
          </div>
          <div className="text-sm opacity-75">
            <p>© 2025 SEMILIA. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          {/* Mobile Back Button */}
          <Link
            href="/"
            className="lg:hidden flex items-center text-black hover:text-yellow mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-black mb-2">SEMILIA</h2>
            <p className="text-gray-700">Sign in to your account</p>
          </div>

          {/* Login Form */}
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
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address <span className="text-yellow">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full pl-11 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow transition-all ${
                        errors.email && touched.email
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-yellow'
                      }`}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Password <span className="text-yellow">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Field
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow transition-all ${
                        errors.password && touched.password
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-yellow'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-yellow focus:ring-yellow border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-black hover:text-yellow transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </Form>
            )}
          </Formik>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-700">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-black hover:text-yellow transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Guest Shopping */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Continue as Guest →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
