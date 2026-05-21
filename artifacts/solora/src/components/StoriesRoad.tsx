import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stories = [
  {
    title: "I Left on a Tuesday with No Plan",
    location: "Spiti · 12 days alone",
    quote: "By day four, I stopped checking my phone. By day eight, I stopped missing home.",
    featured: true,
    bg: "linear-gradient(160deg, #1a2a3a 0%, #0d1f2d 40%, #2d4060 100%)",
    rotate: 0,
  },
  {
    title: "The Tea Stall I Never Left",
    location: "Mcleodganj · 3 weeks",
    quote: "Some places hold you without trying.",
    featured: false,
    bg: "linear-gradient(135deg, #1a1200 0%, #2d2000 60%, #4a3510 100%)",
    rotate: 1.5,
  },
  {
    title: "What the Rain in Meghalaya Taught Me",
    location: "Cherrapunji · 9 days",
    quote: "I cried twice. Neither time was from sadness.",
    featured: false,
    bg: "linear-gradient(135deg, #0d1f0d 0%, #1a3a1a 50%, #254a25 100%)",
    rotate: -1,
  },
  {
    title: "Arriving at Varanasi at 3am",
    location: "Varanasi · 7 days",
    quote: "The city was already awake. So, finally, was I.",
    featured: false,
    bg: "linear-gradient(135deg, #1a0d00 0%, #3a1a00 60%, #5a2800 100%)",
    rotate: 0.5,
  },
];

export default function StoriesRoad() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-8%" });

  const featured = stories[0];
  const supporting = stories.slice(1);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 md:px-12 overflow-hidden"
      style={{ background: "#0c0a08" }}
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Faint map texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(201,169,110,0.3) 60px, rgba(201,169,110,0.3) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(201,169,110,0.3) 60px, rgba(201,169,110,0.3) 61px)" }}
        />
        {/* Warm glow center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(201,169,110,0.4) 0%, transparent 70%)" }}
        />
      </div>

      {/* Section header */}
      <motion.div
        className="mb-16 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-serif text-4xl md:text-5xl text-[#F7F0E6] font-light">Stories From The Road</h2>
        <div className="mt-3 w-16 h-[1px] bg-[#C9A96E]/40" />
      </motion.div>

      {/* Organic layout */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

        {/* Featured story — large dominant */}
        <motion.div
          className="relative overflow-hidden rounded-sm cursor-none group"
          style={{ flex: "0 0 52%", minHeight: "520px", background: featured.bg }}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)" }} />
          {/* Location tag */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="font-sans text-[10px] tracking-widest text-[#C9A96E] uppercase">📍 {featured.location}</span>
          </div>
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h3 className="font-serif text-3xl md:text-4xl text-[#F7F0E6] font-light leading-tight mb-4">{featured.title}</h3>
            <p className="font-serif text-lg text-[#F7F0E6]/60 italic mb-8">"{featured.quote}"</p>
            <a href="#" className="font-sans text-xs tracking-widest text-[#C9A96E] flex items-center gap-2 group-hover:gap-4 transition-all duration-300 cursor-none">
              Read Story <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </motion.div>

        {/* Supporting stories — organic arrangement */}
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
                boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.08)",
              }}
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ rotate: 0, scale: 1.02, transition: { duration: 0.3 } }}
            >
              {/* Polaroid-style inner border */}
              <div className="absolute inset-[6px] border border-[rgba(247,240,230,0.06)] rounded-sm pointer-events-none" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65) 100%)" }} />

              {/* Paper texture top strip */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-[rgba(247,240,230,0.04)] border-b border-[rgba(247,240,230,0.05)]" />

              <div className="relative p-5 pt-6 h-full flex flex-col justify-between">
                <span className="font-sans text-[9px] tracking-widest text-[#C9A96E]/70 uppercase">📍 {story.location}</span>
                <div className="mt-auto">
                  <h4 className="font-serif text-base text-[#F7F0E6]/90 leading-snug mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >{story.title}</h4>
                  <p className="font-sans text-[10px] text-[#F7F0E6]/40 italic">"{story.quote}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #0c0a08)" }} />
    </section>
  );
}
