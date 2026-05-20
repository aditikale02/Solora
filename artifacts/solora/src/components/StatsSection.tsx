import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

function Counter({ to, duration = 1800 }: { to: string; duration?: number }) {
  const [count, setCount] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = parseFloat(to.replace(/[^0-9.]/g, ""));
    const suffix = to.replace(/[0-9.]/g, "");
    
    if (isNaN(end)) {
      setCount(to);
      return;
    }
    
    let startTime: number;
    
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);
      
      const current = start + (end - start) * easeOutQuart(percent);
      
      if (to.includes(".")) {
        setCount(current.toFixed(1) + suffix);
      } else {
        setCount(Math.floor(current) + suffix);
      }
      
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  }, [isInView, to, duration]);

  return <span ref={ref}>{count}</span>;
}

const stats = [
  { num: "12,000+", label: "SOLO EXPLORERS" },
  { num: "180+", label: "CURATED DESTINATIONS" },
  { num: "98%", label: "WOULD TRAVEL AGAIN" },
  { num: "4.9★", label: "AVERAGE RATING" },
];

export default function StatsSection() {
  return (
    <section className="bg-[#F7F2EC] py-32 px-6 border-y border-[#1A1714]/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <h3 className="font-serif text-6xl md:text-[6rem] font-light tracking-tight text-[#1A1714] mb-4">
              <Counter to={stat.num} />
            </h3>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#C9A96E] font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
