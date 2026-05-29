import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedDishes from "@/components/home/FeaturedDishes";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import ReservationCTA from "@/components/home/ReservationCTA";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCategories />
        <FeaturedDishes />
        <WhyChooseUs />
        <Testimonials />
        <ReservationCTA />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
