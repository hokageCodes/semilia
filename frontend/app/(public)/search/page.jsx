'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  // Fetch search results
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => productsAPI.getProducts({ search: query }),
    enabled: !!query,
  });

  const products = productsData?.data?.products || [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="container-custom py-12">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-gray-600 text-lg">
                Showing results for: <span className="font-semibold text-black">"{query}"</span>
              </p>
            )}
          </div>

          {/* Results */}
          {!query ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg">Enter a search term to find products</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-yellow border-t-transparent rounded-full" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold text-black mb-2">No Results Found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{query}"
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Found {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80 overflow-hidden">
        <Image
          src={product.mainImage || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-yellow text-black px-3 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}
        {/* Removed wishlist button */}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-black mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-bold text-black">₦{product.price?.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm">₦{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        {product.inStock ? (
          <span className="text-sm text-green-600">In Stock</span>
        ) : (
          <span className="text-sm text-red-600">Out of Stock</span>
        )}
      </div>
    </Link>
  );
}

