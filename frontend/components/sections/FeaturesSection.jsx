import Image from 'next/image';

export default function FeaturesSection() {
  const features = [
    {
      image: 'https://images.unsplash.com/photo-1557777586-f6682739fcf3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFzaGlvbiUyMHRyZW5kc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
      title: 'Latest Trends'
    },
    {
      image: 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVhbGl0eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
      title: 'Quality Guaranteed'
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1681487829842-2aeff98f8b63?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFzdCUyMGRlbGl2ZXJ5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',
      title: 'Fast Delivery'
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1678567671319-cd5273f97b1d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmV0dXJuc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
      title: 'Easy Returns'
    }
  ];

  return (
    <section className="bg-white py-12">
      <div className="container-custom">
        <div className="flex items-center justify-center gap-8 overflow-x-auto pb-4 px-4">
          {features.map((feature, index) => (
            <div key={index} className="flex-shrink-0 text-center space-y-3 cursor-pointer group">
              {/* Instagram Story Circle */}
              <div className="relative w-28 h-28">
                {/* Gradient Border Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow via-black to-yellow group-hover:scale-105 transition-transform">
                  <div className="absolute inset-[4px] rounded-full bg-white">
                    <div className="absolute inset-[4px] rounded-full overflow-hidden">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <p className="text-sm font-medium text-black group-hover:text-yellow transition-colors">
                {feature.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
