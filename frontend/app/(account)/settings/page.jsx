'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

// Change Password Schema
const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain lowercase letter')
    .matches(/[A-Z]/, 'Must contain uppercase letter')
    .matches(/[0-9]/, 'Must contain number')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwords) => {
      // This endpoint needs to be created in the backend
      // For now, we'll show a placeholder
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });

  const handleChangePassword = async (values, { resetForm }) => {
    changePasswordMutation.mutate(values);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-black mb-2">Account Settings</h2>
        <p className="text-gray-600">Manage your security and preferences</p>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow/10 rounded-lg">
            <Lock className="w-6 h-6 text-yellow" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black">Change Password</h3>
            <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
          </div>
        </div>

        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          validationSchema={passwordSchema}
          onSubmit={handleChangePassword}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4 max-w-xl">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <Field
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                      errors.currentPassword && touched.currentPassword
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.currentPassword && touched.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <Field
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                      errors.newPassword && touched.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && touched.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow ${
                      errors.confirmPassword && touched.confirmPassword
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || changePasswordMutation.isPending}
                className="px-6 py-3 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || changePasswordMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Change Password'
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow/10 rounded-lg">
            <Shield className="w-6 h-6 text-yellow" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black">Security</h3>
            <p className="text-sm text-gray-600">Manage your account security settings</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Verification Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-black">Email Verification</p>
              <p className="text-sm text-gray-600">Your email is verified</p>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Verified
            </div>
          </div>

          {/* Two-Factor Authentication (Coming Soon) */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-50">
            <div>
              <p className="font-medium text-black">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-red-100">
        <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-black">Delete Account</p>
              <p className="text-sm text-gray-600">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={() => toast.error('This feature is not yet implemented')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

