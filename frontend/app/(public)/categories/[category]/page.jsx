'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, categoriesAPI } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import { useState, useEffect } from 'react';
import { ListFilter, Grid, List, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

export default function CategoryPage({ params }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { category } = params;

  const [layout, setLayout] = useState('grid'); // 'grid' or 'list'
  const [sortOption, setSortOption] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryName = category.replace(/-/g, ' ');

  // Fetch categories to get the category details
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
  });

  const currentCategory = categoriesData?.find(cat => 
    cat.main.toLowerCase() === categoryName.toLowerCase()
  );

  // Fetch products for the category
  const { data: productsData, isLoading, isError, error } = useQuery({
    queryKey: ['products', { category: categoryName, sortOption, minPrice, maxPrice }],
    queryFn: () => productsAPI.getProducts({
      category: categoryName,
      sort: sortOption,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    }),
  });

  const products = productsData?.products || [];

  useEffect(() => {
    // Update URL params for filters
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (sortOption) {
      current.set('sort', sortOption);
    } else {
      current.delete('sort');
    }
    if (minPrice) {
      current.set('minPrice', minPrice);
    } else {
      current.delete('minPrice');
    }
    if (maxPrice) {
      current.set('maxPrice', maxPrice);
    } else {
      current.delete('maxPrice');
    }
    const query = current.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }, [sortOption, minPrice, maxPrice, pathname, router, searchParams]);

  const handleApplyFilters = () => {
    setFiltersOpen(false);
  };

  if (isLoading) return <div className="text-center py-10">Loading products...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="container-custom py-10">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="text-gray-600 hover:text-yellow">Home</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center">
            <Link href="/shop" className="text-gray-600 hover:text-yellow">Shop</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-800 font-medium capitalize">{categoryName}</li>
        </ol>
      </nav>

      {/* Category Banner */}
      {currentCategory && (
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <Image
            src={currentCategory.image || '/placeholder.jpg'}
            alt={`${categoryName} Collection`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 capitalize">{categoryName}</h1>
              <p className="text-lg md:text-xl">Discover our latest {categoryName} collection</p>
            </div>
          </div>
        </div>
      )}

      {/* Subcategories */}
      {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by {categoryName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentCategory.subcategories.map((sub, index) => (
              <Link
                key={index}
                href={`/categories/${category}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative h-32 md:h-40 rounded-lg overflow-hidden"
              >
                <Image
                  src={sub.image || '/placeholder.jpg'}
                  alt={sub.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white font-semibold text-center px-2">{sub.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Controls: Filters, Sort, Layout */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        {/* Filters Toggle (Mobile) */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <ListFilter className="w-5 h-5" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters (Desktop & Mobile Accordion) */}
        <div className={`w-full md:w-auto md:flex md:space-x-6 ${filtersOpen ? 'block' : 'hidden md:block'} mt-4 md:mt-0`}>
          <div className="bg-gray-50 p-4 rounded-lg md:p-0 md:bg-transparent space-y-4 md:space-y-0">
            {/* Price Filter */}
            <div className="flex items-center space-x-2">
              <label htmlFor="minPrice" className="text-sm font-medium text-gray-700">Price:</label>
              <input
                type="number"
                id="minPrice"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 px-3 py-1 border rounded-md text-sm focus:ring-yellow-400 focus:border-yellow-400"
              />
              <span>-</span>
              <input
                type="number"
                id="maxPrice"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 px-3 py-1 border rounded-md text-sm focus:ring-yellow-400 focus:border-yellow-400"
              />
              <button
                onClick={handleApplyFilters}
                className="px-3 py-1 bg-yellow text-black rounded-md text-sm hover:bg-yellow/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Sort & Layout */}
        <div className="flex items-center space-x-4">
          {/* Sort By */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="latest">Latest Arrivals</option>
              <option value="top-rated">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setLayout('grid')}
              className={`p-2 ${layout === 'grid' ? 'bg-yellow text-black' : 'bg-white text-gray-700'} hover:bg-gray-100 transition-colors`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-2 ${layout === 'list' ? 'bg-yellow text-black' : 'bg-white text-gray-700'} hover:bg-gray-100 transition-colors`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid/List */}
      {products.length === 0 ? (
        <div className="text-center py-10 text-gray-600">No products found in this category.</div>
      ) : (
        <div className={layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 'space-y-6'}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} layout={layout} />
          ))}
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
}
