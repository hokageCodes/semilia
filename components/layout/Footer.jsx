'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, Phone, MapPin, Facebook, Twitter, Instagram, 
  Youtube, Send, ArrowRight, Heart, CreditCard, 
  Truck, Shield, RotateCcw, Star
} from 'lucide-react';

// Newsletter Subscription Component
const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 rounded-lg text-white">
      <div className="text-center mb-6">
        <Mail className="mx-auto mb-4 text-blue-100" size={48} />
        <h3 className="text-2xl font-bold mb-2">Stay in the Loop</h3>
        <p className="text-blue-100">Get exclusive deals, new arrivals, and insider updates delivered to your inbox.</p>
      </div>
      
      {isSubscribed ? (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <Heart className="text-white" size={24} />
          </div>
          <h4 className="text-xl font-semibold mb-2">Welcome to the family! 🎉</h4>
          <p className="text-blue-100">Check your inbox for a special welcome offer.</p>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Subscribing...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Subscribe
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-blue-100 text-center">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </form>
      )}
    </div>
  );
};

// Social Media Links
const SocialLinks = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-600' }
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((social, index) => (
        <a
          key={index}
          href={social.href}
          aria-label={social.label}
          className={`p-3 bg-gray-100 rounded-full text-gray-600 ${social.color} transition-all duration-200 hover:transform hover:scale-110`}
        >
          <social.icon size={20} />
        </a>
      ))}
    </div>
  );
};

// Footer Links Section
const FooterLinks = () => {
  const linkSections = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', href: '/products' },
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Best Sellers', href: '/best-sellers' },
        { name: 'Sale Items', href: '/sale' },
        { name: 'Gift Cards', href: '/gift-cards' }
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Testimonials', href: '#' },
      ]
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {linkSections.map((section, index) => (
        <div key={index}>
          <h4 className="font-semibold text-gray-900 mb-4">{section.title}</h4>
          <ul className="space-y-3">
            {section.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <Link 
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:underline"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Contact Information
const ContactInfo = () => (
  <div className="space-y-4">
    <h4 className="font-semibold text-gray-900 mb-4">Get in Touch</h4>
    <div className="space-y-3">
      <a href="tel:+1234567890" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
        <Phone size={18} className="mr-3 flex-shrink-0" />
        <span>+1 (234) 567-8900</span>
      </a>
      <a href="mailto:support@semilia.com" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
        <Mail size={18} className="mr-3 flex-shrink-0" />
        <span>support@semilia.com</span>
      </a>
      <div className="flex items-start text-gray-600">
        <MapPin size={18} className="mr-3 flex-shrink-0 mt-0.5" />
        <span>123 Commerce Street<br />New York, NY 10001</span>
      </div>
    </div>
    
  </div>
);

// Payment Methods
const PaymentMethods = () => {
  const paymentMethods = [
    'Visa', 'Mastercard', 'American Express', 'PayPal', 'Apple Pay', 'Google Pay'
  ];

  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-4">We Accept</h4>
      <div className="flex flex-wrap gap-3">
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 border"
          >
            {method}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Footer Component
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
        {/* Newsletter Section */}
        <div className="py-12">
          <div className="max-w-2xl mx-auto">
            <NewsletterSection />
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 lg:grid-cols-6 gap-8">
          
          {/* Company Info & Logo */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <div className="relative w-32 h-24">
                <Image
                  src="/semilia-logo-nobg.png"
                  alt="Semilia Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-gray-600 max-w-md">
              Discover quality products that enhance your lifestyle. From fashion to home essentials, 
              we curate the best items just for you.
            </p>
            <SocialLinks />
            <ContactInfo />
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-4">
            <FooterLinks />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-gray-600">
              <span>© 2025 Semilia. Made with</span>
              <Heart className="text-red-500" size={16} />
              <span>in New York</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}