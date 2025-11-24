'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqsColumn1 = [
    {
      question: 'How do I place an order?',
      answer: 'Simply browse our collections, add items to your cart, and proceed to checkout. You can shop as a guest or create an account for faster checkout and order tracking.',
    },
    {
      question: 'What are your shipping options?',
      answer: 'We offer standard shipping (5-7 business days) and express shipping (2-3 business days) within Nigeria. International shipping is available to select countries and takes 7-14 business days.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 14 days of delivery for unworn items with original tags attached. Items must be in their original condition. Refunds are processed within 5-7 business days after we receive your return.',
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s tracking page.',
    },
  ];

  const faqsColumn2 = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, bank transfers, and mobile payment options including Paystack and Flutterwave for secure transactions.',
    },
    {
      question: 'How do I know what size to order?',
      answer: 'Each product page includes a detailed size guide. You can also contact our customer service team for personalized sizing recommendations.',
    },
    {
      question: 'Do you offer gift wrapping?',
      answer: 'Yes! We offer complimentary gift wrapping for all orders. Simply select the gift wrap option at checkout and add a personalized message.',
    },
    {
      question: 'How can I contact customer support?',
      answer: 'You can reach us via email at support@semilia.com, WhatsApp at +234 XXX XXX XXXX, or through our social media channels. We respond within 24 hours.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderFAQItem = (faq, index) => {
    const isOpen = openIndex === index;
    
    return (
      <div
        key={index}
        className="border-b border-gray-200 last:border-b-0"
      >
        <button
          onClick={() => toggleFAQ(index)}
          className="w-full flex items-start justify-between py-6 text-left group"
        >
          <span className="font-semibold text-black text-lg pr-8 group-hover:text-gray-700 transition-colors">
            {faq.question}
          </span>
          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            isOpen ? 'bg-yellow text-black' : 'bg-gray-100 text-gray-600'
          }`}>
            {isOpen ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </div>
        </button>
        
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-96 pb-6' : 'max-h-0'
          }`}
        >
          <p className="text-gray-600 leading-relaxed pr-12">
            {faq.answer}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about shopping with Semilia
          </p>
        </div>

        {/* Two Column FAQ Grid */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Column 1 */}
          <div className="space-y-0">
            {faqsColumn1.map((faq, index) => renderFAQItem(faq, index))}
          </div>

          {/* Column 2 */}
          <div className="space-y-0">
            {faqsColumn2.map((faq, index) => renderFAQItem(faq, index + faqsColumn1.length))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16 pt-12 border-t border-gray-200">
          <p className="text-gray-700 text-lg mb-4">Still have questions?</p>
          <a
            href="mailto:support@semilia.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow text-black rounded-xl font-medium hover:bg-yellow/90 transition-all transform hover:scale-105 shadow-lg"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}

