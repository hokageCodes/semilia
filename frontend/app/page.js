import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import NewArrivalsSection from '@/components/sections/NewArrivalsSection';
import AboutSection from '@/components/sections/AboutSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FAQSection from '@/components/sections/FAQSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import Footer from '@/components/sections/Footer';
import NewsletterModal from '@/components/modals/NewsletterModal';

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <HeroSection />
      {/* <FeaturesSection /> */}
      <NewArrivalsSection />
      <CategoriesSection />
      <AboutSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
      <NewsletterModal />
    </div>
  );
}
