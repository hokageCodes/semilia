"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Star,
  ShoppingBag,
  Play,
  Sparkles,
} from "lucide-react";
import api from "@/lib/axios";

const Hero = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products?limit=3&sort=top-rated");
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [products]);

  const currentProduct = products[currentSlide];

  return (
    <section className="relative bg-[#FEFBF6] overflow-hidden min-h-screen flex items-center justify-center">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #000000 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-9xl mx-auto px-2 sm:px-6 lg:px-12 grid lg:grid-cols-[60%_40%] gap-16 items-center py- md:py-12">
        {/* Left Side - Text Content (65%) */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles size={16} className="text-[#A6D1E6]" />
            Fresh Drops This Week
          </div>

          <h1 className="text-6xl sm:text-5xl lg:text-7xl font-bold text-[#3D3C42] leading-tight">
            Shop With Confidence.
            <span className="block text-transparent bg-gradient-to-r from-[#3D3C42] to-[#7F5283] bg-clip-text">
              Stay Elegant
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-[#000000]/80 max-w-xl">
            Exclusive curated fashion pieces designed to elevate your everyday style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group bg-[#3D3C42] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#3F2E3E] transition-all duration-300 flex items-center justify-center gap-3">
              Shop Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group border-2 border-[#3D3C42] text-[#3D3C42] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#3D3C42] hover:text-white transition-all duration-300 flex items-center justify-center gap-3">
              <Play size={20} />
              Watch Story
            </button>
          </div>

          <div className="flex items-center gap-6 text-sm pt-6 border-t border-black/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Free Shipping
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              30-Day Returns
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Secure Payments
            </div>
          </div>
        </div>

        {/* Right Side - Product Display (35%) */}
        {currentProduct && (
          <div className="relative w-full max-w-sm mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative w-full h-auto" style={{ aspectRatio: '4 / 5' }}>
                {currentProduct?.image?.trim() ? (
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-black rounded-xl p-4 shadow-lg max-w-[85%]">
                  <h3 className="text-lg font-bold truncate">{currentProduct.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xl font-bold text-[#7F5283]">
                      ${currentProduct.price}
                    </span>
                    {currentProduct.originalPrice && (
                      <span className="text-sm text-black/50 line-through">
                        ${currentProduct.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute top-6 left-6 bg-black/80 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow text-yellow" />
                  <span>{currentProduct.rating || 0}</span>
                  <span className="text-white/50">
                    ({currentProduct.numReviews || 0})
                  </span>
                </div>

                <button className="absolute top-6 right-6 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition">
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "bg-[#3D3C42] scale-125"
                      : "bg-black/20 hover:bg-black"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;