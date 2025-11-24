'use client';

import { MapPin, Plus } from 'lucide-react';

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black mb-2">Saved Addresses</h2>
            <p className="text-gray-600">Manage your delivery addresses</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90 transition-all">
            <Plus className="w-5 h-5" />
            Add Address
          </button>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl p-12 shadow-md text-center">
        <MapPin className="w-20 h-20 mx-auto mb-4 text-gray-400" />
        <h3 className="text-2xl font-bold text-black mb-2">Address Management</h3>
        <p className="text-gray-600 mb-6">
          Save and manage multiple delivery addresses for faster checkout.
        </p>
        <div className="inline-block px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium">
          Coming Soon
        </div>
      </div>
    </div>
  );
}

