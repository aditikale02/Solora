import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const travelers = [
  { name: "Priya",  city: "Mumbai" },
  { name: "Arjun",  city: "Bangalore" },
  { name: "Meera",  city: "Delhi" },
  { name: "Rahul",  city: "Pune" },
  { name: "Sneha",  city: "Chennai" },
  { name: "Kiran",  city: "Hyderabad" },
  { name: "Aisha",  city: "Kolkata" },
  { name: "Dev",    city: "Jaipur" },
];

const stats = [
  { value: 12000, suffix: "+",  label: "Solo Explorers" },
  { value: 180,   suffix: "+",  label: "Curated Destinations" },
  { value: 98,    suffix: "%",  label: "Would Travel Again" },
  { value: 4.9,   suffix: "★", label: "Avg Experience Rating", isFloat: true },
];

function AnimatedCounter({ value, suffix, isFloat }: { value: number; suffix: string; isFloat?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const dur = 2000;
    const raf = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(isFloat ? parseFloat((eased * value).toFixed(1)) : Math.floor(eased * value));
      if (t < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, value, isFloat]);

  return (
    <span ref={ref}>
      {isFloat ? count.toFixed(1) : count.toLocaleString()}{suffix}
    </span>
  );
}

export default function CommunityTrust() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-8%" });

  return (
    <section
      id="community"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(180deg,#F7F4EF 0%,#F5F0E8 100%)" }}
    >
      {/* Top blend — from dark StoriesRoad */}
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to bottom,#0c0a08,transparent)" }} />

      {/* Subtle grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.012]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")" }}
      />

      {/* Sub-section A — Community */}
      <div className="text-center px-6 mb-24 relative z-10 mt-8">
        <motion.h2
          className="font-serif text-5xl md:text-6xl font-light mb-6 text-[#1A1714]"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          You Are Not Alone.
        </motion.h2>

        {/* Traveler faces */}
        <motion.div
          className="flex flex-wrap justify-center gap-10 mt-14 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {travelers.map((t, i) => (
            <motion.div key={t.name} className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}>
              <div
                className="w-14 h-14 rounded-full overflow-hidden relative"
                style={{
                  background: `linear-gradient(135deg, hsl(${(i * 38 + 20) % 360},22%,72%) 0%, hsl(${(i * 38 + 40) % 360},18%,62%) 100%)`,
                  boxShadow: "0 4px 16px rgba(26,23,20,0.1), 0 0 0 1px rgba(201,169,110,0.2)",
                }}
              >
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="20" r="10" fill="rgba(26,23,20,0.18)" />
                  <ellipse cx="28" cy="46" rx="16" ry="12" fill="rgba(26,23,20,0.12)" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-sans text-xs text-[rgba(26,23,20,0.75)]">{t.name}</p>
                <p className="font-sans text-[9px] tracking-widest text-[#C9A96E] uppercase">{t.city}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mt-12 font-sans text-sm tracking-widest text-[rgba(26,23,20,0.42)] uppercase max-w-lg mx-auto"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 1 }}
        >
          12,000+ solo explorers. All of them were exactly where you are now.
        </motion.p>
      </div>

      {/* Divider */}
      <div className="max-w-xs mx-auto mb-24 h-[1px] bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.25)] to-transparent" />

      {/* Sub-section B — Stats */}
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} className="text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}>

            {/* Stat card */}
            <div
              className="rounded-xl py-6 px-4 mb-4"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(201,169,110,0.15)",
                boxShadow: "0 6px 24px rgba(26,23,20,0.07)",
              }}
            >
              <div className="font-serif text-4xl md:text-5xl text-[#1A1714] font-light stat-number">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isFloat={stat.isFloat} />
              </div>
            </div>
            <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-[#C9A96E]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom blend — into dark TransformationScene */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to bottom,transparent,#0F0D0A)" }} />
    </section>
  );
}
