'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaArrowUp,
} from 'react-icons/fa';

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-cream pt-16 pb-10 relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand/About */}
        <div className="space-y-5">
          <h3 className="text-xl font-semibold">Semilia</h3>
          <p className="text-sm text-cream/80">By Tailor Girl Fashion</p>
          <div className="flex gap-3 flex-wrap">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-yellow transition grid place-items-center"
                aria-label="Social"
              >
                <Icon className="text-cream text-sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-base font-semibold mb-4">Navigation</h3>
          <ul className="grid grid-cols-2 gap-y-2 text-sm text-cream/80">
            {[
              ['Home', '/'],
              ['Products', '/products'],
              ['New Arrivals', '/new-arrivals'],
              ['Best Sellers', '/best-sellers'],
              ['Sale', '/sale'],
            ].map(([label, href], i) => (
              <li key={i}>
                <Link href={href} className="hover:text-yellow transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-base font-semibold mb-4">Support</h3>
          <ul className="grid grid-cols-2 gap-y-2 text-sm text-cream/80">
            {[
              ['Contact', '/contact'],
              ['FAQ', '/faq'],
              ['Shipping', '/shipping'],
              ['Returns', '/returns'],
            ].map(([label, href], i) => (
              <li key={i}>
                <Link href={href} className="hover:text-yellow transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Newsletter */}
        <div>
          <h3 className="text-base font-semibold mb-4">Get in Touch</h3>
          <div className="text-sm text-cream/80 space-y-3">
            <p>123 Commerce Street, NY</p>
            <p>+1 (234) 567-8900</p>
            <p>support@semilia.com</p>
          </div>

          <div className="mt-6">
            <p className='mb-2'>Subscribe to our newsletter</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Email"
                className="px-3 py-2 rounded bg-white/10 text-white text-sm placeholder:text-cream/60 focus:outline-none focus:ring-2 focus:ring-yellow"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-yellow text-black text-sm font-semibold rounded hover:bg-white hover:text-black transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 mt-12 pt-5 text-center text-xs text-cream/60">
        <p>
          &copy; {new Date().getFullYear()} Semilia. All rights reserved.
          <span className="mx-1">|</span>
          <Link href="#" className="hover:underline">Privacy</Link>
          <span className="mx-1">|</span>
          <Link href="#" className="hover:underline">Cookies</Link>
        </p>
      </div>

      {/* Back to Top */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 w-10 h-10 bg-yellow text-black hover:bg-white rounded-full shadow-lg flex items-center justify-center transition"
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
}
