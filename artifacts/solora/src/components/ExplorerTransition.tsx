import { motion } from "framer-motion";

export default function ExplorerTransition() {
  return (
    <section className="relative overflow-hidden flex items-center" style={{ height: "45vh", background: "#0F0D0A" }}>

      {/* Atmospheric landscape strip */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0F0D0A 0%, #141810 40%, #1a2010 70%, #0F0D0A 100%)" }} />

      {/* Mountain silhouette strip */}
      <div className="absolute bottom-0 w-full h-[60%]">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 200 L0 120 L120 60 L240 110 L380 30 L520 90 L660 20 L800 80 L920 40 L1060 100 L1180 50 L1320 110 L1440 70 L1440 200 Z" fill="rgba(30,40,20,0.5)" />
          <path d="M0 200 L0 140 L100 100 L220 130 L340 80 L480 120 L600 70 L720 110 L840 60 L980 115 L1100 75 L1240 125 L1440 90 L1440 200 Z" fill="rgba(20,28,15,0.7)" />
        </svg>
      </div>

      {/* Dotted path line */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 px-12">
        <svg width="100%" height="4" viewBox="0 0 1440 4" preserveAspectRatio="none">
          <line x1="0" y1="2" x2="1440" y2="2" stroke="rgba(201,169,110,0.2)" strokeWidth="1.5" strokeDasharray="6 12" />
        </svg>
      </div>

      {/* Walking explorer */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        animate={{ x: ["10vw", "80vw"] }}
        transition={{ duration: 12, ease: "linear", repeat: Infinity }}
      >
        <motion.svg
          width="20" height="38" viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <g stroke="rgba(201,169,110,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="14" cy="6" r="4" />
            <path d="M14 10 L12 28 L16 28 L14 10" />
            <path d="M8 14 L6 24 M20 14 L22 24" />
            <path d="M12 28 L10 44 M16 28 L18 44" />
            <path d="M6 18 C3 18 3 28 6 28" strokeWidth="1" />
          </g>
        </motion.svg>
      </motion.div>

      {/* Faint text */}
      <motion.div
        className="absolute bottom-[18%] left-1/2 -translate-x-1/2 whitespace-nowrap font-sans text-[10px] tracking-[0.4em] lowercase text-[#F7F0E6]/25 pointer-events-none"
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      >
        continuing the journey...
      </motion.div>

      {/* Top/bottom fades */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to bottom, #0F0D0A, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #0F0D0A)" }} />
    </section>
  );
}
