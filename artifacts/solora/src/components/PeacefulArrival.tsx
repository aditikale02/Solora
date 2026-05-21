import { motion } from "framer-motion";
import heroMountainImg from "@/assets/images/hero-mountain-valley.png";

export default function PeacefulArrival() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Landscape background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroMountainImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      />

      {/* Gradient blend from hero above, soft fade to dark below */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(247,240,230,0.18) 0%, transparent 25%, transparent 65%, rgba(15,13,10,0.85) 100%)" }} />

      {/* Atmospheric mist layer */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(247,240,230,0.04) 0%, transparent 70%)" }} />

      {/* Drifting particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[rgba(201,169,110,0.2)] animate-[floatUp_12s_linear_infinite]"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${(i * 7.1) % 100}%`,
              top: `${70 + (i % 5) * 6}%`,
              animationDelay: `${i * 0.9}s`,
            }}
          />
        ))}
      </div>

      {/* Explorer silhouette — standing still, looking at horizon */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2">
        <svg width="28" height="52" viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-[float_6s_ease-in-out_infinite]">
          <g stroke="rgba(247,240,230,0.75)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="14" cy="6" r="4" />
            <path d="M14 10 L12 28 L16 28 L14 10" />
            <path d="M8 14 L6 24 M20 14 L22 24" />
            <path d="M12 28 L10 44 M16 28 L18 44" />
            <path d="M6 20 C3 20 3 30 6 30" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* The single quote */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-3xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className="font-serif text-[4.5vw] md:text-[3.2vw] leading-[1.35] font-light text-[#F7F0E6]"
          style={{ textShadow: "0 4px 40px rgba(0,0,0,0.4)" }}
        >
          "Maybe freedom was waiting
          <br />
          <em className="text-[#C9A96E]">outside your routine.</em>"
        </p>
      </motion.div>

      {/* Bottom gradient bleed into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #0F0D0A)" }} />
    </section>
  );
}
