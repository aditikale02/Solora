import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import PremiumButton from "./PremiumButton";
import heroCityImg from "@/assets/images/hero-chaos-city.jpg";
import heroMountainImg from "@/assets/images/hero-mountain-valley.jpg";
import { useLeadInquiry } from "@/components/lead/LeadInquiryProvider";
import { useSessionRole } from "@/hooks/use-session-role";

gsap.registerPlugin(ScrollTrigger);

interface Notif {
  icon: string;
  text: string;
  pos: Record<string, string>;
  delay: number;
  dur: number;
  size: "base" | "sm" | "xs";
  urgent?: boolean;
  fomo?: boolean;
}

const notifications: Notif[] = [
  { icon: "📱", text: "23 notifications",          pos: { top: "18%", left: "17%" },       delay: 0,   dur: 6,   size: "base" },
  { icon: "📧", text: "47 unread emails",           pos: { top: "38%", right: "22%" },      delay: 1,   dur: 5,   size: "base" },
  { icon: "📅", text: "3 meetings today",           pos: { bottom: "32%", left: "28%" },    delay: 0.5, dur: 7,   size: "base" },
  { icon: "⏰", text: "Deadline in 2h",             pos: { top: "58%", right: "14%" },      delay: 2,   dur: 4,   size: "base" },
  { icon: "💬", text: 'Boss: "Can we talk?"',       pos: { top: "26%", right: "38%" },      delay: 1.5, dur: 5.5, size: "sm", urgent: true },
  { icon: "🔴", text: "Q3 report due tomorrow",     pos: { bottom: "42%", right: "30%" },   delay: 0.8, dur: 6.5, size: "sm", urgent: true },
  { icon: "✈️", text: "Priya is in Goa 🌊",        pos: { top: "72%", left: "14%" },        delay: 3,   dur: 7,   size: "sm", fomo: true },
  { icon: "📊", text: "15 unread Slack messages",   pos: { top: "14%", right: "16%" },      delay: 2.5, dur: 5,   size: "sm" },
  { icon: "🔋", text: "Battery: 8%",               pos: { bottom: "18%", right: "34%" },   delay: 1.8, dur: 8,   size: "xs" },
  { icon: "🎯", text: "You missed your goal today", pos: { bottom: "52%", left: "8%" },     delay: 4,   dur: 6,   size: "xs", urgent: true },
  { icon: "🌍", text: "Rahul posted from Spiti",    pos: { top: "48%", left: "6%" },        delay: 2.8, dur: 5.5, size: "sm", fomo: true },
  { icon: "📲", text: "3 app updates pending",      pos: { top: "82%", right: "18%" },      delay: 3.5, dur: 7,   size: "xs" },
];

export default function HeroSection() {
  const { openInquiry } = useLeadInquiry();
  const session = useSessionRole();
  const [, navigate] = useLocation();
  const containerRef   = useRef<HTMLDivElement>(null);
  const chaosRef       = useRef<HTMLDivElement>(null);
  const gatewayRef     = useRef<HTMLDivElement>(null);
  const fogRef         = useRef<HTMLDivElement>(null);
  const peacefulRef    = useRef<HTMLDivElement>(null);
  const bloomRef       = useRef<HTMLDivElement>(null);
  const doorLeftRef    = useRef<HTMLDivElement>(null);
  const doorRightRef   = useRef<HTMLDivElement>(null);
  const gateGlowRef    = useRef<HTMLDivElement>(null);

  const handleJourneyClick = () => {
    if (session.status === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    if (session.status === "user") {
      openInquiry({
        mode: "lead",
        source: "hero_cta",
      });
      return;
    }

    navigate("/auth");
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // GPU-accelerate all animated layers up front
    gsap.set(
      [doorLeftRef.current, doorRightRef.current, bloomRef.current,
       gatewayRef.current, fogRef.current, peacefulRef.current,
       chaosRef.current, gateGlowRef.current],
      { willChange: "transform, opacity", force3D: true }
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=480%",
        scrub: 1.8,       // higher = silkier/slower response to scroll
        pin: true,
        anticipatePin: 1,
      },
    });

    // ── Scene 1→2: chaos fades, gateway appears ──
    tl.to(chaosRef.current,   { opacity: 0, duration: 1.2 }, "scene1")
      .to(gatewayRef.current, { scale: 1, opacity: 1, duration: 1.2 }, "scene1");

    // ── Scene 2→3: gateway zooms in, fog and glow build ──
    tl.to(gatewayRef.current, { scale: 3, duration: 2.2, ease: "power1.inOut" }, "scene2")
      .to(fogRef.current,     { opacity: 1, scale: 1.6, duration: 2.2 }, "scene2")
      .to(gateGlowRef.current,{ opacity: 1, scale: 1.15, duration: 2, ease: "power2.out" }, "scene2+=0.3");

    // ── Scene 3→4: doors open — ceremonial, slow, heavy ──
    // Light bloom expands first (exposure increases as doors crack open)
    tl.to(bloomRef.current,    { opacity: 0.35, duration: 0.8, ease: "power1.out" },   "scene3")
      .to(doorLeftRef.current,  { xPercent: -100, duration: 1.4, ease: "power2.out" }, "scene3+=0.2")
      .to(doorRightRef.current, { xPercent: 100,  duration: 1.4, ease: "power2.out" }, "scene3+=0.2")
      .to(bloomRef.current,     { opacity: 1,     duration: 1.0, ease: "power2.inOut" },"scene3+=0.8")
      .to(gateGlowRef.current,  { opacity: 0,     duration: 0.6 },                      "scene3+=1.2");

    // ── Scene 4→5: peaceful world reveals ──
    tl.to(peacefulRef.current, { opacity: 1, duration: 0.6 },              "scene4")
      .to(gatewayRef.current,  { opacity: 0, duration: 0.15 },             "scene4")
      .to(bloomRef.current,    { opacity: 0, duration: 1.2, ease: "power1.out" }, "scene4+=0.05");

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#1A1714]">

      {/* ══════════════════════════════════════
          SCENE 1 — CHAOS WORLD
      ══════════════════════════════════════ */}
      <div ref={chaosRef} className="absolute inset-0">

        {/* City photography — desaturated, cool-toned */}
        <img
          src={heroCityImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full animate-[slowZoom_22s_ease-in-out_infinite_alternate] object-cover [filter:saturate(0.28)_brightness(0.68)_hue-rotate(-15deg)]"
        />

        {/* Cool-neutral overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(14,18,28,0.5)_0%,rgba(14,18,28,0.15)_40%,rgba(14,18,28,0.7)_100%)]" />

        {/* Edge vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(5,5,8,0.6)_100%)]" />

        {/* Blue screen glow — digital fatigue — bleeds from bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none bg-[linear-gradient(to_top,rgba(30,60,140,0.12)_0%,transparent_100%)]" />

        {/* FOMO travel glow — warm amber from top-right (someone else's highlight reel) */}
        <div className="absolute top-0 right-0 h-[45%] w-[40%] pointer-events-none bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,130,30,0.1)_0%,transparent_65%)]" />

        {/* Notification bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          {notifications.map((n, i) => {
            return (
              <div
                key={i}
                data-notification-index={i}
                className="hero-notification"
              >
                {n.icon} {n.text}
              </div>
            );
          })}
        </div>

        {/* Background watermark text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none overflow-hidden">
          <h1 className="text-[14vw] font-sans font-bold text-white whitespace-nowrap -rotate-12 tracking-tight">Monday · Tuesday · Repeat</h1>
        </div>

        {/* Secondary watermark — smaller, opposite angle */}
        <div className="absolute inset-0 flex items-end justify-end p-8 opacity-[0.025] pointer-events-none select-none overflow-hidden">
          <p className="text-[6vw] font-serif text-white rotate-3 italic">…and tomorrow is the same.</p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FOG LAYER
      ══════════════════════════════════════ */}
      <div ref={fogRef} className="absolute inset-0 opacity-0 pointer-events-none z-10 flex items-center justify-center">
        <div className="h-[90vw] w-[90vw] rounded-full bg-[radial-gradient(ellipse,rgba(247,220,170,0.12)_0%,rgba(255,255,255,0.04)_50%,transparent_70%)] blur-[80px]" />
      </div>

      {/* ══════════════════════════════════════
          GATEWAY + DOORS
      ══════════════════════════════════════ */}
      <div
        ref={gatewayRef}
        className="absolute inset-0 z-20 flex scale-[0.14] items-center justify-center opacity-0 pointer-events-none"
      >
        <div
          className="relative h-[500px] w-[300px] overflow-hidden rounded-t-[150px] border-[4px] border-[rgba(201,169,110,0.8)] shadow-[0_0_60px_rgba(201,169,110,0.6),0_0_120px_rgba(201,169,110,0.25)]"
        >
          {/* Gate interior — the other world glimpse */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#d4a96e]/60 to-[#2d4a1e]" />
          <div className="absolute bottom-0 h-[40%] w-full bg-[#1A2A14] [clip-path:polygon(0_100%,100%_100%,100%_40%,70%_0,30%_60%,0_20%)]" />

          {/* Gate ambient glow — inner light */}
          <div
            ref={gateGlowRef}
            className="absolute inset-0 opacity-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(247,220,170,0.55)_0%,transparent_65%)]"
          />

          {/* Doors */}
          <div className="absolute inset-0 flex">
            <div ref={doorLeftRef}  className="h-full w-1/2 border-r border-[#C9A96E]/20 bg-[#1A1714] will-change-transform" />
            <div ref={doorRightRef} className="h-full w-1/2 border-l border-[#C9A96E]/20 bg-[#1A1714] will-change-transform" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          WARM BLOOM — fills screen as doors open
      ══════════════════════════════════════ */}
      <div
        ref={bloomRef}
        className="absolute inset-0 z-30 pointer-events-none opacity-0 bg-[radial-gradient(ellipse_at_50%_50%,#f5ede0_0%,#ede0c8_60%,#d4b896_100%)] will-change-[opacity]"
      />

      {/* ══════════════════════════════════════
          SCENE 5 — PEACEFUL MOUNTAIN WORLD
      ══════════════════════════════════════ */}
      <div ref={peacefulRef} className="absolute inset-0 opacity-0 z-40 flex flex-col items-center justify-center">

        <img
          src={heroMountainImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(247,240,230,0.32)_0%,rgba(247,240,230,0.08)_40%,rgba(247,240,230,0.5)_100%)]" />

        {/* Drifting particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              data-particle-index={i}
              className="hero-particle"
            />
          ))}
        </div>

        {/* Tagline — positioned 10vh down from center */}
        <div className="relative z-10 text-center px-6 mt-[10vh]">
          <h1 className="font-serif text-[6vw] md:text-[5vw] leading-[1.1] font-light tracking-[0.02em] text-[#1A1714] [text-shadow:0_2px_40px_rgba(247,240,230,0.6)]">
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
            <PremiumButton variant="primary" onClick={handleJourneyClick}>
              Begin My Journey
            </PremiumButton>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
