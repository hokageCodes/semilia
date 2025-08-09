'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import CartSidebar from '@/components/cart/CartSidebar';
import {
  Search, ShoppingBag, Menu, X,
  User, ChevronDown, Settings,
  Package, LogOut
} from 'lucide-react';

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
          w-full pl-11 pr-4 border border-black rounded-lg 
          bg-cream text-black placeholder-gray-600
          focus:ring-2 focus:ring-yellow focus:border-yellow 
          outline-none transition-all duration-200
          ${mobile ? 'py-3 text-base' : 'py-2.5 text-sm'}
        `}
      />
      <button
        onClick={handleSearch}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-black hover:text-white transition-colors"
      >
        <Search size={mobile ? 20 : 18} />
      </button>
    </div>
  );
};

const NavLinks = ({ mobile = false, onClose }) => {
  const links = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
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
            className="block px-2 py-3 text-lg font-medium text-black hover:bg-yellow hover:text-black rounded-lg transition-all duration-200"
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
          className="text-cream hover:text-yellow font-medium transition-colors duration-200 relative group"
        >
          {link.name}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow group-hover:w-full transition-all duration-300"></span>
        </Link>
      ))}
    </nav>
  );
};

const CartButton = ({ mobile = false, onCartClick }) => {
  const { cartCount, loading } = useCart();
  
  const handleClick = (e) => {
    e.preventDefault();
    if (onCartClick) {
      onCartClick();
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`relative p-2 ${mobile ? 'text-black' : 'text-cream hover:text-yellow'} transition-all duration-200 ${loading ? 'opacity-50' : 'hover:opacity-80'}`}
        disabled={loading}
      >
        <ShoppingBag size={mobile ? 24 : 22} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-medium px-1">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>
    </div>
  );
};

const AuthButtons = ({ mobile = false, onClose }) => (
  <div className={mobile ? "space-y-3" : "flex items-center space-x-3"}>
    <Link
      href="/login"
      onClick={mobile ? onClose : undefined}
      className={`
        font-medium text-center transition-all duration-200
        ${mobile
        ? 'block w-full px-2 py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white'
        : 'text-cream hover:text-yellow'}
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
        ? 'block w-full px-2 py-3 bg-black text-white rounded-lg hover:bg-yellow hover:text-black'
        : 'bg-yellow text-black px-2 py-2 rounded-lg hover:bg-black hover:text-cream'}
      `}
    >
      Sign Up
    </Link>
  </div>
);

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
        <div className="p-4 bg-cream rounded-lg text-black">
          <p className="font-semibold text-lg">{user.name}</p>
          <p className="text-sm">{user.email}</p>
        </div>
        <nav className="space-y-1">
          {[
            ['Profile', '/profile', User],
            ['My Orders', '/orders', Package],
            ['Settings', '/settings', Settings]
          ].map(([label, href, Icon]) => (
            <Link key={label} href={href} onClick={onClose}
              className="block px-2 py-3 text-black hover:bg-yellow rounded-lg transition-colors">
              <Icon size={18} className="inline mr-3" />
              {label}
            </Link>
          ))}
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
        className="flex items-center space-x-2 text-cream hover:text-yellow transition-colors"
      >
        <div className="w-8 h-8 bg-cream rounded-full flex items-center justify-center">
          <User size={16} className="text-black" />
        </div>
        <span className="hidden lg:block font-medium">{user.name.split(' ')[0]}</span>
        <ChevronDown size={16} className={`hidden lg:block transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4 bg-cream border-b">
            <p className="font-semibold text-black">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <div className="py-2">
            {[
              ['Profile', '/profile', User],
              ['My Orders', '/orders', Package],
              ['Settings', '/settings', Settings]
            ].map(([label, href, Icon]) => (
              <Link key={label} href={href}
                className="flex items-center px-4 py-3 text-black hover:bg-yellow transition-colors">
                <Icon size={18} className="mr-3" />
                {label}
              </Link>
            ))}
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

const MobileMenu = ({ isOpen, onClose, user, logout, router, onCartClick }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => document.body.style.overflow = 'unset';
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`
        fixed top-0 left-0 right-0 bg-cream z-50 transition-transform duration-300 lg:hidden
        ${isOpen ? 'translate-y-0' : '-translate-y-full'}
        max-h-screen overflow-y-auto
      `}>
        <div className="flex justify-end px-4 py-2 border-b bg-cream sticky top-0">
          <button onClick={onClose} className="p-2 hover:bg-yellow rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <SearchBar mobile />
          <div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wide mb-3">Navigation</h3>
            <NavLinks mobile onClose={onClose} />
          </div>
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-black uppercase tracking-wide">Account</h3>
              <CartButton mobile onCartClick={() => {
                onClose();
                onCartClick();
              }} />
            </div>
            {user
              ? <ProfileDropdown user={user} logout={logout} router={router} mobile onClose={onClose} />
              : <AuthButtons mobile onClose={onClose} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      <nav className="bg-black text-cream sticky top-0 z-30 shadow-lg border-b border-yellow">
        <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-4">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="hidden lg:flex items-center justify-between w-full">
              <div className="flex items-center space-x-8">
                <Logo />
                <SearchBar />
              </div>
              <NavLinks />
              <div className="flex items-center space-x-4">
                <CartButton onCartClick={handleCartToggle} />
                {user
                  ? <ProfileDropdown user={user} logout={logout} router={router} />
                  : <AuthButtons />}
              </div>
            </div>

            <div className="flex lg:hidden items-center justify-between w-full px-2 py-2">
              <Logo mobile />
              <div className="flex items-center space-x-3">
                <CartButton mobile onCartClick={handleCartToggle} />
                <button
                  onClick={() => setIsMobileOpen(true)}
                  className="text-white p-2 hover:bg-yellow rounded-lg transition-colors"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        user={user}
        logout={logout}
        router={router}
        onCartClick={handleCartToggle}
      />

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}