import CategorySection from "@/components/sections/CategorySection";
import FAQSection from "@/components/sections/FAQSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import HeroSection from "@/components/sections/HeroSection";
import ProductGallery from "@/components/sections/ProductGallerySection";
import TestimonialsSection from "@/components/sections/TestimonialSection";

// app/(public)/page.tsx
export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <CategorySection />
      <TestimonialsSection />
      <FAQSection />
      <ProductGallery />
    </>
  )
}
