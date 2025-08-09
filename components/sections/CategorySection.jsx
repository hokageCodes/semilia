'use client';

import Image from 'next/image';

const categories = [
  {
    title: 'Women',
    image: '/top-hero.jpg',
  },
  {
    title: 'Men',
    image: '/top-hero.jpg',
  },
  {
    title: 'Kiddies Fashion',
    image: '/top-hero.jpg',
  },
];

export default function CategoryLayout() {
  return (
    <section className="max-w-7xl mx-auto px-2 lg:px-16 py-16">
        <h2 className="text-3xl font-bold text-[#3D3C42] mb-8 text-center">
          Product Categories
        </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
        
        {/* Women - Full height */}
        <div className="relative h-full">
          <Image
            src={categories[0].image}
            alt={categories[0].title}
            fill
            className="object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
            <h2 className="text-white text-6xl font-bold">{categories[0].title}</h2>
          </div>
        </div>

        {/* Right column: Men & Kiddies - each half height */}
        <div className="flex flex-col gap-4 h-full">
          {categories.slice(1).map((cat, index) => (
            <div key={index} className="relative flex-1 rounded-xl overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-white text-6xl font-semibold">{cat.title}</h2>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
