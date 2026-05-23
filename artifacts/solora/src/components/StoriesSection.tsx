import { motion } from "framer-motion";
import story1 from "@/assets/images/dest-healing.jpg";
import story2 from "@/assets/images/dest-silence.jpg";
import story3 from "@/assets/images/dest-adventure.jpg";
import story4 from "@/assets/images/dest-discovery.jpg";

const stories = [
  { title: "How a wrong train taught me to stop planning", img: story1 },
  { title: "72 hours in Spiti — silence I never knew I needed", img: story2 },
  { title: "I went to Varanasi broken. I left lighter.", img: story3 },
  { title: "The tea seller in Darjeeling who changed everything", img: story4 },
];

export default function StoriesSection() {
  return (
    <section id="stories" className="bg-[#1A1714] py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl text-[#F7F0E6] mb-16 text-center">Stories from the road.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="group relative h-[400px] rounded-lg overflow-hidden cursor-none"
            >
              <div className="absolute inset-0">
                <img src={story.img} alt={story.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/90 to-transparent" />
              </div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-[#C9A96E] font-sans text-xs uppercase tracking-widest mb-4 block">Real Story</span>
                <h3 className="font-serif italic text-2xl md:text-3xl text-[#F7F0E6] mb-6">{story.title}</h3>
                <span className="text-[#F7F0E6] font-sans text-sm opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Read Story →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
