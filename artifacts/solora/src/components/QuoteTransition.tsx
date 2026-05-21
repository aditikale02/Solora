import { motion } from "framer-motion";

interface QuoteTransitionProps {
  text: string;
  attribution?: string;
}

export default function QuoteTransition({ text, attribution }: QuoteTransitionProps) {
  const words = text.split(" ");

  return (
    <section className="bg-[#0f0d0b] py-40 px-6 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 60 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[900px] text-center"
        style={{
          background: "rgba(255, 248, 235, 0.06)",
          backdropFilter: "blur(24px) saturate(1.4)",
          border: "1px solid rgba(201, 169, 110, 0.18)",
          borderRadius: "24px",
          boxShadow: "0 32px 80px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 60px rgba(201, 169, 110, 0.05)",
          padding: "64px 80px"
        }}
      >
        <div className="text-[#C9A96E] text-xl mb-6">✦</div>
        
        <h2 className="font-serif italic text-3xl md:text-5xl text-[#F7F2EC] leading-relaxed flex flex-wrap justify-center gap-x-3 gap-y-2">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {attribution && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 + words.length * 0.06 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <div className="w-16 h-[1px] bg-[rgba(201,169,110,0.2)]" />
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#C9A96E]">
              {attribution}
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
