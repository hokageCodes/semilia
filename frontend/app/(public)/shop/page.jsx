'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Grid, List, SlidersHorizontal, X, ShoppingCart } from 'lucide-react';

export default function ShopPage() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    order: 'desc',
  });

  // Fetch products with filters
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsAPI.getProducts(filters),
  });

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
  });

  const products = productsData?.products || [];
  const categories = categoriesData || [];

  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest First' },
    { value: 'createdAt:asc', label: 'Oldest First' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'name:asc', label: 'Name: A to Z' },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (value) => {
    const [sortBy, order] = value.split(':');
    setFilters(prev => ({ ...prev, sortBy, order }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      order: 'desc',
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Header */}
        <div className="bg-black text-white py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop All Products</h1>
            <p className="text-gray-300 text-lg">Discover our curated collection of premium fashion</p>
          </div>
        </div>

        <div className="container-custom py-12">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all md:hidden"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </button>

              {/* Results Count */}
              <p className="text-gray-600">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Sort Dropdown */}
              <select
                value={`${filters.sortBy}:${filters.order}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-2 bg-white rounded-lg shadow-md p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-yellow' : 'hover:bg-gray-100'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-yellow' : 'hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside
              className={`${
                showFilters ? 'fixed inset-0 z-40 bg-black/50' : 'hidden'
              } md:static md:block md:w-64 flex-shrink-0`}
              onClick={(e) => e.target === e.currentTarget && setShowFilters(false)}
            >
              <div className={`${
                showFilters ? 'fixed left-0 top-0 bottom-0 w-80' : ''
              } bg-white p-6 rounded-lg shadow-lg h-fit md:sticky md:top-24`}>
                {/* Mobile Close Button */}
                <div className="flex items-center justify-between mb-6 md:hidden">
                  <h3 className="text-xl font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <h3 className="text-xl font-bold mb-6 hidden md:block">Filters</h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Category</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={filters.category === ''}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-4 h-4 accent-yellow"
                      />
                      <span>All Categories</span>
                    </label>
                    {categoriesLoading ? (
                      <div className="text-sm text-gray-500">Loading categories...</div>
                    ) : categoriesError ? (
                      <div className="text-sm text-red-500">Failed to load categories</div>
                    ) : categories.length === 0 ? (
                      <div className="text-sm text-gray-500">No categories available</div>
                    ) : (
                      categories.map(cat => (
                        <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={cat.main}
                            checked={filters.category === cat.main}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-4 h-4 accent-yellow"
                          />
                          <span>{cat.main}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min Price (₦)"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                    />
                    <input
                      type="number"
                      placeholder="Max Price (₦)"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Products Grid/List */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin w-12 h-12 border-4 border-yellow border-t-transparent rounded-full" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">No products found matching your filters.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-yellow text-black rounded-lg font-medium hover:bg-yellow/90"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-6'
                }>
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} layout={viewMode} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


