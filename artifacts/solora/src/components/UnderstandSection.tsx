import { motion } from "framer-motion";

const cards = [
  { title: "Safe Solo Experiences", desc: "For the first-timer afraid to go alone." },
  { title: "Hidden Destinations", desc: "Places the tourist maps don't show." },
  { title: "Your Pace, Your Plan", desc: "Personalized itinerary, no rush." },
  { title: "Community Around You", desc: "Solo but never alone." },
  { title: "Emotional Healing Journeys", desc: "For when you need to reset." },
  { title: "Curated Every Detail", desc: "So you can just be present." }
];

export default function UnderstandSection() {
  return (
    <section className="bg-[#F7F2EC] py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <p className="font-serif text-2xl md:text-4xl italic text-[#1A1714] max-w-3xl mx-auto">
            "We've built SOLORA for the version of you that's finally ready."
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="p-8 border border-[#1A1714]/10 rounded-lg hover:bg-[#F7F0E6] transition-colors duration-500"
            >
              <h3 className="font-serif text-2xl mb-4 text-[#1A1714]">{card.title}</h3>
              <p className="font-sans text-[#1A1714]/70">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
