"use client"
import { useState } from 'react';
import { ChevronDown, HelpCircle, Clock, RefreshCw, Package, CreditCard, Truck, Shield } from 'lucide-react';

const faqs = [
  {
    question: 'How long does delivery take?',
    answer: 'Orders are processed within 1-2 business days and delivery usually takes 3-5 business days depending on your location. Express shipping options are available for faster delivery.',
    icon: Clock,
    category: 'shipping'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we have a 30-day return policy for unused and undamaged items. Refunds are processed within 5-7 business days after we receive your return.',
    icon: RefreshCw,
    category: 'returns'
  },
  {
    question: 'Can I track my order?',
    answer: 'Absolutely! You will receive a tracking link via email once your order has been shipped. You can also track your order in your account dashboard.',
    icon: Package,
    category: 'shipping'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through our encrypted payment gateway.',
    icon: CreditCard,
    category: 'payment'
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Custom duties may apply.',
    icon: Truck,
    category: 'shipping'
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Your privacy and security are our top priorities. We use industry-standard SSL encryption and never share your personal information with third parties.',
    icon: Shield,
    category: 'security'
  }
];

export default function TwoColFAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const leftColumnFAQs = faqs.filter((_, index) => index % 2 === 0);
  const rightColumnFAQs = faqs.filter((_, index) => index % 2 === 1);

  const FAQItem = ({ faq, index, originalIndex }) => {
    const Icon = faq.icon;
    const isOpen = openIndex === originalIndex;
    const isHovered = hoveredIndex === originalIndex;

    return (
      <div 
        className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:shadow-xl ${
          isOpen 
            ? 'shadow-lg' 
            : 'hover:shadow-md'
        }`}
        style={{ 
          borderColor: isOpen ? '#ffcf04' : 'rgba(0,0,0,0.1)',
          backgroundColor: '#ffffff'
        }}
        onMouseEnter={() => setHoveredIndex(originalIndex)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-5' : 'opacity-0'}`}
          style={{ backgroundColor: '#ffcf04' }}
        />
        
        <button
          onClick={() => toggleFAQ(originalIndex)}
          className="relative w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ 
            outline: 'none',
            '--tw-ring-color': '#ffcf04'
          }}
        >
          <div className="flex items-start gap-4">
            <div 
              className={`flex-shrink-0 p-2 rounded-xl transition-all duration-300`}
              style={{ 
                backgroundColor: isOpen ? 'rgba(0,0,0,0.1)' : '#ffcf04',
                color: isOpen ? '#000000' : 'rgba(0,0,0,0.6)'
              }}
            >
              <Icon size={20} />
            </div>
            
            <div className="flex-grow">
              <h3 
                className={`font-semibold text-lg leading-tight transition-colors duration-300`}
                style={{ 
                  color: isOpen ? '#000000' : '#000000'
                }}
              >
                {faq.question}
              </h3>
            </div>
            
            <div 
              className={`flex-shrink-0 p-1 transition-all duration-500 ${
                isOpen ? 'rotate-180' : ''
              }`}
              style={{ 
                color: isOpen ? '#000000' : 'rgba(0,0,0,0.4)'
              }}
            >
              <ChevronDown size={20} />
            </div>
          </div>
        </button>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 pb-6">
            <div className="ml-12 pt-2">
              <p className="leading-relaxed" style={{ color: 'rgba(0,0,0,0.8)' }}>
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20" style={{ backgroundColor: '#f8eae6' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: '#ffcf04' }}>
              <HelpCircle className="w-8 h-8" style={{ color: '#000000' }} />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#000000' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#000000', opacity: '0.7' }}>
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            {leftColumnFAQs.map((faq, index) => {
              const originalIndex = index * 2;
              return (
                <FAQItem 
                  key={originalIndex}
                  faq={faq} 
                  index={index} 
                  originalIndex={originalIndex}
                />
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {rightColumnFAQs.map((faq, index) => {
              const originalIndex = index * 2 + 1;
              return (
                <FAQItem 
                  key={originalIndex}
                  faq={faq} 
                  index={index} 
                  originalIndex={originalIndex}
                />
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div 
            className="rounded-3xl p-8 max-w-2xl mx-auto border"
            style={{ 
              backgroundColor: '#ffffff',
              borderColor: 'rgba(0,0,0,0.1)'
            }}
          >
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#000000' }}>
              Still have questions?
            </h3>
            <p className="mb-6" style={{ color: 'rgba(0,0,0,0.7)' }}>
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <button 
              className="inline-flex items-center px-8 py-3 font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{ 
                backgroundColor: '#ffcf04',
                color: '#000000'
              }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}