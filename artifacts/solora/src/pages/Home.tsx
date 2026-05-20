import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import UnderstandSection from "@/components/UnderstandSection";
import DestinationsSection from "@/components/DestinationsSection";
import StatsSection from "@/components/StatsSection";
import MemoryCollage from "@/components/MemoryCollage";
import QuoteTransition from "@/components/QuoteTransition";
import StoriesSection from "@/components/StoriesSection";
import CommunitySection from "@/components/CommunitySection";
import PartnersMarquee from "@/components/PartnersMarquee";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-[#F7F2EC] text-[#1A1714] min-h-screen font-sans relative overflow-x-hidden selection:bg-[#C9A96E] selection:text-[#1A1714]">
      <div className="grain pointer-events-none fixed inset-0 z-50 mix-blend-overlay"></div>
      <CustomCursor />
      
      <Navbar />
      
      <HeroSection />
      
      <ProblemSection />
      
      <UnderstandSection />
      
      <DestinationsSection />
      
      <QuoteTransition text="You don't need permission to begin again." />
      
      <StatsSection />
      
      <MemoryCollage />
      
      <QuoteTransition text="Some places heal what words cannot." />
      
      <StoriesSection />
      
      <CommunitySection />
      
      <QuoteTransition text="The version of you that travels alone — meet them." />
      
      <PartnersMarquee />
      
      <FinalCTA />
      
      <Footer />
    </main>
  );
}
