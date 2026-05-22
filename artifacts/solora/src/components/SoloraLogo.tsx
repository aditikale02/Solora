import { motion } from "framer-motion";

interface SoloraLogoProps {
  variant?: "light" | "dark";
  /** Explicit pixel size. If omitted, fills its container (set width on the parent). */
  size?: number;
}

export default function SoloraLogo({ variant = "dark", size }: SoloraLogoProps) {
  const strokeColor = variant === "light" ? "#F7F0E6" : "#1A1714";

  return (
    <motion.div
      className="inline-block"
      style={size ? { width: size * 0.8, height: size } : { width: "100%", height: "auto" }}
      animate={{ y: ["-2px", "2px", "-2px"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ rotateZ: 4, transition: { duration: 0.4, ease: "easeOut" } }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 80 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible", display: "block" }}
      >
        <g stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Hat */}
          <path d="M25 25 C 25 15, 45 15, 45 25 Z" />
          <path d="M20 25 L 50 25" />

          {/* Backpack */}
          <path d="M18 35 C 10 35, 10 65, 18 65" />
          <path d="M15 45 C 12 45, 12 55, 15 55" />

          {/* Body / Coat */}
          <path d="M30 25 L 25 70 L 45 70 L 40 25" />

          {/* Legs */}
          <path d="M30 70 L 28 90 M 40 70 L 42 90" />

          {/* Map in hands */}
          <path d="M45 40 L 60 35 L 65 50 L 50 55 Z" />
          <path d="M35 45 L 45 40 M 35 45 L 50 55" />
          <path d="M52 38 L 56 46" />

          {/* Signpost */}
          <path d="M70 30 L 70 90" />
          <path d="M60 40 L 75 40 L 80 45 L 75 50 L 60 50 Z" />
          <path d="M80 60 L 65 60 L 60 65 L 65 70 L 80 70 Z" />
        </g>
      </svg>
    </motion.div>
  );
}
