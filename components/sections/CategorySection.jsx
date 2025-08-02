"use client"

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Star,
  ShoppingBag,
  Heart,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  Loader2
} from "lucide-react";

const ProductCategorySection = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [categoryStats, setCategoryStats] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchCategoryStats();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedMainCategory, selectedSubCategory, currentPage, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.structured || {});
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      const response = await fetch('/api/categories/stats');
      const data = await response.json();
      setCategoryStats(data || []);
    } catch (error) {
      console.error('Error fetching category stats:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setError(null);
      
      let url = `/api/categories/products?page=${currentPage}&limit=12&sort=${sortBy}`;
      
      if (selectedMainCategory) {
        url += `&main=${selectedMainCategory}`;
      }
      
      if (selectedSubCategory) {
        url += `&sub=${selectedSubCategory}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotalProducts(data.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setProductsLoading(false);
      setLoading(false);
    }
  };

  const handleMainCategoryChange = (category) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory("");
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (category) => {
    setSelectedSubCategory(category);
    setCurrentPage(1);
  };

  const getSubCategories = () => {
    if (!selectedMainCategory || !categories[selectedMainCategory]) {
      return [];
    }
    return categories[selectedMainCategory];
  };

  const getCategoryCount = (mainCat, subCat = null) => {
    const mainStats = categoryStats.find(stat => stat._id === mainCat);
    if (!mainStats) return 0;
    
    if (subCat) {
      const subStats = mainStats.subCategories.find(sub => sub.name === subCat);
      return subStats ? subStats.count : 0;
    }
    
    return mainStats.totalProducts;
  };

  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={product.mainImage || "https://via.placeholder.com/300x400"}
          alt={product.name}
          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x400?text=Product+Image";
          }}
        />
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
            <Heart size={18} className="text-gray-700 hover:text-red-500" />
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
            <ShoppingBag size={18} className="text-gray-700" />
          </button>
        </div>

        {product.rating > 0 && (
          <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-white/70">({product.numReviews})</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category?.main} • {product.category?.sub}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>
        
        {product.brand && (
          <p className="text-sm text-gray-600 mb-3">{product.brand}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">
            ${product.price?.toFixed(2)}
          </span>
          
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
            Add to Cart
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">Loading categories and products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of premium fashion pieces
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            {/* Main Categories */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleMainCategoryChange("")}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  !selectedMainCategory
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Categories
              </button>
              
              {Object.keys(categories).map((mainCat) => (
                <button
                  key={mainCat}
                  onClick={() => handleMainCategoryChange(mainCat)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedMainCategory === mainCat
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {mainCat}
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    {getCategoryCount(mainCat)}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="createdAt">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="top-rated">Top Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Sub Categories */}
          {selectedMainCategory && getSubCategories().length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleSubCategoryChange("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  !selectedSubCategory
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All {selectedMainCategory}
              </button>
              
              {getSubCategories().map((subCat) => (
                <button
                  key={subCat}
                  onClick={() => handleSubCategoryChange(subCat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedSubCategory === subCat
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {subCat}
                  <span className="text-xs bg-white px-2 py-1 rounded-full">
                    {getCategoryCount(selectedMainCategory, subCat)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            Showing {products.length} of {totalProducts} products
            {selectedMainCategory && ` in ${selectedMainCategory}`}
            {selectedSubCategory && ` • ${selectedSubCategory}`}
          </p>
          
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">No products found in this category</p>
            <button
              onClick={() => {
                setSelectedMainCategory("");
                setSelectedSubCategory("");
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === pageNum
                      ? "bg-purple-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCategorySection;