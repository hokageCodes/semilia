// Example: Updated FeaturedSection with CartButton
'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';
import CartButton from '@/components/cart/CartButton';

const FeaturedSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
  try {
    const res = await axios.get('https://semilia-by-tgf.onrender.com/api/products/featured?limit=8');
    setProducts(res.data.products);
  } catch (err) {
    console.error('Error fetching featured products:', err);
  } finally {
    setLoading(false);
  }
};
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="px-2 lg:px-16" style={{ backgroundColor: '#f8eae6' }}>
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#000000' }}>
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md p-4">
              <div className="h-48 bg-gray-200 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 text-center" style={{ backgroundColor: '#f8eae6' }}>
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#000000' }}>Featured Products</h2>
        <p style={{ color: '#000000', opacity: '0.6' }}>No featured products available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#f8eae6' }}>
      <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#000000' }}>
        Featured Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col group"
          >
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`}>
              <div className="h-48 overflow-hidden rounded-xl mb-4">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            <div className="flex-1 flex flex-col">
              <Link href={`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`}>
                <h3 className="text-lg font-semibold mb-1 truncate" style={{ color: '#000000' }}>
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm line-clamp-2 mb-2" style={{ color: '#000000', opacity: '0.6' }}>
                {product.description}
              </p>
              <span className="font-bold text-base mb-4" style={{ color: '#000000' }}>
                ₦{product.price.toLocaleString()}
              </span>

              {/* Use CartButton instead of custom button */}
              <CartButton product={product} className="mt-auto" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;