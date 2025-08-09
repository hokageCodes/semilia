'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="flex flex-col justify-center px-2 lg:px-16 bg-white py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center max-w-9xl mx-auto w-full">
        {/* Left Image - Hidden on Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex items-center justify-center"
        >
          <Image
            src="/avi.avif"
            alt="Hero Left"
            width={400}
            height={300}
            className="object-cover rounded-md"
          />
        </motion.div>

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center space-y-8"
        >
          <h1 className="text-7xl md:text-7xl font-bold text-black leading-tight">
            SEMILIA
          </h1>
          <p className="uppercase tracking-widest text-2xl md:text-xl text-gray-700">
            BY
          </p>
          <h2 className="text-3xl sm:text-3xl md:text-4xl font-semibold border-y-2 tracking-widest text-black py-1">
            Tailor girl fashion
          </h2>
          <button className="border bg-black text-white px-6 py-3 rounded hover:bg-gray-900 transition">
            Shop Now
          </button>
        </motion.div>

        {/* Right Image - Always Visible */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <Image
            src="/avi.avif"
            alt="Hero Right"
            width={400}
            height={400}
            className="object-cover rounded-md"
          />
        </motion.div>
      </div>
    </section>
  );
}
