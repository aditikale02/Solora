import { motion } from "framer-motion";
import { useLocation } from "wouter";
import oceanCliffImg from "@/assets/images/ocean-cliff-sunrise.jpg";
import PremiumButton from "./PremiumButton";
import { useLeadInquiry } from "@/components/lead/LeadInquiryProvider";
import { useSessionRole } from "@/hooks/use-session-role";

export default function TransformationScene() {
  const [, navigate] = useLocation();
  const { openInquiry } = useLeadInquiry();
  const session = useSessionRole();

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

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">

      {/* Ocean cliff — shimmer animation */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${oceanCliffImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          animation: "ocean-shimmer 8s ease-in-out infinite",
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(15,13,10,0.28) 0%,rgba(15,13,10,0.04) 35%,rgba(15,13,10,0.38) 80%,rgba(15,13,10,0.8) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 28%,rgba(201,169,110,0.07) 0%,transparent 55%)" }} />

      {/* Rising mist particles from cliff */}
      <div className="absolute bottom-[28%] left-0 right-0 overflow-hidden pointer-events-none" style={{ height: "120px" }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[rgba(247,240,230,0.12)]"
            style={{
              width: `${20 + i * 8}px`,
              height: `${20 + i * 8}px`,
              left: `${10 + i * 14}%`,
              bottom: 0,
              filter: "blur(8px)",
              animation: `mist-rise ${4 + i}s ease-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Drifting particles toward sky */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full floating-particle animate-[floatUp_14s_linear_infinite]"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              background: `rgba(201,169,110,${0.12 + (i % 4) * 0.05})`,
              left: `${(i * 5.3) % 100}%`,
              top: `${52 + (i % 6) * 7}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Explorer at cliff edge — arms open */}
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 pointer-events-none">
        {/* Journey path ending at explorer */}
        <div
          className="absolute bottom-0 right-full w-[160px] h-px"
          style={{ backgroundImage: "repeating-linear-gradient(to right,rgba(201,169,110,0.3) 0px,rgba(201,169,110,0.3) 4px,transparent 4px,transparent 10px)" }}
        />

        <motion.svg
          width="26" height="46" viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg"
          animate={{ scaleY: [1, 1.018, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="explorer-breathe"
        >
          <g stroke="rgba(247,240,230,0.88)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="14" cy="6" r="4" />
            <path d="M14 10 L12 28 L16 28 L14 10" />
            {/* Arms wide open */}
            <path d="M12 16 L3 24 M16 16 L25 24" />
            <path d="M12 28 L11 44 M16 28 L17 44" />
          </g>
        </motion.svg>
      </div>

      {/* AURA sparkle */}
      <div className="absolute" style={{ top: "54%", left: "52%" }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-[#C9A96E]"
            animate={{
              x: [0, Math.cos((i * Math.PI) / 2) * 22, 0],
              y: [0, Math.sin((i * Math.PI) / 2) * 22, 0],
              opacity: [0, 0.75, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.h2
          className="font-serif leading-[1.25] font-light text-[#F7F0E6]"
          style={{
            fontSize: "clamp(2.2rem,4.5vw,3.8rem)",
            textShadow: "0 4px 40px rgba(0,0,0,0.5)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Maybe this is the year
          <br />
          <em className="italic text-[#F7F0E6]/88">you finally choose yourself.</em>
        </motion.h2>

        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <PremiumButton variant="primary" onClick={handleJourneyClick}>Begin Your Journey</PremiumButton>
        </motion.div>
      </div>

      {/* Bottom blend into footer */}
      <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none" style={{ background: "linear-gradient(to bottom,transparent,#0F0D0A)" }} />
    </section>
  );
}
