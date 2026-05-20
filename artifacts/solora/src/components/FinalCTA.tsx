import { motion } from "framer-motion";
import finalCtaImg from "@/assets/images/final-cta.png";

export default function FinalCTA() {
  return (
    <section id="begin" className="relative h-screen w-full flex items-center justify-center bg-[#1A1714]">
      <div className="absolute inset-0 overflow-hidden">
        <img src={finalCtaImg} alt="Epic Mountain Sunrise" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714] via-[#1A1714]/40 to-transparent z-10" />
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
          <button className="px-8 py-4 bg-[#C9A96E] text-[#1A1714] font-sans text-sm tracking-widest uppercase rounded-full hover:bg-[#F7F0E6] transition-colors w-full sm:w-auto">
            Start My Journey
          </button>
          <button className="px-8 py-4 bg-transparent border border-[#F7F0E6]/30 text-[#F7F0E6] font-sans text-sm tracking-widest uppercase rounded-full hover:border-[#F7F0E6] transition-colors w-full sm:w-auto">
            Plan My Solo Trip
          </button>
        </motion.div>
      </div>
    </section>
  );
}
