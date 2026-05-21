import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import SoloraLogo from "./SoloraLogo";
import PremiumButton from "./PremiumButton";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
        isScrolled ? "bg-[#F7F2EC]/90 backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-4 cursor-none">
          <SoloraLogo variant={isScrolled ? "dark" : "light"} size={40} />
          <span className={`text-2xl font-serif tracking-widest transition-colors duration-500 ${
            isScrolled ? "text-[#1A1714]" : "text-[#C9A96E]"
          }`}>
            SOLORA
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Destinations", "Stories", "Community"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="cursor-none">
              <span className={`text-sm tracking-widest uppercase transition-colors duration-500 hover:text-[#C9A96E] ${
                isScrolled ? "text-[#1A1714]/70" : "text-[#F7F0E6]/70"
              }`}>
                {item}
              </span>
            </Link>
          ))}
        </nav>

        <Link href="#begin" className="cursor-none">
          <PremiumButton variant={isScrolled ? "primary" : "secondary"}>
            Begin Your Journey
          </PremiumButton>
        </Link>
      </div>
    </motion.header>
  );
}
