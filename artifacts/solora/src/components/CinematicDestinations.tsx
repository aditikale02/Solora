import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import destSilenceImg from "@/assets/images/dest-silence.jpg";
import destHealingImg from "@/assets/images/dest-healing.jpg";
import destDiscoveryImg from "@/assets/images/dest-discovery.jpg";
import destAdventureImg from "@/assets/images/dest-adventure.jpg";
import destSlowImg from "@/assets/images/dest-slow.jpg";

const destinations = [
  { name: "Spiti Valley",  category: "For Silence",       line: "Where the mountains ask you to be still.",        img: destSilenceImg,   layout: "image-left"  },
  { name: "Meghalaya",     category: "For Healing",        line: "Rain here doesn't fall. It forgives.",            img: destHealingImg,   layout: "image-right" },
  { name: "Hampi",         category: "For Self-Discovery", line: "Ancient stones that understand wandering.",       img: destDiscoveryImg, layout: "full-bleed"  },
  { name: "Kasol",         category: "For Escape",         line: "The kind of quiet you've been craving.",          img: destAdventureImg, layout: "image-left"  },
  { name: "Varanasi",      category: "For Depth",          line: "Every ghat holds a story you haven't heard yet.", img: null,             layout: "image-right" },
  { name: "Pondicherry",   category: "For Slow Living",    line: "French streets. Sea breeze. No rush.",            img: destSlowImg,      layout: "image-left"  },
] as const;

function ExplorerSilhouette() {
  return (
    <svg width="14" height="26" viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="explorer-breathe" style={{ animation: "float 7s ease-in-out infinite" }}>
      <g stroke="rgba(247,240,230,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="6" r="4" />
        <path d="M14 10 L12 28 L16 28 L14 10" />
        <path d="M8 14 L6 24 M20 14 L22 24" />
        <path d="M12 28 L10 44 M16 28 L18 44" />
        <path d="M6 18 C3 18 3 28 6 28" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function DestPanel({ dest, index }: { dest: (typeof destinations)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const imgBg = dest.img
    ? `url(${dest.img})`
    : "linear-gradient(135deg,#1a1200 0%,#3a2800 60%,#6a4000 100%)";

  if (dest.layout === "full-bleed") {
    return (
      <motion.div ref={ref} className="relative w-full overflow-hidden group border-0" style={{ height: "80vh" }}
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1 }}>
        <div className="absolute inset-0" style={{ backgroundImage: imgBg, backgroundSize: "cover", backgroundPosition: "center", animation: "kenBurns 20s ease-in-out infinite alternate" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(15,13,10,0.25) 0%,rgba(15,13,10,0.65) 100%)" }} />
        <div className="absolute bottom-[36%] left-[58%] opacity-70"><ExplorerSilhouette /></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom,transparent,rgba(15,13,10,0.7))" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-4">{dest.category}</p>
          <h3 className="font-serif text-6xl md:text-7xl text-[#F7F0E6] mb-5 font-light">{dest.name}</h3>
          <motion.p className="font-serif text-xl md:text-2xl text-[#F7F0E6]/65 italic max-w-lg mb-8"
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            "{dest.line}"
          </motion.p>
          <a href="/packages" className="font-sans text-sm tracking-widest text-[#C9A96E] group/link flex items-center gap-2 hover:gap-4 transition-all duration-300 cursor-none">
            Explore <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
          </a>
        </div>
      </motion.div>
    );
  }

  const isLeft = dest.layout === "image-left";

  return (
    <motion.div ref={ref} className="flex flex-col md:flex-row w-full overflow-hidden group border-0" style={{ minHeight: "60vh" }}
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}>

      {/* Image */}
      <div className={`relative overflow-hidden border-0 ${isLeft ? "md:order-1" : "md:order-2"}`} style={{ flex: "0 0 58%", minHeight: "45vh" }}>
        <div
          className="absolute inset-0 group-hover:scale-[1.02] group-hover:brightness-[1.04] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ backgroundImage: imgBg, backgroundSize: "cover", backgroundPosition: "center", animation: "kenBurns 22s ease-in-out infinite alternate" }}
        />
        {/* Fog at image-content boundary */}
        <div className="absolute inset-y-0 pointer-events-none" style={{
          [isLeft ? "right" : "left"]: 0, width: "32%",
          background: isLeft ? "linear-gradient(to right,transparent,#F5F0E8)" : "linear-gradient(to left,transparent,#F5F0E8)",
        }} />
        <div className="absolute bottom-[38%] left-1/2 -translate-x-1/2 opacity-55 pointer-events-none">
          <ExplorerSilhouette />
        </div>
      </div>

      {/* Content — light background */}
      <div
        className={`flex flex-col justify-center px-10 md:px-14 py-14 border-0 ${isLeft ? "md:order-2" : "md:order-1"}`}
        style={{ flex: "0 0 42%", background: "#F5F0E8" }}
      >
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#C9A96E] mb-5">{dest.category}</p>
        <h3 className="font-serif text-4xl md:text-5xl text-[#1A1714] font-light mb-5 leading-tight destination-name">{dest.name}</h3>
        <motion.p className="font-serif text-lg text-[rgba(26,23,20,0.58)] italic leading-relaxed mb-10"
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          "{dest.line}"
        </motion.p>
        <a href="/packages" className="font-sans text-xs tracking-widest text-[#C9A96E] group/link flex items-center gap-2 hover:gap-4 transition-all duration-300 cursor-none w-fit">
          Explore <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
        </a>
      </div>
    </motion.div>
  );
}

export default function CinematicDestinations() {
  return (
    <section id="destinations" className="relative" style={{ background: "#F5F0E8" }}>

      {/* Section header — on light background */}
      <div className="text-center py-20 px-6">
        <motion.p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C9A96E] mb-5"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          180+ Destinations
        </motion.p>
        <motion.h2 className="font-serif text-5xl md:text-6xl text-[#1A1714] font-light"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          Choose Your World
        </motion.h2>
      </div>

      <div className="flex flex-col -space-y-px">
        {destinations.map((dest, i) => (
          <DestPanel key={dest.name} dest={dest} index={i} />
        ))}
      </div>

      {/* Bottom blend — into light MemoryScroller */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to bottom,transparent,#FDFBF7)" }} />
    </section>
  );
}
