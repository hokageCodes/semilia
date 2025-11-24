'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { getProductImageUrl } from '@/lib/imageUtils';
import { ArrowRight, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewArrivalsSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCart();

  // Fetch latest products (increase limit for carousel)
  const { data: productsData } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productsAPI.getProducts({ sortBy: 'createdAt', order: 'desc', limit: 12 }),
  });

  const products = productsData?.products || [];
  const showCarousel = products.length > 3;
  const productsPerSlide = 3;
  const totalSlides = Math.ceil(products.length / productsPerSlide);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!showCarousel) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [showCarousel, totalSlides]);

  if (products.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-2">New Arrivals</h2>
            <p className="text-gray-600 text-lg">Fresh styles, just for you</p>
          </div>
          <Link 
            href="/shop?filter=new-arrivals" 
            className="px-8 py-3 bg-yellow text-black rounded-xl font-medium hover:bg-yellow/90 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            Shop New Arrivals
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {showCarousel ? (
            <>
              {/* Carousel Mode - 3 products per slide */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                    const slideProducts = products.slice(
                      slideIndex * productsPerSlide,
                      slideIndex * productsPerSlide + productsPerSlide
                    );
                    return (
                      <div
                        key={slideIndex}
                        className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
                      >
                        {slideProducts.map((product, productIndex) => {
                          const globalIndex = slideIndex * productsPerSlide + productIndex;
                          return (
                            <div
                              key={product._id}
                              className="relative group cursor-pointer overflow-hidden rounded-2xl"
                              onMouseEnter={() => setHoveredIndex(globalIndex)}
                              onMouseLeave={() => setHoveredIndex(null)}
                            >
                              <div className="relative h-[400px] lg:h-[500px]">
                                {getProductImageUrl(product) ? (
                                  <Image
                                    src={getProductImageUrl(product)}
                                    alt={product.name}
                                    fill
                                    className={`object-cover transition-transform duration-700 ${
                                      hoveredIndex === globalIndex ? 'scale-110' : 'scale-100'
                                    }`}
                                    unoptimized
                                    onError={(e) => {
                                      console.error('Image load error:', getProductImageUrl(product));
                                      e.target.style.display = 'none';
                                      if (e.target.parentElement) {
                                        e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-200 text-gray-400">No Image</div>';
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                                    No Image
                                  </div>
                                )}
                                
                                {/* Overlay */}
                                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                                  hoveredIndex === globalIndex ? 'opacity-100' : 'opacity-0'
                                }`} />

                                {/* Badge */}
                                {globalIndex === 0 && (
                                  <div className="absolute top-4 left-4 bg-yellow text-black px-4 py-1 rounded-full text-sm font-bold">
                                    New
                                  </div>
                                )}
                                {product.discount > 0 && globalIndex !== 0 && (
                                  <div className="absolute top-4 left-4 bg-yellow text-black px-4 py-1 rounded-full text-sm font-bold">
                                    -{product.discount}%
                                  </div>
                                )}

                                {/* Product Info - Always visible */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                  <div className="bg-black/80 backdrop-blur-md rounded-xl p-6">
                                    <h3 className="text-xl lg:text-2xl font-bold mb-2 line-clamp-2">{product.name}</h3>
                                    <div className="flex items-center justify-between gap-4">
                                      <p className="text-yellow text-lg lg:text-xl font-bold">₦{product.price?.toLocaleString()}</p>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={(e) => handleAddToCart(e, product)}
                                          disabled={!product.countInStock || product.countInStock <= 0}
                                          className="px-4 py-2 bg-yellow text-black rounded-full font-medium hover:bg-yellow/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                          <ShoppingCart className="w-4 h-4" />
                                          Add
                                        </button>
                                        <Link 
                                          href={`/products/${product.slug}`}
                                          className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-yellow transition-colors"
                                        >
                                          View
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Grid Mode - Show up to 3 products */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                {products.slice(0, 3).map((product, index) => (
                  <div
                    key={product._id}
                    className="relative group cursor-pointer overflow-hidden rounded-2xl"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="relative h-[400px] lg:h-[500px]">
                      {getProductImageUrl(product) ? (
                        <Image
                          src={getProductImageUrl(product)}
                          alt={product.name}
                          fill
                          className={`object-cover transition-transform duration-700 ${
                            hoveredIndex === index ? 'scale-110' : 'scale-100'
                          }`}
                          unoptimized
                          onError={(e) => {
                            console.error('Image load error:', getProductImageUrl(product));
                            e.target.style.display = 'none';
                            if (e.target.parentElement) {
                              e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-200 text-gray-400">No Image</div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                          No Image
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                        hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                      }`} />

                      {/* Badge */}
                      {index === 0 && (
                        <div className="absolute top-4 left-4 bg-yellow text-black px-4 py-1 rounded-full text-sm font-bold">
                          New
                        </div>
                      )}
                      {product.discount > 0 && index !== 0 && (
                        <div className="absolute top-4 left-4 bg-yellow text-black px-4 py-1 rounded-full text-sm font-bold">
                          -{product.discount}%
                        </div>
                      )}

                      {/* Product Info - Always visible */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="bg-black/80 backdrop-blur-md rounded-xl p-6">
                          <h3 className="text-xl lg:text-2xl font-bold mb-2 line-clamp-2">{product.name}</h3>
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-yellow text-lg lg:text-xl font-bold">₦{product.price?.toLocaleString()}</p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleAddToCart(e, product)}
                                disabled={!product.countInStock || product.countInStock <= 0}
                                className="px-4 py-2 bg-yellow text-black rounded-full font-medium hover:bg-yellow/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Add
                              </button>
                              <Link 
                                href={`/products/${product.slug}`}
                                className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-yellow transition-colors"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Carousel Navigation */}
          {showCarousel && (
            <>
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index
                        ? 'bg-yellow w-8'
                        : 'bg-gray-300 w-2 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

