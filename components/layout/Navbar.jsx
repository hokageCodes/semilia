'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Search, ShoppingBag, Menu, X,
  User, ChevronDown, Settings,
  Package, LogOut
} from 'lucide-react';

// Logo Component - Consistent sizing
const Logo = ({ mobile = false }) => (
  <Link href="/" className="flex items-center flex-shrink-0">
    <div className={`relative ${mobile ? 'w-32 h-32' : 'w-36 h-32 lg:w-36 lg:h-48'}`}>
      <Image
        src="/semilia-logo-nobg.png"
        alt="Semilia Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  </Link>
);

// Unified Search Component
const SearchBar = ({ mobile = false }) => {
  const [query, setQuery] = useState('');
  const handleSearch = () => console.log('Searching:', query);
  
  return (
    <div className={`relative ${mobile ? 'w-full' : 'w-full max-w-md'}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={mobile ? "Search..." : "Search products..."}
        className={`
          w-full pl-11 pr-4 border border-gray-300 rounded-lg 
          bg-white text-gray-900 placeholder-gray-500
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          outline-none transition-all duration-200
          ${mobile ? 'py-3 text-base' : 'py-2.5 text-sm'}
        `}
      />
      <button
        onClick={handleSearch}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Search size={mobile ? 20 : 18} />
      </button>
    </div>
  );
};

// Navigation Links
const NavLinks = ({ mobile = false, onClose }) => {
  const links = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  if (mobile) {
    return (
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={onClose}
            className="block px-2 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-all duration-200"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-white hover:text-blue-200 font-medium transition-colors duration-200 relative group"
        >
          {link.name}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-200 group-hover:w-full transition-all duration-300"></span>
        </Link>
      ))}
    </nav>
  );
};

const CartButton = ({ mobile = false }) => (
  <button
    className={`
      relative p-2 
      ${mobile ? 'text-black' : 'text-white'} 
      hover:opacity-80 transition-opacity
    `}
  >
    <ShoppingBag 
      size={mobile ? 24 : 22} 
      className={mobile ? 'text-white' : 'text-black'} 
    />
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
      0
    </span>
  </button>
);

// Auth Buttons
const AuthButtons = ({ mobile = false, onClose }) => (
  <div className={mobile ? "space-y-3" : "flex items-center space-x-3"}>
    <Link 
      href="/login" 
      onClick={mobile ? onClose : undefined}
      className={`
        font-medium text-center transition-all duration-200
        ${mobile 
          ? 'block w-full px-2 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white' 
          : 'text-white hover:text-blue-200'
        }
      `}
    >
      Login
    </Link>
    <Link 
      href="/register" 
      onClick={mobile ? onClose : undefined}
      className={`
        font-medium text-center transition-all duration-200
        ${mobile 
          ? 'block w-full px-2 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800' 
          : 'bg-white text-gray-900 px-2 py-2 rounded-lg hover:bg-gray-100'
        }
      `}
    >
      Sign Up
    </Link>
  </div>
);

// Profile Dropdown
const ProfileDropdown = ({ user, logout, router, mobile = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (mobile) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold text-gray-900 text-lg">{user.name}</p>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>
        <nav className="space-y-1">
          <Link href="/profile" onClick={onClose} className="block px-2 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <User size={18} className="inline mr-3" />
            Profile
          </Link>
          <Link href="/orders" onClick={onClose} className="block px-2 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Package size={18} className="inline mr-3" />
            My Orders
          </Link>
          <Link href="/settings" onClick={onClose} className="block px-2 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={18} className="inline mr-3" />
            Settings
          </Link>
          <button 
            onClick={handleLogout} 
            className="block w-full text-left px-2 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} className="inline mr-3" />
            Logout
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <User size={16} className="text-gray-900" />
        </div>
        <span className="hidden lg:block font-medium">{user.name.split(' ')[0]}</span>
        <ChevronDown size={16} className={`hidden lg:block transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <div className="py-2">
            <Link href="/profile" className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-100 transition-colors">
              <User size={18} className="mr-3" />
              Profile
            </Link>
            <Link href="/orders" className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-100 transition-colors">
              <Package size={18} className="mr-3" />
              My Orders
            </Link>
            <Link href="/settings" className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-100 transition-colors">
              <Settings size={18} className="mr-3" />
              Settings
            </Link>
            <button 
              onClick={handleLogout} 
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile Menu
const MobileMenu = ({ isOpen, onClose, user, logout, router }) => {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className={`
        fixed top-0 left-0 right-0 bg-white z-50 transition-transform duration-300 lg:hidden
        ${isOpen ? 'translate-y-0' : '-translate-y-full'}
        max-h-screen overflow-y-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0">
          <Logo mobile />
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Search */}
          <SearchBar mobile />
          
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Navigation</h3>
            <NavLinks mobile onClose={onClose} />
          </div>
          
          {/* User Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Account</h3>
              <CartButton mobile/>
            </div>
            
            {user ? (
              <ProfileDropdown user={user} logout={logout} router={router} mobile onClose={onClose} />
            ) : (
              <AuthButtons mobile onClose={onClose} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Main Navbar Component
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-900 text-white sticky top-0 z-30 shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-4">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between w-full">
              <div className="flex items-center space-x-8">
                <Logo />
                <SearchBar />
              </div>
              
              <NavLinks />
              
              <div className="text-black flex items-center space-x-4">
                <CartButton />
                {user ? (
                  <ProfileDropdown user={user} logout={logout} router={router} />
                ) : (
                  <AuthButtons />
                )}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex lg:hidden items-center justify-between w-full">
              <Logo mobile />
              
              <div className="flex items-center space-x-3">
                <CartButton mobile />
                <button 
                  onClick={() => setIsMobileOpen(true)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        user={user}
        logout={logout}
        router={router}
      />
    </>
  );
}