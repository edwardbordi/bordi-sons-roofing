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
import { homeContent } from "@/content/home";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <ScrollNav />
      <main>
        <Hero {...homeContent.hero} />
        <Testimonials {...homeContent.testimonials} />
        <ScrollAnimation {...homeContent.roofAnimation} />
        <Features {...homeContent.features} />
        <ShingleColorGrid {...homeContent.shingles} />
        <WhyChooseUs {...homeContent.whyChooseUs} />
        <CTASection {...homeContent.cta} />
        <FAQ {...homeContent.faq} />
        <CallbackForm />
      </main>
      <Footer />
      <FloatingEstimate />
    </div>
  );
}
