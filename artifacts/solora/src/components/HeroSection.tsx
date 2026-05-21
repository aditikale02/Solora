import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import PremiumButton from "./PremiumButton";
import heroCityImg from "@/assets/images/hero-chaos-city.png";
import heroMountainImg from "@/assets/images/hero-mountain-valley.png";

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

    // Scene 1→2: chaos fades, gateway appears
    tl.to(chaosRef.current, { opacity: 0, duration: 1 }, "scene1")
      .to(gatewayRef.current, { scale: 1, opacity: 1, duration: 1 }, "scene1")

    // Scene 2→3: gateway zooms in, fog builds
      .to(gatewayRef.current, { scale: 3, boxShadow: "0 0 120px rgba(201,169,110,0.8)", duration: 2 }, "scene2")
      .to(fogRef.current, { opacity: 1, scale: 1.5, duration: 2 }, "scene2")

    // Scene 3→4: doors open, bloom
      .to(gatewayDoorsRef.current?.children[0]!, { xPercent: -100, duration: 1 }, "scene3")
      .to(gatewayDoorsRef.current?.children[1]!, { xPercent: 100, duration: 1 }, "scene3")
      .to(bloomRef.current, { opacity: 1, duration: 0.8 }, "scene3+=0.2")

    // Scene 4→5: peaceful world
      .to(peacefulRef.current, { opacity: 1, duration: 0.5 }, "scene4")
      .to(gatewayRef.current, { opacity: 0, duration: 0.1 }, "scene4")
      .to(bloomRef.current, { opacity: 0, duration: 1 }, "scene4+=0.1");

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#1A1714]">

      {/* ── Scene 1: Chaos World ── */}
      <div ref={chaosRef} className="absolute inset-0">

        {/* City photo — desaturated, slightly dimmed, no orange tint */}
        <div
          className="absolute inset-0 animate-[slowZoom_20s_ease-in-out_infinite_alternate]"
          style={{
            backgroundImage: `url(${heroCityImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.3) brightness(0.7) hue-rotate(-15deg)",
          }}
        />

        {/* Cool-neutral overlay — counteracts any warm residue */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(18,22,32,0.45) 0%, rgba(18,22,32,0.2) 40%, rgba(18,22,32,0.65) 100%)" }} />

        {/* Edge vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(5,5,8,0.55) 100%)" }} />

        {/* Floating notification bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] px-4 py-2 bg-[rgba(255,248,235,0.08)] border border-[#C9A96E]/60 rounded-xl text-xs font-sans text-white backdrop-blur-md animate-[float_6s_ease-in-out_infinite]">📱 23 notifications</div>
          <div className="absolute top-[40%] right-[25%] px-4 py-2 bg-[rgba(255,248,235,0.08)] border border-[#C9A96E]/60 rounded-xl text-xs font-sans text-white backdrop-blur-md animate-[float_5s_ease-in-out_infinite_1s]">📧 47 unread</div>
          <div className="absolute bottom-[30%] left-[30%] px-4 py-2 bg-[rgba(255,248,235,0.08)] border border-[#C9A96E]/60 rounded-xl text-xs font-sans text-white backdrop-blur-md animate-[float_7s_ease-in-out_infinite_0.5s]">📅 3 meetings today</div>
          <div className="absolute top-[60%] right-[15%] px-4 py-2 bg-[rgba(255,248,235,0.08)] border border-[#C9A96E]/60 rounded-xl text-xs font-sans text-white backdrop-blur-md animate-[float_4s_ease-in-out_infinite_2s]">⏰ Deadline in 2h</div>
        </div>

        {/* Faint background text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <h1 className="text-[15vw] font-sans font-bold text-white whitespace-nowrap -rotate-12">Monday. Tuesday. Wednesday.</h1>
        </div>
      </div>

      {/* ── Fog layer ── */}
      <div ref={fogRef} className="absolute inset-0 opacity-0 pointer-events-none z-10 flex items-center justify-center">
        <div className="w-[80vw] h-[80vw] bg-white/10 blur-[100px] rounded-full" />
      </div>

      {/* ── Gateway ── (no light rays) */}
      <div ref={gatewayRef} className="absolute inset-0 flex items-center justify-center opacity-0 z-20 pointer-events-none" style={{ transform: "scale(0.15)" }}>
        <div className="relative w-[300px] h-[500px] border-4 border-[#C9A96E]/80 rounded-t-full overflow-hidden shadow-[0_0_60px_rgba(201,169,110,0.6)]">
          {/* Interior glimpse of the other world */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#d4a96e]/60 to-[#2d4a1e]" />
          {/* Mountain silhouette inside gate */}
          <div className="absolute bottom-0 w-full h-[40%] bg-[#1A2A14]" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 40%, 70% 0, 30% 60%, 0 20%)" }} />

          {/* Doors */}
          <div ref={gatewayDoorsRef} className="absolute inset-0 flex">
            <div className="w-1/2 h-full bg-[#1A1714] border-r border-[#C9A96E]/20" />
            <div className="w-1/2 h-full bg-[#1A1714] border-l border-[#C9A96E]/20" />
          </div>
        </div>
      </div>

      {/* ── White bloom transition ── */}
      <div ref={bloomRef} className="absolute inset-0 bg-[#f5ede0] opacity-0 z-30 pointer-events-none" />

      {/* ── Scene 5: Peaceful World — mountain valley photo ── */}
      <div ref={peacefulRef} className="absolute inset-0 opacity-0 z-40 flex flex-col items-center justify-center">

        {/* Mountain valley background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroMountainImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        />

        {/* Soft warm overlay for text legibility */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(247,240,230,0.35) 0%, rgba(247,240,230,0.1) 40%, rgba(247,240,230,0.55) 100%)" }} />

        {/* Drifting particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-[rgba(201,169,110,0.35)] animate-[floatUp_10s_linear_infinite]"
              style={{ left: `${(i * 6.25) % 100}%`, top: `${80 + (i % 4) * 5}%`, animationDelay: `${i * 0.6}s` }}
            />
          ))}
        </div>

        {/* Tagline */}
        <div className="relative z-10 text-center px-6 mt-[10vh]">
          <h1 className="font-serif text-[6vw] md:text-[5vw] leading-[1.1] font-light tracking-[0.02em] text-[#1A1714]" style={{ textShadow: "0 2px 40px rgba(247,240,230,0.6)" }}>
            <span className="block overflow-hidden">
              <motion.span className="block" initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
                SOME JOURNEYS BEGIN
              </motion.span>
            </span>
            <span className="block overflow-hidden text-[#8B6340] italic ml-[10vw]">
              <motion.span className="block" initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                WHEN YOU FINALLY
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span className="block" initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                CHOOSE YOURSELF.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 font-sans text-sm md:text-base text-[#1A1714]/65 max-w-md mx-auto"
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
