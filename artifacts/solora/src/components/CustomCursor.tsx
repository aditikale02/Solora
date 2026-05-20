import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        target.classList.contains("hover-trigger")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      posRef.current.x += (mousePosition.x - posRef.current.x) * 0.08;
      posRef.current.y += (mousePosition.y - posRef.current.y) * 0.08;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#F7F0E6] rounded-full pointer-events-none z-[100] mix-blend-difference"
        style={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
        }}
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[99] transition-all duration-300 ease-out flex items-center justify-center -translate-x-1/2 -translate-y-1/2
          ${isHovering ? "w-16 h-16 bg-[#C9A96E]/20 border border-[#C9A96E]/60 backdrop-blur-[2px]" : "w-10 h-10 border border-[#C9A96E]/40"}`}
        style={{
          marginLeft: "-20px",
          marginTop: "-20px",
        }}
      />
    </>
  );
}
