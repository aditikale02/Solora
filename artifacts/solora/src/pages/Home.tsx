import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PeacefulArrival from "@/components/PeacefulArrival";
import EmotionalOrbit from "@/components/EmotionalOrbit";
import ExplorerTransition from "@/components/ExplorerTransition";
import CinematicDestinations from "@/components/CinematicDestinations";
import MemoryScroller from "@/components/MemoryScroller";
import StoriesRoad from "@/components/StoriesRoad";
import CommunityTrust from "@/components/CommunityTrust";
import TransformationScene from "@/components/TransformationScene";
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
    <main className="bg-[#0F0D0A] text-[#F7F0E6] min-h-screen font-sans relative overflow-x-hidden" style={{ cursor: "none" }}>
      {/* Global film grain */}
      <div className="grain pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-[0.025]" />

      <CustomCursor />
      <Navbar />

      {/* 1. Cinematic Hero */}
      <HeroSection />

      {/* 2. Peaceful World Arrival */}
      <PeacefulArrival />

      {/* 3. Emotional Orbit System */}
      <EmotionalOrbit />

      {/* 4. Explorer Journey Transition */}
      <ExplorerTransition />

      {/* 5. Cinematic India Destinations */}
      <CinematicDestinations />

      {/* 6. Memory Scroller */}
      <MemoryScroller />

      {/* 7. Stories From The Road */}
      <StoriesRoad />

      {/* 8. Community & Trust + Stats */}
      <CommunityTrust />

      {/* 9. Final Transformation Scene */}
      <TransformationScene />

      {/* 10. Cinematic Footer */}
      <Footer />
    </main>
  );
}
