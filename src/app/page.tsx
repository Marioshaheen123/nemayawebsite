import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import BenefitsCarousel from "@/components/BenefitsCarousel";
import Pricing from "@/components/Pricing";
import Blog from "@/components/Blog";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-white">
      <Header />
      <Hero />
      <Benefits />
      <BenefitsCarousel />
      <Pricing />
      <Blog />
      <FAQ />
      <Footer />
    </main>
  );
}
