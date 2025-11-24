'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'Amara Okafor',
      location: 'Lagos, Nigeria',
      rating: 5,
      text: 'Semilia has completely transformed my wardrobe. The quality and attention to detail in every piece is exceptional. I love how they blend traditional African prints with modern designs.',
    },
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      text: 'I discovered Semilia online and fell in love instantly. The fabrics are gorgeous and the fit is perfect. I get compliments every time I wear their pieces!',
    },
    {
      name: 'Chiamaka Eze',
      location: 'London, UK',
      rating: 5,
      text: 'As someone who values both style and cultural heritage, Semilia is a dream come true. Their Adire collection is absolutely stunning.',
    },
    {
      name: 'Funmi Adeyemi',
      location: 'Abuja, Nigeria',
      rating: 5,
      text: 'The customer service is amazing and shipping was faster than expected. Every piece I ordered exceeded my expectations. Highly recommend!',
    },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            YOU Keep Us Going
          </h2>
          <p className="text-gray-600 text-lg">
            What people all over the world are saying
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-yellow/20">
                <Quote className="w-16 h-16 fill-current" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow text-yellow" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 text-base leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                {/* <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div> */}
                <div>
                  <h4 className="font-bold text-black">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

