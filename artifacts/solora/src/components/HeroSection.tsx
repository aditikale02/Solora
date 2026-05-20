import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const gatewayRef = useRef<HTMLDivElement>(null);
  const landscapeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%",
        scrub: 1.5,
        pin: true,
      },
    });

    // Scene 1 -> 2: Gateway appears, chaos fades
    tl.to(layer1Ref.current, { opacity: 0, filter: "blur(10px)", duration: 1 })
      .to(gatewayRef.current, { opacity: 1, scale: 1, duration: 1 }, "<")
      
    // Scene 2 -> 3: Zoom into gateway
      .to(gatewayRef.current, { scale: 10, duration: 2 })
      .to(layer2Ref.current, { opacity: 0, duration: 1 }, "<")

    // Scene 3 -> 4: Entering, white bloom
      .to(gatewayRef.current, { opacity: 0, duration: 0.5 })
      .to(landscapeRef.current, { opacity: 1, scale: 1, duration: 1 }, "-=0.5")

    // Scene 5: Reveal text
      .to(textRef.current, { opacity: 1, y: 0, duration: 1 });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#1A1714]">
      {/* Scene 1: Chaos */}
      <div ref={layer1Ref} className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2a221d_0%,_#1a1714_100%)]" />
        <div className="text-[#C9A96E]/20 text-sm tracking-[0.5em] uppercase font-sans animate-pulse">
          Notifications • Tasks • Emails • Meetings
        </div>
      </div>

      <div ref={layer2Ref} className="absolute inset-0 bg-[#1A1714]/50" />

      {/* Scene 2/3: Gateway */}
      <div 
        ref={gatewayRef} 
        className="absolute inset-0 flex items-center justify-center opacity-0 scale-50"
      >
        <div className="w-[10vw] h-[20vw] border-[2px] border-[#C9A96E] rounded-t-full relative shadow-[0_0_50px_rgba(201,169,110,0.5)]">
          <div className="absolute inset-0 bg-[#C9A96E]/10 rounded-t-full backdrop-blur-sm" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#C9A96E]/30 to-transparent" />
        </div>
      </div>

      {/* Scene 4/5: Landscape */}
      <div 
        ref={landscapeRef} 
        className="absolute inset-0 opacity-0 scale-110 bg-[#F7F2EC] flex flex-col items-center justify-center"
      >
        {/* Subtle particle effect could go here */}
        
        <div ref={textRef} className="text-center opacity-0 translate-y-10 px-6">
          <h1 className="font-serif text-[7vw] leading-[1.1] font-light tracking-[0.02em] text-[#1A1714]">
            <span className="block mb-2 overflow-hidden">
              <motion.span className="block" initial={{y: "100%"}} whileInView={{y: 0}} transition={{duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1]}}>
                SOME JOURNEYS BEGIN
              </motion.span>
            </span>
            <span className="block ml-[10vw] mb-2 overflow-hidden text-[#C9A96E] italic">
              <motion.span className="block" initial={{y: "100%"}} whileInView={{y: 0}} transition={{duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1]}}>
                WHEN YOU FINALLY
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span className="block" initial={{y: "100%"}} whileInView={{y: 0}} transition={{duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1]}}>
                CHOOSE YOURSELF.
              </motion.span>
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 font-sans text-sm md:text-base text-[#1A1714]/70 max-w-md mx-auto"
          >
            Solo travel experiences curated for self-discovery, healing, and transformation.
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 px-8 py-3 rounded-full bg-[#C9A96E] text-[#1A1714] font-sans text-sm tracking-widest uppercase transition-transform hover:scale-105"
          >
            Begin My Journey
          </motion.button>
        </div>
      </div>
    </section>
  );
}
