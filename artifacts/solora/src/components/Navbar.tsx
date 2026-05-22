import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import SoloraLogo from "./SoloraLogo";
import PremiumButton from "./PremiumButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? "rgba(247,242,236,0.08)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,169,110,0.1)" : "none",
        transition: "background 0.6s ease, backdrop-filter 0.6s ease, border-bottom 0.6s ease",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo + wordmark */}
        <Link href="/" className="group flex items-center gap-4 cursor-none">
          {/* Icon — clamp from 48px (mobile) to 62px (desktop) */}
          <div style={{ width: "clamp(48px, 5.5vw, 62px)" }}>
            <SoloraLogo variant="light" />
          </div>
          <span
            className="font-serif tracking-widest text-[#F7F0E6] transition-colors duration-500"
            style={{ fontSize: "clamp(1.25rem, 2vw, 1.55rem)" }}
          >
            SOLORA
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Destinations", "Stories", "Community"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="cursor-none">
              <span className="text-sm tracking-widest uppercase text-[#F7F0E6]/70 hover:text-[#C9A96E] transition-colors duration-300">
                {item}
              </span>
            </Link>
          ))}
        </nav>

        <Link href="#begin" className="cursor-none">
          <PremiumButton variant="secondary">Begin Your Journey</PremiumButton>
        </Link>
      </div>
    </motion.header>
  );
}
