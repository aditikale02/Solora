import { motion } from "framer-motion";

interface SoloraLogoProps {
  variant?: "light" | "dark";
  /** Explicit pixel size. If omitted, fills its container (set width on the parent). */
  size?: number;
}

export default function SoloraLogo({ size }: SoloraLogoProps) {
  const containerStyle = size
    ? { width: size, height: size, minWidth: size, minHeight: size }
    : { width: "100%", height: "100%" };

  return (
    <motion.div
      className="inline-block"
      style={containerStyle}
      animate={{ y: ["-2px", "2px", "-2px"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ rotateZ: 4, transition: { duration: 0.4, ease: "easeOut" } }}
    >
      <img
        src="/favicon.svg"
        alt="SOLORA"
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />
    </motion.div>
  );
}
