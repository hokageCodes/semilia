'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';

// Validation schema
const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  phone: Yup.string()
    .matches(/^[0-9+\s-()]*$/, 'Invalid phone number')
    .optional(),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

export default function RegisterPage() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    const { confirmPassword, agreeToTerms, ...registerData } = values;
    await register(registerData);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80"
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
            <h1 className="text-5xl font-bold mb-4">Join SEMILIA</h1>
            <p className="text-xl text-cream opacity-90">
              Create an account and discover your style
            </p>
          </div>
          <div className="text-sm opacity-75">
            <p>© 2025 SEMILIA. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream overflow-y-auto">
        <div className="w-full max-w-md py-8">
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
            <p className="text-gray-700">Create your account</p>
          </div>

          {/* Register Form */}
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              phone: '',
              agreeToTerms: false,
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name <span className="text-yellow">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Field
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      className={`w-full pl-11 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow transition-all ${
                        errors.name && touched.name
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-yellow'
                      }`}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

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

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Field
                      name="phone"
                      type="tel"
                      placeholder="+234 800 000 0000"
                      className={`w-full pl-11 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow transition-all ${
                        errors.phone && touched.phone
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-yellow'
                      }`}
                    />
                  </div>
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Confirm Password <span className="text-yellow">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Field
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow transition-all ${
                        errors.confirmPassword && touched.confirmPassword
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-yellow'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start">
                  <Field
                    name="agreeToTerms"
                    type="checkbox"
                    className="h-4 w-4 text-yellow focus:ring-yellow border-gray-300 rounded mt-1 cursor-pointer"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-black hover:text-yellow underline">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-black hover:text-yellow underline">
                      Privacy Policy
                    </Link>
                    <span className="text-yellow ml-1">*</span>
                  </label>
                </div>
                {errors.agreeToTerms && touched.agreeToTerms && (
                  <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </button>
              </Form>
            )}
          </Formik>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-black hover:text-yellow transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Guest Shopping */}
          <div className="mt-4 text-center">
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
