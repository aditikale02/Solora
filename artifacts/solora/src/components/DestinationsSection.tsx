import { motion } from "framer-motion";
import destHealing from "@/assets/images/dest-healing.jpg";
import destSilence from "@/assets/images/dest-silence.jpg";
import destAdventure from "@/assets/images/dest-adventure.jpg";
import destDiscovery from "@/assets/images/dest-discovery.jpg";
import destSlow from "@/assets/images/dest-slow.jpg";
import destChaos from "@/assets/images/dest-chaos.jpg";

const destinations = [
  { img: destHealing, cat: "For Healing", locations: "Kerala · Mcleodganj · Pondicherry" },
  { img: destSilence, cat: "For Silence", locations: "Spiti · Zuluk · Gurez Valley" },
  { img: destAdventure, cat: "For Adventure", locations: "Kasol · Chopta · Kheerganga" },
  { img: destDiscovery, cat: "For Self-Discovery", locations: "Varanasi · Hampi · Pushkar" },
  { img: destSlow, cat: "For Slow Living", locations: "Gokarna · Coorg · Pondicherry" },
  { img: destChaos, cat: "For Chaos & Energy", locations: "Mumbai · Kolkata · Jaipur" },
];

export default function DestinationsSection() {
  return (
    <section id="destinations" className="bg-[#1A1714] py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl text-[#F7F0E6] mb-16 text-center">
          Find your emotion.
        </h2>
        
        <div className="space-y-16">
          {destinations.map((dest, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="group relative h-[60vh] md:h-[80vh] rounded-xl overflow-hidden cursor-none"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={dest.img} 
                  alt={dest.cat} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/80 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                <p className="font-sans text-[#C9A96E] uppercase tracking-widest text-xs font-medium mb-4">
                  {dest.cat}
                </p>
                <h3 className="font-serif text-3xl md:text-6xl text-[#F7F0E6] transition-transform duration-700 group-hover:-translate-y-2">
                  {dest.locations}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
