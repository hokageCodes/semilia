'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '@/lib/api';
import { ShoppingCart, User, Menu, X, LogOut, Package, Settings, ChevronDown, Search, Grid3x3, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ClientOnly from '@/components/ClientOnly';

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { getCartCount } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const shopDropdownRef = useRef(null);

  // Fetch categories for shop dropdown
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setShopDropdownOpen(false);
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target)) {
        setShopDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-black shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="container-custom max-w-full">
        <div className="flex items-center justify-between h-20 md:h-24 relative w-full">
          {/* Left - Navigation Links (Desktop Only) */}
          <div className="hidden lg:flex items-center space-x-6 flex-1">
            {/* Shop Dropdown */}
            <div className="relative" ref={shopDropdownRef}>
              <button
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-white hover:text-yellow transition-colors"
                aria-expanded={shopDropdownOpen}
                aria-haspopup="true"
              >
                Shop
                <ChevronDown className={`w-4 h-4 transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {shopDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9999]">
                  {/* Quick Links Header */}
                  <div className="bg-gradient-to-r from-black to-gray-900 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-lg">Shop</h3>
                      <Link
                        href="/shop"
                        className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
                        onClick={() => setShopDropdownOpen(false)}
                      >
                        View All
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Categories Grid */}
                  <div className="p-6">
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin w-6 h-6 border-2 border-yellow border-t-transparent rounded-full" />
                      </div>
                    ) : categoriesError ? (
                      <div className="text-center py-12 text-red-500 text-sm">Failed to load categories</div>
                    ) : !categories || categories.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 text-sm">No categories available</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {categories.map((category) => (
                          <div key={category._id} className="group p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                            <div className="flex items-start justify-between mb-2">
                              <Link
                                href={`/categories/${category.main.toLowerCase()}`}
                                className="font-bold text-gray-900 text-base group-hover:text-gray-700 transition-colors"
                                onClick={() => setShopDropdownOpen(false)}
                              >
                                {category.main}
                              </Link>
                              <Link
                                href={`/categories/${category.main.toLowerCase()}`}
                                onClick={() => setShopDropdownOpen(false)}
                              >
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                              </Link>
                            </div>
                            {category.subcategories && category.subcategories.length > 0 ? (
                              <div className="space-y-1 mt-3">
                                {category.subcategories.slice(0, 3).map((sub, index) => (
                                  <Link
                                    key={index}
                                    href={`/categories/${category.main.toLowerCase()}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="block text-xs text-gray-600 hover:text-gray-900 py-1 transition-colors"
                                    onClick={() => setShopDropdownOpen(false)}
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                                {category.subcategories.length > 3 && (
                                  <div className="text-xs text-gray-400 pt-1">
                                    +{category.subcategories.length - 3} more
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 mt-2">No subcategories</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Link */}
                  <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                    <Link
                      href="/categories"
                      className="flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                      onClick={() => setShopDropdownOpen(false)}
                    >
                      <Grid3x3 className="w-4 h-4" />
                      Browse All Categories
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="text-sm font-medium text-white hover:text-yellow transition-colors">
              About
            </Link>
            <Link href="/track-order" className="text-sm font-medium text-white hover:text-yellow transition-colors">
              Track Order
            </Link>
            <Link href="/contact" className="text-sm font-medium text-white hover:text-yellow transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-yellow transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-10 overflow-visible">
            <Link href="/" className="block">
              <Image 
                src="/assets/semilia-logo-nobg.png" 
                alt="SEMILIA - Fashion Store" 
                width={180} 
                height={180} 
                className="h-24 md:h-32 w-auto hover:opacity-80 transition-opacity object-contain max-w-[180px]"
                priority
                quality={90}
                sizes="(max-width: 768px) 96px, 128px"
              />
            </Link>
          </div>

          {/* Right - Search, Cart & Auth */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white hover:text-yellow transition-colors"
              title="Search"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-white hover:text-yellow transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              <ClientOnly>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getCartCount()}
                  </span>
                )}
              </ClientOnly>
            </Link>

            {loading ? (
              <div className="hidden lg:block w-32 h-10 bg-gray-700 animate-pulse rounded-lg"></div>
            ) : isAuthenticated ? (
              <div className="hidden lg:block relative z-[60]" ref={dropdownRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-yellow text-black rounded-full flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg py-2 border border-gray-200 z-[9999]">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5 break-all">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-cream transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3 text-yellow" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/account/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-cream transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        My Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-cream transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4 mr-3" />
                        My Orders
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-white hover:text-yellow transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-yellow text-black rounded-lg hover:bg-yellow/90 text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800 z-[999] relative">
            {/* User Info (Mobile) */}
            {isAuthenticated && user && (
              <div className="px-4 py-3 bg-gray-800 rounded-lg mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow text-black rounded-full flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate break-all">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1 mb-4">
              {/* Shop Dropdown (Mobile) */}
              <div>
                <button
                  onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 hover:text-yellow rounded-lg transition-colors"
                >
                  Shop
                  <ChevronDown className={`w-4 h-4 transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {shopDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-1 max-h-64 overflow-y-auto scrollbar-hide z-[9999] relative">
                    <Link
                      href="/shop"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow rounded-lg transition-colors border-b border-gray-700"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShopDropdownOpen(false);
                      }}
                    >
                      All Products
                    </Link>
                    <Link
                      href="/categories"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow rounded-lg transition-colors border-b border-gray-700"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShopDropdownOpen(false);
                      }}
                    >
                      All Categories
                    </Link>
                    <div className="px-4 py-1 text-gray-400 text-xs font-semibold uppercase tracking-wide">
                      Shop by Category
                    </div>
                    {categoriesLoading ? (
                      <div className="px-4 py-2 text-gray-400 text-sm">Loading categories...</div>
                    ) : categoriesError ? (
                      <div className="px-4 py-2 text-red-400 text-sm">Failed to load categories</div>
                    ) : !categories || categories.length === 0 ? (
                      <div className="px-4 py-2 text-gray-400 text-sm">No categories available</div>
                    ) : (
                      categories.slice(0, 3).map((category) => (
                        <div key={category._id} className="border-b border-gray-700 pt-2 mt-2 last:border-b-0">
                          <Link
                            href={`/categories/${category.main.toLowerCase()}`}
                            className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow rounded-lg transition-colors font-medium"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setShopDropdownOpen(false);
                            }}
                          >
                            {category.main}
                          </Link>
                          {category.subcategories && category.subcategories.length > 0 ? (
                            <>
                              {category.subcategories.slice(0, 2).map((sub, index) => (
                                <Link
                                  key={index}
                                  href={`/categories/${category.main.toLowerCase()}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="block px-6 py-1 text-xs text-gray-400 hover:text-yellow rounded-lg transition-colors"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setShopDropdownOpen(false);
                                  }}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                              {category.subcategories.length > 2 && (
                                <div className="px-6 py-1 text-xs text-gray-500">
                                  +{category.subcategories.length - 2} more
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="px-6 py-1 text-xs text-gray-500">No subcategories</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Other Links */}
              <Link
                href="/about"
                className="block px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 hover:text-yellow rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/track-order"
                className="block px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 hover:text-yellow rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Track Order
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 hover:text-yellow rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            {/* Auth Links Mobile */}
            {!isAuthenticated && (
              <div className="px-4 flex flex-col space-y-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-white hover:text-yellow transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-yellow text-black rounded-lg hover:bg-yellow/90 text-sm font-medium transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
