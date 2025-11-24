'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/assets/adire.jpg"
              alt="Semilia Fashion - Our Story"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Founded in Lagos, Nigeria, <span className="text-black font-semibold">Semilia</span> is more than just a fashion brand. it's a celebration of African elegance and contemporary style.
                </p>
                <p>
                  We blend traditional craftsmanship with modern designs to create pieces that tell a story. Every garment is carefully curated to empower you to express your unique style while honoring our rich cultural heritage.
                </p>
                <p>
                  Since 2020, we've been redefining African fashion, working directly with local artisans to bring you authentic, premium pieces that celebrate creativity and craftsmanship.
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-yellow text-black rounded-xl font-medium hover:bg-yellow/90 transition-all transform hover:scale-105 shadow-lg"
            >
              Learn More About Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

