'use client';

export default function ProductGallery() {
  const images = [
    '/bottom-hero.jpg',
    '/top-hero.jpg',
    '/avi.avif',
    'https://res.cloudinary.com/dbbjbwhxq/image/upload/v1663576876/cld-sample-2.jpg',
    'https://res.cloudinary.com/dbbjbwhxq/image/upload/v1663576876/cld-sample.jpg',
    'https://res.cloudinary.com/dbbjbwhxq/image/upload/v1663576876/cld-sample.jpg',
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-2 lg:px-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Product Gallery</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Large main image */}
          <div className="sm:col-span-2 lg:col-span-2 row-span-2">
            <img
              src={images[0]}
              alt="Main product"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Remaining smaller images */}
          {images.slice(1).map((img, i) => (
            <div key={i} className="aspect-square">
              <img
                src={img}
                alt={`Product view ${i + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-md hover:opacity-90 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
