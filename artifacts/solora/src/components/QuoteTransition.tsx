import { motion } from "framer-motion";

export default function QuoteTransition({ text }: { text: string }) {
  return (
    <section className="bg-[#F7F2EC] py-40 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="font-serif italic text-3xl md:text-5xl text-[#1A1714] leading-relaxed">
          "{text}"
        </h2>
      </motion.div>
    </section>
  );
}
