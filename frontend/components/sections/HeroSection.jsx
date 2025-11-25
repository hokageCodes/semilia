import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Compass } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Image */}
        <div className="relative">
          <Image
            src="/assets/feline-bodysuit.jpg"
            alt="Fashion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        {/* Right Image */}
        <div className="relative hidden lg:block">
          <Image
            src="/assets/Bloom.jpg"
            alt="Fashion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl lg:text-9xl font-black text-white mb-8 tracking-wider">
          SEMILIA
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover our curated collection of timeless fashion pieces that define your unique style
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <Link
            href="/shop"
            className="group px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-yellow transition-all transform hover:scale-105 shadow-lg flex items-center gap-3 text-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop Now
          </Link>
          
          <Link
            href="/categories"
            className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all transform hover:scale-105 flex items-center gap-3 text-lg"
          >
            <Compass className="w-5 h-5" />
            Browse
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 border-2 border-white/70 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
