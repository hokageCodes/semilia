'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Helper function to get valid image URL (exclude placeholders)
  const getImageUrl = (product) => {
    const placeholderPatterns = [
      '/placeholder.jpg',
      'placeholder.jpg',
      'via.placeholder.com',
      'placeholder'
    ];
    
    // Check mainImage
    if (product?.mainImage && product.mainImage.trim()) {
      const isPlaceholder = placeholderPatterns.some(pattern => 
        product.mainImage.toLowerCase().includes(pattern.toLowerCase())
      );
      if (!isPlaceholder) {
        return product.mainImage;
      }
    }
    
    // Check images array
    if (product?.images?.[0]?.url && product.images[0].url.trim()) {
      const isPlaceholder = placeholderPatterns.some(pattern => 
        product.images[0].url.toLowerCase().includes(pattern.toLowerCase())
      );
      if (!isPlaceholder) {
        return product.images[0].url;
      }
    }
    
    return null;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      // Pass the full product object to ensure all data is available
      addToCart(product, 1);
      
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const imageUrl = getImageUrl(product);
  const isOutOfStock = product.countInStock === 0;

  if (layout === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          {/* Product Image */}
          <div className="relative w-32 h-32 flex-shrink-0">
                      {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                console.error('Image load error:', imageUrl);
                e.target.style.display = 'none';
                if (e.target.parentElement) {
                  e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-200 text-gray-400">No Image</div>';
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
              No Image
            </div>
          )}
          </div>

          {/* Product Details */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center ml-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {product.rating || 0}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  isOutOfStock || isAddingToCart
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-yellow text-black hover:bg-yellow/90'
                }`}
              >
                {isAddingToCart ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
              onError={(e) => {
                console.error('Image load error:', imageUrl);
                e.target.style.display = 'none';
                if (e.target.parentElement) {
                  e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-200 text-gray-400">No Image</div>';
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
              No Image
            </div>
          )}
          
          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Out of Stock
            </div>
          )}
          
          {/* Quick Add to Cart Button */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              className={`opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-4 py-2 rounded-lg font-medium text-sm ${
                isOutOfStock || isAddingToCart
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow text-black hover:bg-yellow/90'
              }`}
            >
              {isAddingToCart ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-yellow transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">
                {product.rating || 0}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ₦{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₦{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {product.discount > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                {product.discount}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
