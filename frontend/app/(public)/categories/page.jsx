'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

export default function CategoriesPage() {
  // Fetch categories from API
  const { data: categoriesData, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
  });

  const categories = categoriesData || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="container-custom py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Error Loading Categories</h1>
          <p className="text-gray-600 mb-8">Something went wrong while loading the categories.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90 transition-colors"
          >
            Go Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Explore our curated collections and discover the perfect pieces for your style
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={category._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Category Image - Clickable */}
              <Link href={`/categories/${category.main.toLowerCase()}`}>
                <div className="relative aspect-video overflow-hidden cursor-pointer">
                  <Image
                    src={category.image || '/placeholder.jpg'}
                    alt={`${category.main} Collection`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-bold text-white mb-2">{category.main}</h2>
                    <p className="text-white/90 text-sm">
                      {category.subcategories?.length || 0} collections
                    </p>
                  </div>
                </div>
              </Link>

              {/* Category Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {category.main} Collection
                </h3>
                
                {/* Subcategories */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 mb-3">Shop by Type:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {category.subcategories.slice(0, 4).map((sub, subIndex) => (
                        <Link
                          key={subIndex}
                          href={`/categories/${category.main.toLowerCase()}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-sm text-gray-600 hover:text-yellow transition-colors py-1 flex items-center justify-between"
                        >
                          <span>{sub.name}</span>
                          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                      {category.subcategories.length > 4 && (
                        <p className="text-xs text-gray-500 mt-2">
                          +{category.subcategories.length - 4} more types
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* View All Button */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link 
                    href={`/categories/${category.main.toLowerCase()}`}
                    className="inline-flex items-center text-yellow hover:text-yellow/80 font-medium text-sm group-hover:translate-x-1 transition-transform"
                  >
                    View All {category.main}
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-black rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Browse our complete collection or use our search to find exactly what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="px-8 py-3 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90 transition-colors"
              >
                Browse All Products
              </Link>
              <Link
                href="/search"
                className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-black transition-colors"
              >
                Search Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
