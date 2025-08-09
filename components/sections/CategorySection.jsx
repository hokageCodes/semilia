'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from '@/lib/axios';

export default function CategoryLayout() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/categories'); // calls /api/categories
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 text-center">
        <p className="text-lg text-gray-500">Loading categories...</p>
      </section>
    );
  }

  if (!categories.length) {
    return (
      <section className="py-16 text-center">
        <p className="text-lg text-gray-500">No categories found.</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-2 lg:px-16 py-16">
      <h2 className="text-3xl font-bold text-[#3D3C42] mb-8 text-center">
        Product Categories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
        
        {/* Left: Women full height */}
        {categories[0] && (
          <div className="relative h-full">
            <Image
              src='/avi.avif'
              alt={`${categories[0].main} Category`}
              fill
              className="object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
              <h2 className="text-white text-6xl font-bold">
                {categories[0].main}
              </h2>
            </div>
          </div>
        )}

        {/* Right: Men & Kids stacked */}
        <div className="flex flex-col gap-4 h-full">
          {categories.slice(1, 3).map((cat, index) => (
            <div
              key={cat._id || index}
              className="relative flex-1 rounded-xl overflow-hidden"
            >
              <Image
                src='/bottom-hero.jpg'
                alt={`${cat.main} Category`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-white text-4xl font-semibold">{cat.main}</h2>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
