import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ExplorerState = "walking" | "looking" | "sitting" | "arrived";

export default function ExplorerJourney() {
  const [explorerY, setExplorerY] = useState(10);
  const [explorerState, setExplorerState] = useState<ExplorerState>("walking");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollProgress = window.scrollY / scrollHeight;
      
      const newY = 10 + scrollProgress * 75;
      setExplorerY(newY);

      if (scrollProgress < 0.15) setExplorerState("walking");
      else if (scrollProgress < 0.30) setExplorerState("looking");
      else if (scrollProgress < 0.60) setExplorerState("walking");
      else if (scrollProgress < 0.80) setExplorerState("sitting");
      else setExplorerState("arrived");
    };

    const handleResize = () => {
      setIsVisible(window.innerWidth >= 768);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleResize();
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isVisible) return null;

  const messages: Record<ExplorerState, string> = {
    walking: "Still deciding?",
    looking: "Something's out there.",
    sitting: "Take your time.",
    arrived: "You made it."
  };

  return (
    <div className="fixed right-12 top-0 bottom-0 w-12 pointer-events-none z-50 flex justify-center">
      {/* Dotted path */}
      <div 
        className="absolute top-[10%] w-[2px] border-l-2 border-dashed border-[rgba(201,169,110,0.15)]"
        style={{ height: `${explorerY - 10}vh` }}
      />

      {/* Explorer */}
      <motion.div
        className="absolute pointer-events-auto cursor-none flex items-center justify-end"
        style={{ top: `${explorerY}vh`, opacity: isHovered ? 1 : 0.6 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mr-4 whitespace-nowrap px-4 py-2 rounded-xl backdrop-blur-[8px] border border-[#C9A96E] bg-[rgba(247,240,230,0.06)]"
            >
              <span className="font-serif italic text-sm text-[#F7F2EC]">
                {messages[explorerState]}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Hat */}
            <path d="M 10 15 C 10 5, 30 5, 30 15 Z" />
            <path d="M 5 15 L 35 15" />
            
            {/* Body */}
            <path d="M 15 15 L 15 35 L 25 35 L 25 15" />
            
            {/* Backpack */}
            <path d="M 8 20 L 5 20 L 5 30 L 15 30" />

            {/* State-based variations */}
            {explorerState === "walking" && (
              <path d="M 15 35 L 10 45 M 25 35 L 20 48" />
            )}
            
            {explorerState === "looking" && (
              <>
                <path d="M 15 35 L 15 48 M 25 35 L 25 48" />
                {/* Tilted head suggested by hat shift (simulated) */}
                <path d="M 28 10 L 32 8" />
              </>
            )}

            {explorerState === "sitting" && (
              <>
                <path d="M 15 35 L 25 35 L 25 40 L 35 40" />
                <path d="M 10 30 L 10 45 L 20 45" />
              </>
            )}

            {explorerState === "arrived" && (
              <>
                <path d="M 15 35 L 15 48 M 25 35 L 25 48" />
                {/* Arms raised */}
                <path d="M 15 20 L 5 10 M 25 20 L 35 10" />
              </>
            )}
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
