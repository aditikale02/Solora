import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import PremiumButton from "./PremiumButton";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chaosRef = useRef<HTMLDivElement>(null);
  const gatewayRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const peacefulRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const gatewayDoorsRef = useRef<HTMLDivElement>(null);

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

    // 0% -> 30%: Chaos fades, Gateway scales up
    tl.to(chaosRef.current, { opacity: 0, duration: 1 }, "scene1")
      .to(gatewayRef.current, { scale: 1, opacity: 1, duration: 1 }, "scene1")
      
    // 30% -> 50%: Gateway grows, colors shift, fog appears
      .to(gatewayRef.current, { scale: 3, boxShadow: "0 0 120px rgba(201,169,110,0.8)", filter: "hue-rotate(10deg) saturate(1.5)", duration: 2 }, "scene2")
      .to(fogRef.current, { opacity: 1, scale: 1.5, duration: 2 }, "scene2")

    // 80%: Doors open, Bloom
      .to(gatewayDoorsRef.current?.children[0]!, { xPercent: -100, duration: 1 }, "scene3")
      .to(gatewayDoorsRef.current?.children[1]!, { xPercent: 100, duration: 1 }, "scene3")
      .to(bloomRef.current, { opacity: 1, duration: 0.8 }, "scene3+=0.2")
      
    // 90%: Enter Peaceful World
      .to(peacefulRef.current, { opacity: 1, duration: 0.5 }, "scene4")
      .to(gatewayRef.current, { opacity: 0, duration: 0.1 }, "scene4")
      .to(bloomRef.current, { opacity: 0, duration: 1 }, "scene4+=0.1");

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#1A1714]" style={{ perspective: "1200px" }}>
      {/* Scene 1: Chaos World */}
      <div ref={chaosRef} className="absolute inset-0 preserve-3d">
        {/* Layer 4: Sky */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3d2f1e_0%,_#1a1714_100%)]" style={{ transform: "translateZ(-200px) scale(1.5)" }} />
        
        {/* Layer 3: City Buildings */}
        <div className="absolute bottom-0 w-full h-[60%] flex items-end justify-around px-10" style={{ transform: "translateZ(-100px) scale(1.2)" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1e1a16] w-[15%] rounded-t-lg relative" style={{ height: `${30 + Math.random() * 50}%` }}>
              <div className="absolute inset-0 flex flex-wrap gap-2 p-4 content-start opacity-40">
                {[...Array(8)].map((_, j) => (
                  <div key={j} className="w-4 h-6 bg-[#C97B2E] rounded-sm" style={{ opacity: Math.random() }} />
                ))}
              </div>
            </div>
          ))}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#8B4513]/40 to-transparent" />
        </div>

        {/* Layer 2: Street Scene */}
        <div className="absolute inset-0" style={{ transform: "translateZ(0px)" }}>
          <div className="absolute top-1/3 left-1/4 w-4 h-12 bg-black rounded-full flex flex-col items-center justify-center gap-1 p-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#C97B2E]" />
          </div>
        </div>

        {/* Layer 1: Foreground Notifications */}
        <div className="absolute inset-0 pointer-events-none" style={{ transform: "translateZ(60px)" }}>
          <div className="absolute top-[20%] left-[20%] px-4 py-2 bg-[rgba(255,248,235,0.08)] border border-[#C9A96E] rounded-xl text-xs font-sans text-white backdrop-blur-md animate-[float_6s_ease-in-out_infinite]">📱 23 notifications</div>
          <div className="absolute top-[40%] right-[25%] px-4 py-2 bg-[rgba(255,248,235,0.08)] border border-[#C9A96E] rounded-xl text-xs font-sans text-white backdrop-blur-md animate-[float_5s_ease-in-out_infinite_1s]">📧 47 unread</div>
          <div className="absolute bottom-[30%] left-[30%] px-4 py-2 bg-[rgba(255,248,235,0.08)] border border-[#C9A96E] rounded-xl text-xs font-sans text-white backdrop-blur-md animate-[float_7s_ease-in-out_infinite_0.5s]">📅 3 meetings today</div>
          <div className="absolute top-[60%] right-[15%] px-4 py-2 bg-[rgba(255,248,235,0.08)] border border-[#C9A96E] rounded-xl text-xs font-sans text-white backdrop-blur-md animate-[float_4s_ease-in-out_infinite_2s]">⏰ Deadline in 2h</div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <h1 className="text-[15vw] font-sans font-bold text-white whitespace-nowrap -rotate-12">Monday. Tuesday. Wednesday.</h1>
        </div>
      </div>

      {/* Fog Layer */}
      <div ref={fogRef} className="absolute inset-0 opacity-0 pointer-events-none z-10 flex items-center justify-center">
        <div className="w-[80vw] h-[80vw] bg-white/10 blur-[100px] rounded-full" />
      </div>

      {/* Gateway */}
      <div ref={gatewayRef} className="absolute inset-0 flex items-center justify-center opacity-0 z-20 pointer-events-none" style={{ transform: "scale(0.15)" }}>
        <div className="relative w-[300px] h-[500px] border-4 border-[#1A1714] rounded-t-full overflow-hidden shadow-[0_0_60px_rgba(201,169,110,0.6)]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#C9A96E]/50 to-[#1A1714]" />
          <div className="absolute bottom-0 w-full h-[40%] bg-[#1A1714]" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 40%, 70% 0, 30% 60%, 0 20%)" }} />
          
          <div ref={gatewayDoorsRef} className="absolute inset-0 flex">
            <div className="w-1/2 h-full bg-[#1A1714] border-r border-[#C9A96E]/30" />
            <div className="w-1/2 h-full bg-[#1A1714] border-l border-[#C9A96E]/30" />
          </div>
        </div>
        
        {/* Light rays */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute w-[2px] h-[600px] bg-gradient-to-t from-transparent via-[#C9A96E]/40 to-transparent" style={{ transform: `rotate(${i * 30}deg)` }} />
          ))}
        </div>
      </div>

      {/* White Bloom Transition */}
      <div ref={bloomRef} className="absolute inset-0 bg-white opacity-0 z-30 pointer-events-none" />

      {/* Scene 5: Peaceful World */}
      <div ref={peacefulRef} className="absolute inset-0 opacity-0 z-40 bg-gradient-to-b from-[#e8c97e] via-[#f5e6c8] to-[#F7F2EC] flex flex-col items-center justify-center">
        {/* Mountains */}
        <div className="absolute bottom-0 inset-x-0 h-[40%]">
          <div className="absolute bottom-0 w-[120%] -left-[10%] h-[80%] bg-[#C9A96E]/20 blur-sm" style={{ clipPath: "polygon(0 100%, 100% 100%, 80% 20%, 50% 60%, 20% 0)" }} />
          <div className="absolute bottom-0 w-full h-[60%] bg-[#8B4513]/10" style={{ clipPath: "polygon(0 100%, 100% 100%, 70% 30%, 40% 80%, 10% 40%)" }} />
        </div>
        
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-[rgba(201,169,110,0.3)] animate-[floatUp_10s_linear_infinite]" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }} />
          ))}
        </div>

        {/* Text */}
        <div className="relative z-10 text-center px-6">
          <h1 className="font-serif text-[6vw] md:text-[5vw] leading-[1.1] font-light tracking-[0.02em] text-[#1A1714]">
            <span className="block overflow-hidden"><motion.span className="block" initial={{y: 40, opacity: 0}} whileInView={{y: 0, opacity: 1}} transition={{duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1]}}>SOME JOURNEYS BEGIN</motion.span></span>
            <span className="block overflow-hidden text-[#C9A96E] italic ml-[10vw]"><motion.span className="block" initial={{y: 40, opacity: 0}} whileInView={{y: 0, opacity: 1}} transition={{duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1]}}>WHEN YOU FINALLY</motion.span></span>
            <span className="block overflow-hidden"><motion.span className="block" initial={{y: 40, opacity: 0}} whileInView={{y: 0, opacity: 1}} transition={{duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1]}}>CHOOSE YOURSELF.</motion.span></span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 font-sans text-sm md:text-base text-[#1A1714]/70 max-w-md mx-auto"
          >
            Solo travel experiences curated for self-discovery, healing, and transformation.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 flex justify-center"
          >
            <PremiumButton variant="primary">Begin My Journey</PremiumButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
