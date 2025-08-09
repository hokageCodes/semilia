'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Search, Grid, List, Star, Heart, Eye, Filter, X, SlidersHorizontal } from 'lucide-react';
import CartButton from '@/components/cart/CartButton';

export default function ProductsPage() {
  const [categories, setCategories] = useState([{ id: 'all', main: 'All Products' }]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products', { 
            params: { 
              page: currentPage, 
              limit: itemsPerPage, 
              sort: sortBy,
              category: selectedCategory !== 'all' ? selectedCategory : undefined,
              search: searchTerm.trim() || undefined
            } 
          }),
        ]);

        const fetchedCategories = catRes.data.map(cat => ({
          id: cat.main.toLowerCase(),
          main: cat.main,
        }));
        setCategories([{ id: 'all', main: 'All Products' }, ...fetchedCategories]);

        setProducts(prodRes.data.products);
        setTotalPages(prodRes.data.totalPages || 1);
        setTotalProducts(prodRes.data.totalProducts || prodRes.data.products.length);
        setFilteredProducts(prodRes.data.products);
      } catch (err) {
        console.error('Failed to fetch categories or products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [currentPage, sortBy, selectedCategory, searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy]);

  // Close filters when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowFilters(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Sticky Header - Mobile First */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="py-4 sm:py-6">
            {/* Mobile Header */}
            <div className="flex flex-col space-y-4 sm:hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                  <p className="text-sm text-gray-600">Browse our selection</p>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-base"
                />
              </div>

              {/* Mobile View Toggle */}
              <div className="flex justify-center">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 px-4 py-2 rounded-md transition-all text-sm font-medium ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 px-4 py-2 rounded-md transition-all text-sm font-medium ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Products</h1>
                <p className="mt-1 text-gray-600">Browse and discover our curated selection</p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Desktop Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48 lg:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Desktop View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-4 sm:py-8">
        <div className="flex gap-6 lg:gap-8 relative">
          {/* Mobile Sidebar (Slide-in) */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
            showFilters ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Mobile Categories */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Categories
                  </h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-colors font-medium ${
                          selectedCategory === category.id
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {category.main}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Sort */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Sort by</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-32">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>

              {/* Desktop Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Categories
                </h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-colors font-medium ${
                        selectedCategory === category.id
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {category.main}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Sort */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sort by</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid/List */}
          <main className="flex-1 min-w-0">
            {/* Results Counter */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Showing <span className="text-gray-900">{filteredProducts.length}</span> of <span className="text-gray-900">{totalProducts}</span> products
              </p>
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            {/* Products Display */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <div className="max-w-sm mx-auto px-4">
                  <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 text-sm sm:text-base mb-4">Try adjusting your search or filter criteria.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map(product => (
                  <ProductCardGrid key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <ProductCardList key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page) => {
    onPageChange(page);
    scrollToTop();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Mobile Pagination */}
      <div className="flex sm:hidden items-center gap-2 w-full">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        
        <div className="flex-1 text-center">
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      </div>

      {/* Desktop Pagination */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>

        {totalPages <= 7 ? (
          // Show all pages if 7 or fewer
          [...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === i + 1
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))
        ) : (
          // Show pages with ellipsis
          getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
              disabled={page === '...'}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-gray-900 text-white'
                  : page === '...'
                  ? 'text-gray-400 cursor-default'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))
        )}

        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      </div>

      {/* Page info for desktop */}
      <div className="hidden sm:block text-sm text-gray-500">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts}
      </div>
    </div>
  );
}

// Mobile-First Grid Card
function ProductCardGrid({ product }) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <div className="aspect-square sm:aspect-[4/3] lg:aspect-square">
          <img
            src={product.mainImage || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
          aria-label="Add to favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      <div className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">{product.name}</h2>
        
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-xs sm:text-sm text-gray-500">({product.numReviews || 0})</span>
        </div>

        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-4">₦{product.price.toLocaleString()}</p>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
            aria-label="View product"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <CartButton product={product} />
        </div>
      </div>
    </div>
  );
}

// Mobile-First List Card
function ProductCardList({ product }) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Mobile List Layout - Horizontal */}
      <div className="flex sm:hidden">
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={product.mainImage || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover rounded-l-lg"
            loading="lazy"
          />
        </div>

        <div className="flex-1 p-3 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h2>
          
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500">({product.numReviews || 0})</span>
          </div>

          <p className="text-base font-bold text-gray-900 mb-2">₦{product.price.toLocaleString()}</p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              aria-label="Add to favorites"
            >
              <Heart className={`w-3 h-3 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button
              className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              aria-label="View product"
            >
              <Eye className="w-3 h-3 text-gray-600" />
            </button>
            <CartButton product={product} className="flex-1" />
          </div>
        </div>
      </div>

      {/* Desktop List Layout */}
      <div className="hidden sm:flex">
        <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex-shrink-0">
          <img
            src={product.mainImage || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
            aria-label="Add to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="flex-1 p-4 lg:p-6 flex items-center min-w-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h2>
            
            <div className="flex items-center mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">({product.numReviews || 0})</span>
            </div>

            <p className="text-xl lg:text-2xl font-bold text-gray-900">₦{product.price.toLocaleString()}</p>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <button
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="View product"
            >
              <Eye className="w-5 h-5 text-gray-600" />
            </button>
            <CartButton product={product} size="default" />
          </div>
        </div>
      </div>
    </div>
  );
}