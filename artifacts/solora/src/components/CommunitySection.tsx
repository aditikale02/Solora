import { motion } from "framer-motion";
import avatar1 from "@/assets/images/collage-1.png";
import avatar2 from "@/assets/images/collage-2.png";
import avatar3 from "@/assets/images/collage-3.png";
import avatar4 from "@/assets/images/dest-slow.png";
import avatar5 from "@/assets/images/dest-chaos.png";
import avatar6 from "@/assets/images/dest-healing.png";

const avatars = [
  { img: avatar1, name: "Sarah L.", age: "28", trip: "First solo trip", quote: "I was terrified to go alone. SOLORA made it feel like the world was waiting for me." },
  { img: avatar2, name: "David M.", age: "34", trip: "First solo trip", quote: "Silence in Spiti changed my life. Everything was perfectly curated." },
  { img: avatar3, name: "Priya K.", age: "26", trip: "First solo trip", quote: "I found myself again. Safe, beautiful, and deeply personal." },
  { img: avatar4, name: "Elena R.", age: "31", trip: "First solo trip", quote: "The community support is real. You are solo, but never abandoned." },
  { img: avatar5, name: "James T.", age: "29", trip: "First solo trip", quote: "Not just a trip, an absolute transformation. Highly recommend." },
  { img: avatar6, name: "Aisha N.", age: "25", trip: "First solo trip", quote: "I came back with a completely different aura." },
];

export default function CommunitySection() {
  return (
    <section id="community" className="bg-[#F7F2EC] py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="font-serif text-4xl md:text-5xl text-[#1A1714] mb-6">
            Over 12,000 explorers have chosen themselves.
          </h2>
          <p className="font-sans text-[#1A1714]/70">
            Solo doesn't mean alone. Not here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {avatars.map((avatar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white/50 p-8 rounded-xl border border-[#1A1714]/5"
            >
              <div className="flex items-center gap-4 mb-6">
                <img src={avatar.img} alt={avatar.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h4 className="font-sans font-medium text-[#1A1714]">{avatar.name}, {avatar.age}</h4>
                  <span className="text-[#C9A96E] text-xs uppercase tracking-wider">{avatar.trip}</span>
                </div>
              </div>
              <p className="font-serif italic text-lg text-[#1A1714]/80">"{avatar.quote}"</p>
              <div className="mt-6 flex text-[#C9A96E] text-sm">
                ★★★★★
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12 border-t border-[#1A1714]/10 pt-16">
          {["Verified Stays", "24/7 Support", "Real Community"].map((trust, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-[#C9A96E]">★</span>
              <span className="font-sans text-[#1A1714] uppercase tracking-widest text-sm">{trust}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
