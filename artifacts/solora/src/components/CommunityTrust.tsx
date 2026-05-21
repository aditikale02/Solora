import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const travelers = [
  { name: "Priya", city: "Mumbai" },
  { name: "Arjun", city: "Bangalore" },
  { name: "Meera", city: "Delhi" },
  { name: "Rahul", city: "Pune" },
  { name: "Sneha", city: "Chennai" },
  { name: "Kiran", city: "Hyderabad" },
  { name: "Aisha", city: "Kolkata" },
  { name: "Dev", city: "Jaipur" },
];

const stats = [
  { value: 12000, suffix: "+", label: "Solo Explorers" },
  { value: 180, suffix: "+", label: "Curated Destinations" },
  { value: 98, suffix: "%", label: "Would Travel Again" },
  { value: 4.9, suffix: "★", label: "Average Experience Rating", isFloat: true },
];

function AnimatedCounter({ value, suffix, isFloat }: { value: number; suffix: string; isFloat?: boolean; }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 2000;
    const raf = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(isFloat ? parseFloat((eased * value).toFixed(1)) : Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(raf);
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
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#0F0D0A" }}
    >
      {/* Grain */}
      <div className="absolute inset-0 grain opacity-[0.025] pointer-events-none" />

      {/* Sub-section A: Community */}
      <div className="text-center px-6 mb-24">
        <motion.h2
          className="font-serif text-5xl md:text-6xl text-[#F7F0E6] font-light mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          You Are Not Alone.
        </motion.h2>

        {/* Traveler faces strip */}
        <motion.div
          className="flex flex-wrap justify-center gap-10 mt-14 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {travelers.map((t, i) => (
            <motion.div
              key={t.name}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Avatar circle */}
              <div
                className="w-14 h-14 rounded-full border border-[rgba(201,169,110,0.3)] overflow-hidden relative"
                style={{
                  background: `linear-gradient(135deg, hsl(${(i * 45 + 20) % 360},30%,25%) 0%, hsl(${(i * 45 + 40) % 360},20%,35%) 100%)`,
                }}
              >
                {/* Silhouette */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="20" r="10" fill="rgba(247,240,230,0.35)" />
                  <ellipse cx="28" cy="46" rx="16" ry="12" fill="rgba(247,240,230,0.2)" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-sans text-xs text-[#F7F0E6]/80">{t.name}</p>
                <p className="font-sans text-[9px] tracking-widest text-[#C9A96E]/60 uppercase">{t.city}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Community tagline */}
        <motion.p
          className="mt-12 font-sans text-sm tracking-widest text-[#F7F0E6]/40 uppercase max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
        >
          12,000+ solo explorers. All of them were exactly where you are now.
        </motion.p>
      </div>

      {/* Divider */}
      <div className="max-w-xs mx-auto mb-24 h-[1px] bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.2)] to-transparent" />

      {/* Sub-section B: Stats */}
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-serif text-5xl md:text-6xl text-[#F7F0E6] font-light mb-3">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} isFloat={stat.isFloat} />
            </div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C9A96E]/70">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom blend */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #0F0D0A)" }} />
    </section>
  );
}
