'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Edit2, Save, X, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

// Validation Schema
const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string(),
  address: Yup.object().shape({
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
    postalCode: Yup.string(),
  }),
});

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: (data) => {
      updateUser(data.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSubmit = async (values) => {
    updateProfileMutation.mutate(values);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Profile Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90 transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        <Formik
          initialValues={{
            name: user?.name || '',
            phone: user?.phone || '',
            address: {
              street: user?.address?.street || '',
              city: user?.address?.city || '',
              state: user?.address?.state || '',
              country: user?.address?.country || '',
              postalCode: user?.address?.postalCode || '',
            },
          }}
          validationSchema={profileSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting, resetForm }) => (
            <Form>
              {isEditing ? (
                // Edit Mode
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
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
                      />
                      {errors.name && touched.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Field
                        name="phone"
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="font-semibold text-black mb-3">Address</h3>
                    <div className="space-y-4">
                      <Field
                        name="address.street"
                        type="text"
                        placeholder="Street Address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <Field
                          name="address.city"
                          type="text"
                          placeholder="City"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                        />
                        <Field
                          name="address.state"
                          type="text"
                          placeholder="State"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Field
                          name="address.country"
                          type="text"
                          placeholder="Country"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                        />
                        <Field
                          name="address.postalCode"
                          type="text"
                          placeholder="Postal Code"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting || updateProfileMutation.isPending}
                      className="flex items-center gap-2 px-6 py-3 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90 transition-all disabled:opacity-50"
                    >
                      {isSubmitting || updateProfileMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setIsEditing(false);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow/10 rounded-lg">
                        <User className="w-5 h-5 text-yellow" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-semibold text-black">{user?.name || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow/10 rounded-lg">
                        <Mail className="w-5 h-5 text-yellow" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-semibold text-black break-all">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow/10 rounded-lg">
                        <Phone className="w-5 h-5 text-yellow" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-semibold text-black">{user?.phone || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-yellow" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-semibold text-black">{formatDate(user?.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  {(user?.address?.street || user?.address?.city) && (
                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow/10 rounded-lg">
                          <MapPin className="w-5 h-5 text-yellow" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Address</p>
                          <div className="font-semibold text-black space-y-1">
                            {user.address.street && <p>{user.address.street}</p>}
                            {(user.address.city || user.address.state) && (
                              <p>
                                {user.address.city}
                                {user.address.city && user.address.state && ', '}
                                {user.address.state} {user.address.postalCode}
                              </p>
                            )}
                            {user.address.country && <p>{user.address.country}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>

      {/* Account Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-yellow" />
            <div>
              <p className="text-3xl font-bold text-black">{user?.totalOrders || 0}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">💰</div>
            <div>
              <p className="text-3xl font-bold text-black">
                ₦{(user?.totalSpent || 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">❤️</div>
            <div>
              <p className="text-3xl font-bold text-black">0</p>
              <p className="text-sm text-gray-600">Wishlist Items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

