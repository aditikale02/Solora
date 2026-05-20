import { motion } from "framer-motion";

const statements = [
  "You've opened Instagram and closed it 40 times today.",
  "The trip you've been planning since 2021 is still just a folder of screenshots.",
  "You want to go. You just don't know if you can go alone.",
  "Maybe this is the year you finally choose yourself."
];

export default function ProblemSection() {
  return (
    <section className="bg-[#1A1714] py-32 md:py-48 px-6 text-[#F7F0E6]">
      <div className="max-w-4xl mx-auto space-y-32">
        {statements.map((statement, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light leading-tight">
              {statement}
            </h2>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
