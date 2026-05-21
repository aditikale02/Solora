import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import heroMountainImg from "@/assets/images/hero-mountain-valley.png";

export default function PeacefulArrival() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-20%" });

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">

      {/* Landscape background with subtle grass-sway on the whole image */}
      <div className="absolute inset-0 grass-layer" style={{ backgroundImage: `url(${heroMountainImg})`, backgroundSize: "cover", backgroundPosition: "center 30%" }} />

      {/* Cloud drift layer — soft atmospheric haze */}
      <div className="absolute inset-0 cloud-layer pointer-events-none" style={{ background: "linear-gradient(100deg, transparent 0%, rgba(247,240,230,0.04) 40%, transparent 80%)" }} />

      {/* Top gradient — bleed from hero above */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(247,240,230,0.18) 0%, transparent 22%, transparent 65%, rgba(13,11,8,0.9) 100%)" }} />

      {/* Drifting particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full floating-particle animate-[floatUp_12s_linear_infinite]"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              background: `rgba(201,169,110,${0.12 + (i % 3) * 0.05})`,
              left: `${(i * 7.3) % 100}%`,
              top: `${70 + (i % 5) * 5}%`,
              animationDelay: `${i * 0.85}s`,
            }}
          />
        ))}
      </div>

      {/* Explorer — standing still, looking at horizon, lower-right */}
      <div className="absolute bottom-[16%] right-[18%] explorer-breathe" style={{ animation: "float 6s ease-in-out infinite" }}>
        <svg width="22" height="42" viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="rgba(247,240,230,0.65)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            {/* Head — tilted slightly upward */}
            <circle cx="14" cy="5" r="4" />
            {/* Body */}
            <path d="M14 9 L12 27 L16 27 L14 9" />
            {/* Arms down, peaceful */}
            <path d="M12 15 L9 23 M16 15 L19 23" />
            {/* Legs */}
            <path d="M12 27 L11 43 M16 27 L17 43" />
            {/* Backpack */}
            <path d="M8 13 C5 13 5 23 8 23" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* Quote container */}
      <div ref={quoteRef} className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-3xl">

        {/* Depth layer — dark halo behind text */}
        <motion.div
          className="absolute"
          style={{
            inset: "-40px -80px",
            background: "radial-gradient(ellipse at center, rgba(10,8,5,0.55) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(20px)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />

        {/* Environment glow — warm volumetric light behind the words */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "680px",
            height: "180px",
            background: "radial-gradient(ellipse at center, rgba(247,220,170,0.18) 0%, rgba(247,220,170,0.06) 45%, transparent 75%)",
            filter: "blur(32px)",
            animation: "quote-glow-breathe 4s ease-in-out infinite",
          }}
        />

        {/* The quote — emerges from fog */}
        <motion.p
          className="relative font-serif leading-[1.4] text-[#F7F0E6]"
          style={{
            fontWeight: 300,
            fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)",
            letterSpacing: "0.02em",
            color: "rgba(247,240,230,0.97)",
            textShadow: "0 0 80px rgba(247,220,170,0.4), 0 0 40px rgba(247,220,170,0.2), 0 2px 20px rgba(0,0,0,0.6), 0 4px 60px rgba(0,0,0,0.4)",
          }}
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          "Maybe freedom was waiting
          <br />
          <em className="italic" style={{ color: "#C9A96E" }}>outside your routine."</em>
        </motion.p>
      </div>

      {/* Bottom blend into Orbit section */}
      <div className="absolute bottom-0 left-0 right-0 h-52 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #0D0B08)" }} />
    </section>
  );
}
