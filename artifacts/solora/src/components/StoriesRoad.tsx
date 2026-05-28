import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stories = [
  {
    title: "I Left on a Tuesday with No Plan",
    location: "Spiti · 12 days alone",
    quote: "By day four, I stopped checking my phone. By day eight, I stopped missing home.",
    featured: true,
    bg: "linear-gradient(160deg,#1a2a3a 0%,#0d1f2d 40%,#2d4060 100%)",
    rotate: 0,
  },
  {
    title: "The Tea Stall I Never Left",
    location: "Mcleodganj · 3 weeks",
    quote: "Some places hold you without trying.",
    featured: false,
    bg: "linear-gradient(135deg,#1a1200 0%,#2d2000 60%,#4a3510 100%)",
    rotate: 1.5,
  },
  {
    title: "What the Rain in Meghalaya Taught Me",
    location: "Cherrapunji · 9 days",
    quote: "I cried twice. Neither time was from sadness.",
    featured: false,
    bg: "linear-gradient(135deg,#0d1f0d 0%,#1a3a1a 50%,#254a25 100%)",
    rotate: -1,
  },
  {
    title: "Arriving at Varanasi at 3am",
    location: "Varanasi · 7 days",
    quote: "The city was already awake. So, finally, was I.",
    featured: false,
    bg: "linear-gradient(135deg,#1a0d00 0%,#3a1a00 60%,#5a2800 100%)",
    rotate: 0.5,
  },
];

/* Animated campfire embers */
function Campfire() {
  return (
    <div className="relative" style={{ width: "28px", height: "28px" }}>
      {/* Log base */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
        <path d="M4 22 L14 14 L24 22" stroke="rgba(100,60,20,0.9)" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 24 L20 20" stroke="rgba(80,40,10,0.8)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Flame */}
        <path d="M14 18 C12 15 13 10 14 8 C15 10 16 15 14 18Z" fill="rgba(201,120,30,0.7)" />
        <path d="M14 17 C13 15 13.5 12 14 11 C14.5 12 15 15 14 17Z" fill="rgba(247,180,50,0.6)" />
      </svg>
      {/* Rising embers */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="ember absolute rounded-full bg-[rgba(201,120,30,0.85)]"
          style={{
            width: "2.5px", height: "2.5px",
            left: `${8 + i * 4}px`, bottom: "14px",
            animation: `ember-rise 2.5s ease-out infinite`,
            animationDelay: `${i * 0.85}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function StoriesRoad() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-8%" });

  const featured = stories[0];
  const supporting = stories.slice(1);

  return (
    <>
      {/* Wave Brush Divider - Premium transition from light to dark */}
      <div className="relative w-full overflow-hidden" style={{ background: "#FDFBF7" }}>
        <svg
          className="w-full"
          style={{ height: "120px", display: "block" }}
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDFBF7" stopOpacity="1" />
              <stop offset="40%" stopColor="#F5EFE3" stopOpacity="1" />
              <stop offset="100%" stopColor="#0c0a08" stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Organic wave brush stroke */}
          <path
            d="M0,40 C120,25 240,55 360,45 C480,35 600,60 720,50 C840,40 960,65 1080,55 C1200,45 1320,70 1440,60 L1440,120 L0,120 Z"
            fill="url(#waveGradient)"
            opacity="0.95"
          />
          {/* Secondary softer wave for depth */}
          <path
            d="M0,60 C150,50 300,75 450,65 C600,55 750,80 900,70 C1050,60 1200,85 1350,75 C1380,73 1410,71 1440,70 L1440,120 L0,120 Z"
            fill="#0c0a08"
            opacity="0.7"
          />
          {/* Base layer */}
          <path
            d="M0,85 C180,75 360,95 540,85 C720,75 900,95 1080,85 C1260,75 1350,90 1440,85 L1440,120 L0,120 Z"
            fill="#0c0a08"
          />
        </svg>
      </div>

      <section
        ref={sectionRef}
        className="relative px-6 md:px-12 overflow-hidden"
        style={{ background: "#0c0a08", paddingTop: "6rem", paddingBottom: "7rem" }}
      >
      {/* Background atmosphere — faint map grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(201,169,110,0.3) 60px,rgba(201,169,110,0.3) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(201,169,110,0.3) 60px,rgba(201,169,110,0.3) 61px)" }}
      />
      {/* Warm center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(201,169,110,0.06) 0%,transparent 70%)", filter: "blur(40px)" }}
      />

      {/* Section header - improved spacing */}
      <motion.div
        className="mb-20 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-serif text-4xl md:text-5xl text-[#F7F0E6] font-light">Stories From The Road</h2>
        <div className="mt-4 w-20 h-px bg-gradient-to-r from-[#C9A96E] to-transparent" />
      </motion.div>

      {/* Organic layout */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

        {/* Featured story */}
        <motion.div
          className="relative overflow-hidden rounded-sm cursor-none group"
          style={{ flex: "0 0 52%", minHeight: "520px", background: featured.bg }}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.72) 100%)" }} />
          <div className="absolute top-6 left-6">
            <span className="font-sans text-[10px] tracking-widest text-[#C9A96E] uppercase">📍 {featured.location}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h3 className="font-serif text-3xl md:text-4xl text-[#F7F0E6] font-light leading-tight mb-4">{featured.title}</h3>
            <p className="font-serif text-lg text-[#F7F0E6]/60 italic mb-8">"{featured.quote}"</p>
            <a href="/packages" className="font-sans text-xs tracking-widest text-[#C9A96E] flex items-center gap-2 group-hover:gap-4 transition-all duration-300 cursor-none">
              Read Story <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </motion.div>

        {/* Supporting stories */}
        <div className="flex flex-col gap-6 flex-1">
          {supporting.map((story, i) => (
            <motion.div
              key={story.title}
              className="relative overflow-hidden cursor-none group"
              style={{
                background: story.bg,
                minHeight: "148px",
                borderRadius: "4px",
                transform: `rotate(${story.rotate}deg)`,
                boxShadow: "0 12px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(201,169,110,0.07)",
              }}
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ rotate: 0, scale: 1.02, transition: { duration: 0.3 } }}
            >
              {/* Polaroid inner border */}
              <div className="absolute inset-[6px] border border-[rgba(247,240,230,0.06)] rounded-sm pointer-events-none" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.65) 100%)" }} />
              {/* Paper top strip */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-[rgba(247,240,230,0.04)] border-b border-[rgba(247,240,230,0.04)]" />

              <div className="relative p-5 pt-6 h-full flex flex-col justify-between">
                <span className="font-sans text-[9px] tracking-widest text-[#C9A96E]/70 uppercase">📍 {story.location}</span>
                <div className="mt-auto">
                  <h4 className="font-serif text-base text-[#F7F0E6]/90 leading-snug mb-1">{story.title}</h4>
                  <p className="font-sans text-[10px] text-[#F7F0E6]/40 italic">"{story.quote}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Explorer with journal + campfire — bottom corner */}
      <motion.div
        className="absolute bottom-12 right-10 flex items-end gap-3 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.8 }}
      >
        {/* Campfire */}
        <Campfire />

        {/* Explorer sitting with journal */}
        <svg width="32" height="36" viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="explorer-breathe" style={{ animation: "float 6s ease-in-out infinite" }}>
          <g stroke="rgba(247,240,230,0.5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            {/* Head */}
            <circle cx="20" cy="6" r="4" />
            {/* Sitting body */}
            <path d="M20 10 L18 24 L22 24 L20 10" />
            {/* Arms — one holding journal */}
            <path d="M18 14 L10 20 M22 14 L28 18" />
            {/* Legs crossed */}
            <path d="M18 24 L10 34 M22 24 L30 34" />
            <path d="M10 34 L30 34" />
            {/* Journal */}
            <rect x="11" y="18" width="10" height="7" rx="1" stroke="rgba(201,169,110,0.6)" strokeWidth="1" />
            <path d="M13 21 L19 21 M13 23 L17 23" stroke="rgba(201,169,110,0.4)" strokeWidth="0.8" />
          </g>
        </svg>
      </motion.div>

      {/* Top blend removed - wave divider handles transition */}
      {/* Bottom blend - softer transition to CommunityTrust */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to bottom,transparent,rgba(12,10,8,0.6))" }} />
    </section>
    </>
  );
}
