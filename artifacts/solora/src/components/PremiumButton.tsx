import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

export default function PremiumButton({
  children,
  variant = "primary",
  onClick,
  className = "",
}: PremiumButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.18;
    const deltaY = (e.clientY - centerY) * 0.18;
    buttonRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-2px)`;
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform = "translate(0, 0)";
    setIsHovered(false);
  };

  const isPrimary = variant === "primary";

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden rounded-[100px] px-[48px] py-[18px] text-[0.85rem] font-medium uppercase tracking-[0.18em] font-sans transition-all duration-300 cursor-none active:scale-98 active:translate-y-0 ${
        isPrimary
          ? "text-[rgba(247,240,230,0.95)] border-[rgba(201,169,110,0.4)]"
          : "text-[rgba(247,240,230,0.9)] border-[rgba(201,169,110,0.35)] bg-transparent"
      } ${className}`}
      style={{
        background: isPrimary
          ? "linear-gradient(135deg, rgba(201,169,110,0.15) 0%, rgba(201,169,110,0.08) 100%)"
          : "transparent",
        borderWidth: "1px",
        borderStyle: "solid",
        backdropFilter: "blur(12px)",
        boxShadow: isPrimary
          ? isHovered
            ? "0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 40px rgba(201,169,110,0.2)"
            : "0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
          : isHovered
          ? "0 0 20px rgba(201,169,110,0.15)"
          : "none",
        borderColor: isHovered
          ? "rgba(201,169,110,0.7)"
          : isPrimary
          ? "rgba(201,169,110,0.4)"
          : "rgba(201,169,110,0.35)",
      }}
    >
      {isPrimary && (
        <span
          className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent skew-x-[-20deg]"
          style={{
            left: isHovered ? "150%" : "-100%",
            transition: "left 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
