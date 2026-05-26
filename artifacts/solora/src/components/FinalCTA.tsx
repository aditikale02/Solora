import { motion } from "framer-motion";
import finalCtaImg from "@/assets/images/ocean-cliff-sunrise.jpg";
import PremiumButton from "./PremiumButton";
import { useLeadInquiry } from "@/components/lead/LeadInquiryProvider";

export default function FinalCTA() {
  const { openInquiry } = useLeadInquiry();

  return (
    <section id="begin" className="relative h-screen w-full flex items-center justify-center bg-[#1A1714]">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={finalCtaImg}
          alt="Ocean cliff sunrise"
          className="w-full h-full object-cover animate-[slowZoom_25s_ease-in-out_infinite_alternate]"
          style={{ objectPosition: "center 30%" }}
          loading="lazy"
        />
        {/* Cinematic gradient overlay — dark top for text legibility, clear middle, dark bottom */}
        <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(15,20,30,0.65) 0%, rgba(15,20,30,0.1) 45%, rgba(15,20,30,0.6) 100%)" }} />
        {/* Warm atmospheric lens flare near top */}
        <div className="absolute top-[15%] left-[60%] w-64 h-64 rounded-full pointer-events-none z-10" style={{ background: "radial-gradient(circle, rgba(201,169,110,0.18) 0%, transparent 70%)" }} />
        {/* Subtle vignette */}
        <div className="absolute inset-0 z-10" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(10,12,18,0.45) 100%)" }} />
      </div>
      
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-serif text-5xl md:text-7xl text-[#F7F0E6] leading-tight mb-12"
        >
          MAYBE THIS IS THE YEAR<br />
          YOU FINALLY CHOOSE YOURSELF.
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <PremiumButton
            variant="primary"
            onClick={() =>
              openInquiry({
                mode: "lead",
                source: "final_cta_primary",
              })
            }
          >
            Start My Journey
          </PremiumButton>
          <PremiumButton
            variant="secondary"
            onClick={() =>
              openInquiry({
                mode: "lead",
                source: "final_cta_secondary",
                serviceSlug: "custom-journey-design",
              })
            }
          >
            Plan My Solo Trip
          </PremiumButton>
        </motion.div>
      </div>
    </section>
  );
}
