'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react';

export default function AccountLayout({ children }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=' + pathname);
    }
  }, [loading, isAuthenticated, router, pathname]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-yellow border-t-transparent rounded-full" />
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    { name: 'Profile', href: '/account/profile', icon: User },
    { name: 'Orders', href: '/account/orders', icon: Package },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Settings', href: '/account/settings', icon: Settings },
  ];

  const isActive = (href) => pathname === href;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream">
        <div className="container-custom py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">My Account</h1>
            <p className="text-gray-600">Manage your account and view your orders</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
                {/* User Info */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200 mb-6">
                  <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center text-black font-bold text-2xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-black truncate">{user?.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive(item.href)
                            ? 'bg-yellow text-black font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

