import { motion } from "framer-motion";
import collage1 from "@/assets/images/collage-1.png";
import collage2 from "@/assets/images/collage-2.png";
import collage3 from "@/assets/images/collage-3.png";
import finalCta from "@/assets/images/final-cta.png";

const cards = [
  { img: collage1, rotation: -6, x: -40, y: 20, quote: "I cried at sunrise and it was perfect." },
  { img: collage2, rotation: 4, x: 20, y: -30, quote: "Went alone. Came back unrecognizable." },
  { img: collage3, rotation: -2, x: 60, y: 40, quote: "Nobody waiting for me to come home felt like freedom." },
];

export default function MemoryCollage() {
  return (
    <section className="bg-[#1A1714] py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl text-[#F7F0E6] mb-32 text-center">
          Real moments. Real people. Real transformation.
        </h2>

        <div className="relative h-[600px] flex items-center justify-center">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: idx * 0.2 }}
              animate={{
                y: [card.y, card.y - 10, card.y],
              }}
              className="absolute group cursor-none"
              style={{
                rotate: card.rotation,
                marginLeft: `${card.x}%`,
              }}
            >
              <div className="bg-[#F7F0E6] p-4 pb-12 shadow-2xl transition-transform duration-500 group-hover:-translate-y-4 group-hover:scale-105 group-hover:rotate-0">
                <img src={card.img} alt="Memory" className="w-64 h-80 object-cover border border-[#1A1714]/10" />
                
                <div className="absolute inset-x-0 bottom-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-serif italic text-sm text-[#1A1714] px-4">"{card.quote}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
