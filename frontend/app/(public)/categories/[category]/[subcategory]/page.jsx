'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import ProductCard from '@/components/products/ProductCard';
import { ShoppingCart, Grid, List, SlidersHorizontal, X } from 'lucide-react';

export default function SubcategoryPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: params.category,        // Changed from params.main
    subcategory: params.subcategory,
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    sort: 'newest'
  });

  // Fetch products for this subcategory
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', 'subcategory', params.category, params.subcategory, filters], // Changed
    queryFn: () => productsAPI.getProducts({
      category: params.category,        // Changed from params.main
      subcategory: params.subcategory,  // Changed from params.sub
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      size: filters.size || undefined,
      color: filters.color || undefined,
      sortBy: filters.sort === 'newest' ? 'createdAt' : 
              filters.sort === 'price-low' ? 'price' : 
              filters.sort === 'price-high' ? 'price' : 'createdAt',
      order: filters.sort === 'price-high' ? 'desc' : 'asc'
    }),
  });

  const products = productsData?.products || [];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: params.category,
      subcategory: params.subcategory,
      minPrice: '',
      maxPrice: '',
      size: '',
      color: '',
      sort: 'newest'
    });
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-yellow">Home</Link></li>
            <li>/</li>
            <li><Link href="/shop" className="hover:text-yellow">Shop</Link></li>
            <li>/</li>
            <li><Link href={`/categories/${params.category}`} className="hover:text-yellow capitalize">
              {params.category?.replace(/-/g, ' ')}
            </Link></li>
            <li>/</li>
            <li><span className="text-gray-900 capitalize">{params.subcategory?.replace(/-/g, ' ')}</span></li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {params.subcategory?.replace(/-/g, ' ')}
          </h1>
          <p className="text-lg text-gray-600 capitalize">
            {params.category?.replace(/-/g, ' ')} Collection
          </p>
          <p className="text-gray-500 mt-2">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-yellow text-black' : 'bg-white text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-yellow text-black' : 'bg-white text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 bg-white rounded-lg shadow-md p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h4 className="font-medium mb-3">Sort By</h4>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full py-2 text-yellow hover:text-yellow/80 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found in this subcategory.</p>
                <Link
                  href="/shop"
                  className="inline-block mt-4 px-6 py-2 bg-yellow text-black rounded-lg hover:bg-yellow/90 transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    layout={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

