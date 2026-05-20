import { motion } from "framer-motion";

const partners = [
  "Air India", "IndiGo", "Airbnb", "Hostelworld", "MakeMyTrip",
  "REI", "Patagonia", "STAAH", "Booking.com", "Zostel"
];

export default function PartnersMarquee() {
  return (
    <section className="bg-[#F7F2EC] py-24 overflow-hidden relative border-t border-[#1A1714]/10">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F7F2EC] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F7F2EC] to-transparent z-10" />
      
      <div className="flex w-[200%]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex whitespace-nowrap"
        >
          {[...partners, ...partners].map((partner, idx) => (
            <div 
              key={idx} 
              className="px-12 font-sans font-medium text-2xl uppercase tracking-widest text-[#1A1714]/30 hover:text-[#1A1714] transition-colors duration-500 cursor-default"
            >
              {partner}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
