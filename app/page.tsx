import { Navbar } from "@/components/Navbar";
import ScrollNav from "@/components/ScrollNav";
import { Hero } from "@/components/Hero";
import { Testimonials } from "@/components/Testimonials";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { ShingleColorGrid } from "@/components/ShingleColorGrid";
import { Features } from "@/components/Features";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CTASection } from "@/components/CTASection";
import { FAQ } from "@/components/FAQ";
import { CallbackForm } from "@/components/CallbackForm";
import { Footer } from "@/components/Footer";
import { FloatingEstimate } from "@/components/FloatingEstimate";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <ScrollNav />
      <main>
        <Hero />
        <Testimonials />
        <ScrollAnimation />
        <Features />
        <ShingleColorGrid />
        <WhyChooseUs />
        <CTASection />
        <FAQ />
        <CallbackForm />
      </main>
      <Footer />
      <FloatingEstimate />
    </div>
  );
}
