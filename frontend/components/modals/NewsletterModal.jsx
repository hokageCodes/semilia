'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useLocalStorage, useIsClient } from '@/hooks/useLocalStorage';
import toast from 'react-hot-toast';

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const isClient = useIsClient();
  
  // Use safe localStorage hook
  const [hasSeenModal, setHasSeenModal] = useLocalStorage('newsletterModalSeen', false);

  useEffect(() => {
    if (!isClient) return;
    
    // Check if user has already seen the modal
    if (!hasSeenModal) {
      // Show modal after 45 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 45000); // 45 seconds

      return () => clearTimeout(timer);
    }
  }, [isClient, hasSeenModal]);

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user has seen the modal
    setHasSeenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsSubmitting(true);

    try {
      const { newsletterAPI } = await import('@/lib/api');
      await newsletterAPI.subscribe(email, 'modal');
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error.response?.data?.message || 'Failed to subscribe. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
        >
          <X className="w-5 h-5 text-black" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left Side - Image */}
          <div className="relative h-64 md:h-full min-h-[300px]">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"
              alt="Fashion Newsletter"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <Sparkles className="w-8 h-8 text-yellow mb-2" />
              <h3 className="text-2xl font-bold">Stay in Style</h3>
              <p className="text-sm text-white/90 mt-1">Get exclusive updates</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {!isSuccess ? (
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-black mb-2">
                    Join Our Community
                  </h2>
                  <p className="text-gray-600">
                    Subscribe to get exclusive access to new arrivals, special offers, and fashion tips delivered straight to your inbox.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-yellow text-black font-semibold rounded-xl hover:bg-yellow/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                  </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Welcome Aboard!</h3>
                <p className="text-gray-600">
                  Thank you for subscribing. Check your inbox for exclusive offers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

