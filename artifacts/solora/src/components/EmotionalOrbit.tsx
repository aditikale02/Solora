import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emotions = [
  {
    label: "Peace",
    angle: 0,
    bg: "linear-gradient(135deg, #1a2a3a 0%, #2d4a6a 40%, #4a7fa0 100%)",
    destinations: "Coorg · Mcleodganj · Pondicherry",
  },
  {
    label: "Healing",
    angle: 60,
    bg: "linear-gradient(135deg, #0d1f0d 0%, #1a3a1a 40%, #2d5c2d 100%)",
    destinations: "Kerala · Coorg · Pelling",
  },
  {
    label: "Adventure",
    angle: 120,
    bg: "linear-gradient(135deg, #1a1200 0%, #3a2800 40%, #6a4a00 100%)",
    destinations: "Leh · Zanskar · Chopta",
  },
  {
    label: "Freedom",
    angle: 180,
    bg: "linear-gradient(135deg, #0d1a2a 0%, #0a2a4a 40%, #0d4a6a 100%)",
    destinations: "Gokarna · Varkala · Rameshwaram",
  },
  {
    label: "Silence",
    angle: 240,
    bg: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 40%, #3a3840 100%)",
    destinations: "Spiti · Zuluk · Gurez",
  },
  {
    label: "Escape",
    angle: 300,
    bg: "linear-gradient(135deg, #0d0d1a 0%, #1a1a3a 40%, #2d2d5a 100%)",
    destinations: "Kasol · Tirthan · Bir Billing",
  },
];

const ORBIT_RADIUS = 220;

export default function EmotionalOrbit() {
  const [hovered, setHovered] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const activeEmotion = emotions.find((e) => e.label === hovered);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: "#0F0D0A" }}
    >
      {/* Dynamic background per hovered emotion */}
      <AnimatePresence>
        {activeEmotion && (
          <motion.div
            key={activeEmotion.label}
            className="absolute inset-0"
            style={{ background: activeEmotion.bg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Grain */}
      <div className="absolute inset-0 grain opacity-[0.03] pointer-events-none z-10" />

      {/* Explorer at bottom edge */}
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
        <svg width="22" height="40" viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="rgba(247,240,230,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="14" cy="6" r="4" />
            <path d="M14 10 L12 28 L16 28 L14 10" />
            <path d="M8 14 L6 24 M20 14 L22 24" />
            <path d="M12 28 L10 44 M16 28 L18 44" />
          </g>
        </svg>
      </div>

      {/* Orbit system */}
      <div className="relative z-20 flex items-center justify-center" style={{ width: `${ORBIT_RADIUS * 2 + 140}px`, height: `${ORBIT_RADIUS * 2 + 140}px` }}>

        {/* Orbit ring (faint) */}
        <div
          className="absolute rounded-full border border-[rgba(201,169,110,0.08)]"
          style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        />

        {/* Center question */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-30 select-none" style={{ width: "240px" }}>
          <AnimatePresence mode="wait">
            {hovered ? (
              <motion.p
                key={hovered}
                className="font-serif text-3xl md:text-4xl leading-tight text-[#F7F0E6] italic"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35 }}
              >
                You need<br />
                <span className="text-[#C9A96E]">{hovered}.</span>
              </motion.p>
            ) : (
              <motion.p
                key="default"
                className="font-serif text-2xl md:text-3xl leading-tight text-[#F7F0E6]/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{ animation: "pulse 4s ease-in-out infinite" }}
              >
                What are you<br />
                <em className="text-[#C9A96E]/80">searching for?</em>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Orbit nodes */}
        {emotions.map((emotion, i) => {
          const rad = (emotion.angle * Math.PI) / 180;
          const x = Math.cos(rad) * ORBIT_RADIUS;
          const y = Math.sin(rad) * ORBIT_RADIUS;
          const isActive = hovered === emotion.label;
          const isDimmed = hovered !== null && !isActive;

          return (
            <motion.div
              key={emotion.label}
              className="absolute cursor-none"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHovered(emotion.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div
                className="relative px-7 py-3 rounded-[100px] font-sans text-xs tracking-[0.25em] uppercase select-none"
                style={{
                  background: "rgba(255,248,235,0.05)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid rgba(201,169,110,${isActive ? 0.6 : 0.25})`,
                  color: `rgba(247,240,230,${isDimmed ? 0.3 : 0.85})`,
                }}
                animate={{
                  scale: isActive ? 1.15 : isDimmed ? 0.9 : 1,
                  boxShadow: isActive ? "0 0 24px rgba(201,169,110,0.3), 0 0 60px rgba(201,169,110,0.1)" : "none",
                }}
                transition={{ duration: 0.3 }}
              >
                {emotion.label}
              </motion.div>

              {/* Floating destination whisper */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute text-center whitespace-nowrap font-sans text-[10px] tracking-widest text-[#C9A96E]/70 pointer-events-none"
                    style={{
                      top: "110%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
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

      {/* Top fade from previous section */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, #0F0D0A, transparent)" }} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #0F0D0A)" }} />
    </section>
  );
}
