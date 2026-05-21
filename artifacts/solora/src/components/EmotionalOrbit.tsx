import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emotions = [
  { label: "Peace",     angle: 0,   bg: "linear-gradient(135deg,#1a2a3a 0%,#2d4a6a 40%,#4a7fa0 100%)",  destinations: "Coorg · Mcleodganj · Pondicherry" },
  { label: "Healing",   angle: 60,  bg: "linear-gradient(135deg,#0d1f0d 0%,#1a3a1a 40%,#2d5c2d 100%)",  destinations: "Kerala · Coorg · Pelling" },
  { label: "Adventure", angle: 120, bg: "linear-gradient(135deg,#1a1200 0%,#3a2800 40%,#6a4a00 100%)",   destinations: "Leh · Zanskar · Chopta" },
  { label: "Freedom",   angle: 180, bg: "linear-gradient(135deg,#0d1a2a 0%,#0a2a4a 40%,#0d4a6a 100%)",  destinations: "Gokarna · Varkala · Rameshwaram" },
  { label: "Silence",   angle: 240, bg: "linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 40%,#3a3840 100%)",   destinations: "Spiti · Zuluk · Gurez" },
  { label: "Escape",    angle: 300, bg: "linear-gradient(135deg,#0d0d1a 0%,#1a1a3a 40%,#2d2d5a 100%)",   destinations: "Kasol · Tirthan · Bir Billing" },
];

const ORBIT_RADIUS = 220;

export default function EmotionalOrbit() {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = emotions.find((e) => e.label === hovered);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center" style={{ background: "#0F0D0A" }}>

      {/* Dynamic bg per emotion */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.label}
            className="absolute inset-0"
            style={{ background: active.bg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")" }}
      />

      {/* Explorer sitting, cross-legged, looking up at orbit — lower center */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 pointer-events-none opacity-40">
        <svg width="34" height="38" viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="explorer-breathe" style={{ animation: "float 7s ease-in-out infinite" }}>
          <g stroke="rgba(247,240,230,0.85)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            {/* Head tilted upward */}
            <circle cx="22" cy="6" r="4.5" />
            {/* Body */}
            <path d="M22 11 L20 24 L24 24 L22 11" />
            {/* Arms out to sides, open */}
            <path d="M20 16 L10 22 M24 16 L34 22" />
            {/* Cross-legged seated */}
            <path d="M20 24 L12 34 L28 34 L22 24" />
            <path d="M12 34 L8 40 M28 34 L32 40" />
            {/* Map on lap */}
            <rect x="15" y="28" width="14" height="8" rx="1" stroke="rgba(201,169,110,0.55)" strokeWidth="1" />
            <path d="M17 31 L27 31 M17 33 L24 33" stroke="rgba(201,169,110,0.4)" strokeWidth="0.7" />
          </g>
        </svg>
      </div>

      {/* Orbit system */}
      <div
        className="relative z-20 flex items-center justify-center"
        style={{ width: `${ORBIT_RADIUS * 2 + 160}px`, height: `${ORBIT_RADIUS * 2 + 160}px` }}
      >
        {/* Faint orbit ring */}
        <div
          className="absolute rounded-full border border-[rgba(201,169,110,0.07)]"
          style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        />

        {/* Center question */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-30 select-none" style={{ width: "240px" }}>
          <AnimatePresence mode="wait">
            {hovered ? (
              <motion.p key={hovered} className="font-serif text-3xl md:text-4xl leading-tight text-[#F7F0E6] italic"
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35 }}>
                You need<br /><span className="text-[#C9A96E]">{hovered}.</span>
              </motion.p>
            ) : (
              <motion.p key="default" className="font-serif text-2xl md:text-3xl leading-tight text-[#F7F0E6]/75"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}>
                What are you<br /><em className="text-[#C9A96E]/75">searching for?</em>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Orbit nodes */}
        {emotions.map((emotion) => {
          const rad = (emotion.angle * Math.PI) / 180;
          const x = Math.cos(rad) * ORBIT_RADIUS;
          const y = Math.sin(rad) * ORBIT_RADIUS;
          const isActive = hovered === emotion.label;
          const isDimmed = hovered !== null && !isActive;

          return (
            <motion.div
              key={emotion.label}
              className="absolute cursor-none"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%,-50%)" }}
              onMouseEnter={() => setHovered(emotion.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div
                className="relative px-7 py-3 rounded-[100px] font-sans text-xs tracking-[0.25em] uppercase select-none"
                style={{
                  background: "rgba(255,248,235,0.05)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid rgba(201,169,110,${isActive ? 0.6 : 0.22})`,
                  color: `rgba(247,240,230,${isDimmed ? 0.28 : 0.82})`,
                }}
                animate={{
                  scale: isActive ? 1.14 : isDimmed ? 0.88 : 1,
                  boxShadow: isActive ? "0 0 24px rgba(201,169,110,0.28), 0 0 60px rgba(201,169,110,0.1)" : "none",
                }}
                transition={{ duration: 0.3 }}
              >
                {emotion.label}
              </motion.div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute text-center whitespace-nowrap font-sans text-[10px] tracking-widest text-[#C9A96E]/65 pointer-events-none"
                    style={{ top: "110%", left: "50%", transform: "translateX(-50%)" }}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.3 }}
                  >
                    {emotion.destinations}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Top/bottom fades */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom,#0D0B08,transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom,transparent,#0F0D0A)" }} />
    </section>
  );
}
