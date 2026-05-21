import { motion } from "framer-motion";
import oceanCliffImg from "@/assets/images/ocean-cliff-sunrise.png";
import PremiumButton from "./PremiumButton";

export default function TransformationScene() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">

      {/* Ocean cliff background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${oceanCliffImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "brightness(0.82)",
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,13,10,0.3) 0%, rgba(15,13,10,0.05) 35%, rgba(15,13,10,0.4) 80%, rgba(15,13,10,0.75) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(201,169,110,0.08) 0%, transparent 60%)" }} />

      {/* Drifting particles toward sky */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-[floatUp_14s_linear_infinite]"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              background: `rgba(201,169,110,${0.15 + (i % 4) * 0.06})`,
              left: `${(i * 5.1) % 100}%`,
              top: `${50 + (i % 6) * 8}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Explorer at cliff edge */}
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2">
        <motion.svg
          width="24" height="44"
          viewBox="0 0 28 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ scaleY: [1, 1.02, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <g stroke="rgba(247,240,230,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="14" cy="6" r="4" />
            <path d="M14 10 L12 28 L16 28 L14 10" />
            {/* Arms slightly open */}
            <path d="M12 16 L4 24 M16 16 L24 24" />
            <path d="M12 28 L11 44 M16 28 L17 44" />
          </g>
        </motion.svg>
        {/* Journey path ending here */}
        <div className="absolute -left-[120px] top-1/2 w-[120px] h-[1px]" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.4))" }} />
        <div
          className="absolute -left-[120px] top-1/2 w-[120px] -translate-y-1/2"
          style={{ height: "1px", backgroundImage: "repeating-linear-gradient(to right, rgba(201,169,110,0.35) 0px, rgba(201,169,110,0.35) 4px, transparent 4px, transparent 10px)" }}
        />
      </div>

      {/* AURA sparkle near CTA */}
      <div className="absolute" style={{ top: "54%", left: "52%" }}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-[#C9A96E]"
            style={{ transformOrigin: "center" }}
            animate={{
              x: [0, Math.cos((i * Math.PI) / 2) * 24, 0],
              y: [0, Math.sin((i * Math.PI) / 2) * 24, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.h2
          className="font-serif text-[5.5vw] md:text-[4vw] leading-[1.2] font-light text-[#F7F0E6]"
          style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Maybe this is the year
          <br />
          <span className="italic text-[#F7F0E6]/90">you finally choose yourself.</span>
        </motion.h2>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <PremiumButton variant="primary">Begin Your Journey</PremiumButton>
        </motion.div>
      </div>

      {/* Bottom blend into footer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #0F0D0A)" }} />
    </section>
  );
}
