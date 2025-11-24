'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '@/lib/api';

export default function CategoriesSection() {

  // Fetch categories from API
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
  });

  const categories = categoriesData || [];

  return (
    <>

    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Explore our curated collections</p>
          </div>
          <Link 
            href="/categories" 
            className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            View All Categories
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto md:h-[600px]">
          {/* Card 1 - Full height, spans 1 column */}
          <Link href={`/categories/${categories[0]?.main?.toLowerCase()}`}>
            <div className="group relative overflow-hidden rounded-2xl shadow-xl h-80 md:h-full">
              <Image
                src={categories[0]?.image || '/placeholder.jpg'}
                alt={categories[0]?.main || 'Category'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
              
              {/* Main Category Info */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-white text-3xl font-bold mb-3">{categories[0]?.main || 'Category'}</h3>
                <span className="text-white/90 text-sm inline-flex items-center gap-2">
                  Explore Collection
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2 - Full height, spans 1 column */}
          <Link href={`/categories/${categories[1]?.main?.toLowerCase()}`}>
            <div className="group relative overflow-hidden rounded-2xl shadow-xl h-80 md:h-full">
              <Image
                src={categories[1]?.image || '/placeholder.jpg'}
                alt={categories[1]?.main || 'Category'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
              
              {/* Main Category Info */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-white text-3xl font-bold mb-3">{categories[1]?.main || 'Category'}</h3>
                <span className="text-white/90 text-sm inline-flex items-center gap-2">
                  Explore Collection
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Cards 3 & 4 - Stacked, span 2 columns */}
          <div className="grid grid-rows-2 gap-6 h-80 md:h-full lg:col-span-2">
            {/* Card 3 - Top half */}
            <Link href={`/categories/${categories[2]?.main?.toLowerCase()}`}>
              <div className="group relative overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={categories[2]?.image || '/placeholder.jpg'}
                  alt={categories[2]?.main || 'Category'}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
                
                {/* Main Category Info */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-white text-3xl font-bold mb-3">{categories[2]?.main || 'Category'}</h3>
                  <span className="text-white/90 text-sm inline-flex items-center gap-2">
                    Explore Collection
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 4 - Bottom half */}
            <Link href={`/categories/${categories[3]?.main?.toLowerCase()}`}>
              <div className="group relative overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={categories[3]?.image || '/placeholder.jpg'}
                  alt={categories[3]?.main || 'Category'}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
                
                {/* Main Category Info */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-white text-3xl font-bold mb-3">{categories[3]?.main || 'Category'}</h3>
                  <span className="text-white/90 text-sm inline-flex items-center gap-2">
                    Explore Collection
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  </>
  );
}
