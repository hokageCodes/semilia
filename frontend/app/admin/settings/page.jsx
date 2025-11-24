'use client';

import { useState } from 'react';
import { Settings, Store, Bell, Shield, Palette, Check } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const storeInfoSchema = Yup.object().shape({
  storeName: Yup.string().required('Store name is required'),
  storeEmail: Yup.string().email('Invalid email').required('Email is required'),
  storePhone: Yup.string().required('Phone is required'),
  storeAddress: Yup.string().required('Address is required'),
});

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('store');

  const handleStoreInfoSubmit = async (values, { setSubmitting }) => {
    try {
      // In a real app, this would call an API
      console.log('Store info:', values);
      toast.success('Store information updated successfully!');
    } catch (error) {
      toast.error('Failed to update store information');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotificationChange = (type, value) => {
    console.log(`${type}: ${value}`);
    toast.success('Notification settings updated!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your store settings and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Store Information */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow/10 rounded-lg">
              <Store className="w-6 h-6 text-yellow" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Store Information</h3>
          </div>
          
          <Formik
            initialValues={{
              storeName: 'SEMILIA',
              storeEmail: 'hello@semilia.com',
              storePhone: '+234 123 456 7890',
              storeAddress: '123 Fashion Street, Lagos, Nigeria',
              storeDescription: 'Premium fashion and style for everyone',
            }}
            validationSchema={storeInfoSchema}
            onSubmit={handleStoreInfoSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name
                  </label>
                  <Field
                    name="storeName"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Email
                  </label>
                  <Field
                    name="storeEmail"
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Phone
                  </label>
                  <Field
                    name="storePhone"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Address
                  </label>
                  <Field
                    name="storeAddress"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Description
                  </label>
                  <Field
                    name="storeDescription"
                    as="textarea"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-yellow text-black rounded-lg font-semibold hover:bg-yellow/90 transition-all"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow/10 rounded-lg">
              <Bell className="w-6 h-6 text-yellow" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Notification Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Order Notifications</h4>
                <p className="text-sm text-gray-600">Get notified when new orders are placed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={(e) => handleNotificationChange('orders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Low Stock Alerts</h4>
                <p className="text-sm text-gray-600">Receive alerts when products are running low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={(e) => handleNotificationChange('lowStock', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">New User Signups</h4>
                <p className="text-sm text-gray-600">Get notified when new users register</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => handleNotificationChange('signups', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow/10 rounded-lg">
              <Shield className="w-6 h-6 text-yellow" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Security Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600 mb-3">
                Add an extra layer of security to your account
              </p>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Enable 2FA
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Change Password</h4>
              <p className="text-sm text-gray-600 mb-3">
                Update your account password regularly
              </p>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Change Password
              </button>
            </div>

            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
              <p className="text-sm text-red-700 mb-3">
                Permanently delete your store account and all data
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow/10 rounded-lg">
              <Palette className="w-6 h-6 text-yellow" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme Color
              </label>
              <div className="flex gap-3">
                <button className="w-12 h-12 bg-yellow rounded-lg border-2 border-black"></button>
                <button className="w-12 h-12 bg-blue-500 rounded-lg border-2 border-transparent"></button>
                <button className="w-12 h-12 bg-purple-500 rounded-lg border-2 border-transparent"></button>
                <button className="w-12 h-12 bg-pink-500 rounded-lg border-2 border-transparent"></button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Dark Mode</h4>
                <p className="text-sm text-gray-600">Toggle dark mode for better viewing</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

