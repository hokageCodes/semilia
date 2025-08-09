'use client';

import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Loyal Customer',
    text: 'Absolutely love the quality of the products. Delivery was fast and packaging was beautiful!',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Michael Smith',
    role: 'Verified Buyer',
    text: 'Best shopping experience ever! The clothes fit perfectly and the customer service was top-notch.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Grace Williams',
    role: 'Fashion Blogger',
    text: 'Stylish, affordable, and high-quality. I recommend them to all my followers!',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16" style={{ backgroundColor: '#f8eae6' }}>
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12" style={{ color: '#000000' }}>
          What Our Customers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <Quote className="text-4xl mb-4 mx-auto" style={{ color: '#ffcf04' }} />
              <p className="mb-6" style={{ color: '#000000', opacity: '0.8' }}>
                {t.text}
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h4 className="font-semibold" style={{ color: '#000000' }}>
                    {t.name}
                  </h4>
                  <span className="text-sm" style={{ color: '#000000', opacity: '0.6' }}>
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}