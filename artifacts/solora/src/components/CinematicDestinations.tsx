import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import destSilenceImg from "@/assets/images/dest-silence.png";
import destHealingImg from "@/assets/images/dest-healing.png";
import destDiscoveryImg from "@/assets/images/dest-discovery.png";
import destAdventureImg from "@/assets/images/dest-adventure.png";
import destSlowImg from "@/assets/images/dest-slow.png";

const destinations = [
  {
    name: "Spiti Valley",
    category: "For Silence",
    line: "Where the mountains ask you to be still.",
    img: destSilenceImg,
    layout: "image-left",
  },
  {
    name: "Meghalaya",
    category: "For Healing",
    line: "Rain here doesn't fall. It forgives.",
    img: destHealingImg,
    layout: "image-right",
  },
  {
    name: "Hampi",
    category: "For Self-Discovery",
    line: "Ancient stones that understand wandering.",
    img: destDiscoveryImg,
    layout: "full-bleed",
  },
  {
    name: "Kasol",
    category: "For Escape",
    line: "The kind of quiet you've been craving.",
    img: destAdventureImg,
    layout: "image-left",
  },
  {
    name: "Varanasi",
    category: "For Depth",
    line: "Every ghat holds a story you haven't heard yet.",
    img: null,
    layout: "image-right",
  },
  {
    name: "Pondicherry",
    category: "For Slow Living",
    line: "French streets. Sea breeze. No rush.",
    img: destSlowImg,
    layout: "image-left",
  },
];

function DestPanel({ dest, index }: { dest: typeof destinations[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const imgBg = dest.img ? `url(${dest.img})` : "linear-gradient(135deg, #1a1200 0%, #3a2800 60%, #6a4000 100%)";

  if (dest.layout === "full-bleed") {
    return (
      <motion.div
        ref={ref}
        className="relative w-full overflow-hidden"
        style={{ height: "80vh" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: index * 0.05 }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          style={{ backgroundImage: imgBg, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,13,10,0.2) 0%, rgba(15,13,10,0.55) 100%)" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-4">{dest.category}</p>
          <h3 className="font-serif text-6xl md:text-7xl text-[#F7F0E6] mb-5 font-light">{dest.name}</h3>
          <p className="font-serif text-xl md:text-2xl text-[#F7F0E6]/70 italic max-w-lg mb-8">"{dest.line}"</p>
          <a href="#" className="font-sans text-sm tracking-widest text-[#C9A96E] group flex items-center gap-2 hover:gap-4 transition-all duration-300 cursor-none">
            Explore <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </motion.div>
    );
  }

  const isLeft = dest.layout === "image-left";

  return (
    <motion.div
      ref={ref}
      className="flex flex-col md:flex-row w-full overflow-hidden"
      style={{ minHeight: "65vh" }}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image side */}
      <div
        className={`relative overflow-hidden group ${isLeft ? "md:order-1" : "md:order-2"}`}
        style={{ flex: "0 0 60%" }}
      >
        <div
          className="absolute inset-0 scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          style={{ backgroundImage: imgBg, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.88)" }}
        />
        <div className="absolute inset-0" style={{ background: isLeft ? "linear-gradient(to right, transparent 70%, #0F0D0A 100%)" : "linear-gradient(to left, transparent 70%, #0F0D0A 100%)" }} />
        <div className="relative h-full min-h-[50vh]" />
      </div>

      {/* Content side */}
      <div
        className={`flex flex-col justify-center px-12 md:px-16 py-16 bg-[#0F0D0A] ${isLeft ? "md:order-2" : "md:order-1"}`}
        style={{ flex: "0 0 40%" }}
      >
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#C9A96E] mb-6">{dest.category}</p>
        <h3 className="font-serif text-4xl md:text-5xl text-[#F7F0E6] font-light mb-5 leading-tight">{dest.name}</h3>
        <p className="font-serif text-lg text-[#F7F0E6]/55 italic leading-relaxed mb-10">"{dest.line}"</p>
        <a href="#" className="font-sans text-xs tracking-widest text-[#C9A96E] group flex items-center gap-2 hover:gap-4 transition-all duration-300 cursor-none w-fit">
          Explore <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </motion.div>
  );
}

export default function CinematicDestinations() {
  return (
    <section className="bg-[#0F0D0A] relative">
      {/* Section header */}
      <div className="text-center py-24 px-6">
        <motion.p
          className="font-sans text-xs tracking-[0.4em] uppercase text-[#C9A96E] mb-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          180+ Destinations
        </motion.p>
        <motion.h2
          className="font-serif text-5xl md:text-6xl text-[#F7F0E6] font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Choose Your World
        </motion.h2>
      </div>

      {/* Destination panels */}
      <div className="flex flex-col">
        {destinations.map((dest, i) => (
          <DestPanel key={dest.name} dest={dest} index={i} />
        ))}
      </div>
    </section>
  );
}
