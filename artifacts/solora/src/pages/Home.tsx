import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PeacefulArrival from "@/components/PeacefulArrival";
import EmotionalOrbit from "@/components/EmotionalOrbit";
import ExplorerTransition from "@/components/ExplorerTransition";
import TripSelector from "@/components/TripSelector";
import React, { Suspense } from "react";
const CinematicDestinations = React.lazy(() => import("@/components/CinematicDestinations"));
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

    return () => { lenis.destroy(); };
  }, []);

  return (
    <main className="bg-[#0F0D0A] text-[#F7F0E6] min-h-screen font-sans relative overflow-x-hidden" style={{ cursor: "none" }}>
      {/* Global film grain */}
      <div className="grain pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-[0.025]" />

      <CustomCursor />
      <Navbar />

      {/* 1. Cinematic Hero */}
      <section id="hero" className="contents">
        <HeroSection />
      </section>

      {/* 2. Peaceful World Arrival */}
      <PeacefulArrival />

      {/* 3. Emotional Orbit System */}
      <EmotionalOrbit />

      {/* 4. Explorer Journey Transition */}
      <ExplorerTransition />

      {/* 5. Trip Selector — destination + date picker */}
      <TripSelector />

      {/* 6. Cinematic India Destinations — id="destinations" */}
      <Suspense fallback={<div id="destinations" className="min-h-[40vh] bg-[#F5F0E8]" />}> 
        <CinematicDestinations />
      </Suspense>

      {/* 7. Memory Scroller — id="memories" */}
      <MemoryScroller />

      {/* 8. Stories From The Road */}
      <div id="stories">
        <StoriesRoad />
      </div>

      {/* 9. Community & Trust + Stats — id="community" */}
      <CommunityTrust />

      {/* 10. Final Transformation Scene */}
      <div id="transformation">
        <TransformationScene />
      </div>

      {/* 11. Cinematic Footer */}
      <div id="footer">
        <Footer />
      </div>
    </main>
  );
}
