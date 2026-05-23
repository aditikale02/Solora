import { useRef } from "react";
import collage1 from "@/assets/images/collage-1.jpg";
import collage2 from "@/assets/images/collage-2.jpg";
import collage3 from "@/assets/images/collage-3.jpg";
import destSilence from "@/assets/images/dest-silence.jpg";
import destHealing from "@/assets/images/dest-healing.jpg";
import destAdventure from "@/assets/images/dest-adventure.jpg";
import destDiscovery from "@/assets/images/dest-discovery.jpg";
import destSlow from "@/assets/images/dest-slow.jpg";
import destChaos from "@/assets/images/dest-chaos.jpg";

type CardType = "cinematic" | "polaroid" | "portrait" | "dreamy";

interface MemoryCard {
  img: string;
  caption: string;
  type: CardType;
  rotate?: number;
}

const baseCards: MemoryCard[] = [
  { img: destSilence,   caption: "Spiti, 2024",                      type: "portrait",  rotate: 0 },
  { img: collage1,      caption: "chai > everything",                 type: "polaroid",  rotate: -1.5 },
  { img: destHealing,   caption: "day 3. still finding my feet.",     type: "cinematic", rotate: 0 },
  { img: destAdventure, caption: "8am. just me and the mountains.",   type: "polaroid",  rotate: 1.2 },
  { img: collage2,      caption: "the view that made it worth it",    type: "cinematic", rotate: 0 },
  { img: destDiscovery, caption: "didn't plan this stop. best decision.", type: "dreamy", rotate: 0 },
  { img: destSlow,      caption: "no rush. no plans.",                type: "cinematic", rotate: 0 },
  { img: collage3,      caption: "found, somewhere in the hills.",    type: "polaroid",  rotate: -0.8 },
  { img: destChaos,     caption: "before i left everything behind.",  type: "dreamy",    rotate: 0 },
];

const row1Cards = [...baseCards, ...baseCards];
const row2Cards = [...[...baseCards].reverse(), ...[...baseCards].reverse()];

function MemCard({ card, idx, rowKey }: { card: MemoryCard; idx: number; rowKey: string }) {
  const isPolaroid = card.type === "polaroid";
  const isPortrait = card.type === "portrait";
  const isDreamy   = card.type === "dreamy";
  const w = isPortrait ? "160px" : "220px";
  const h = isPortrait ? "290px" : "260px";

  if (isPolaroid) {
    return (
      <div key={`${rowKey}-${idx}`} className="relative flex-shrink-0 group"
        style={{
          width: "200px",
          background: "#F5F0E8",
          padding: "8px 8px 36px 8px",
          boxShadow: "0 8px 32px rgba(26,23,20,0.14), 0 2px 8px rgba(26,23,20,0.08)",
          transform: `rotate(${card.rotate ?? 0}deg)`,
          transition: "transform 0.4s ease, box-shadow 0.4s ease",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "rotate(0deg) scale(1.05)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = `rotate(${card.rotate ?? 0}deg) scale(1)`; }}
      >
        <div className="relative overflow-hidden" style={{ height: "200px" }}>
          <img src={card.img} alt={card.caption} className="w-full h-full object-cover"
            style={{ filter: "contrast(1.04) saturate(0.88) brightness(0.95) sepia(0.1)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(15,10,5,0.35) 100%)" }} />
        </div>
        <p className="text-center mt-2 text-[#3A2E24] opacity-75"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontStyle: "italic" }}>
          {card.caption}
        </p>
      </div>
    );
  }

  return (
    <div key={`${rowKey}-${idx}`}
      className="relative flex-shrink-0 group overflow-hidden transition-all duration-500 hover:scale-[1.06] hover:z-20"
      style={{
        width: w, height: h, borderRadius: "18px",
        boxShadow: "0 12px 40px rgba(26,23,20,0.18)",
        transform: `rotateY(${-15 + (idx % 8) * 4}deg) translateZ(${-30 + (idx % 4) * 15}px) translateY(${(idx % 3) * 12}px)`,
      }}>
      <img src={card.img} alt={card.caption} className="w-full h-full object-cover"
        style={{
          filter: isDreamy
            ? "contrast(0.94) saturate(0.72) brightness(0.88) blur(1px) sepia(0.12)"
            : "contrast(1.06) saturate(0.88) brightness(0.94) sepia(0.07)",
          transition: "filter 0.5s ease",
        }} />
      <div className="absolute inset-0 group-hover:opacity-60 transition-opacity duration-500"
        style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(10,6,3,0.6) 100%)", borderRadius: "inherit" }} />
      <div className="memory-caption absolute inset-x-0 bottom-0 p-4">
        <p className="font-sans text-[10px] text-white/80 italic">{card.caption}</p>
      </div>
    </div>
  );
}

export default function MemoryScroller() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const pause = () => {
    if (row1Ref.current) row1Ref.current.style.animationPlayState = "paused";
    if (row2Ref.current) row2Ref.current.style.animationPlayState = "paused";
  };
  const resume = () => {
    if (row1Ref.current) row1Ref.current.style.animationPlayState = "running";
    if (row2Ref.current) row2Ref.current.style.animationPlayState = "running";
  };

  return (
    <section id="memories" className="py-28 overflow-hidden relative" style={{ background: "#FDFBF7" }}>

      {/* Subtle warm grain on light bg */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")" }}
      />

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-20 relative z-10">
        <h2 className="font-serif text-5xl md:text-6xl mb-5">
          <span className="text-[#C9A96E]">MEMORIES</span>{" "}
          <span className="text-[#1A1714]">FROM THE ROAD</span>
        </h2>
        <p className="font-sans text-sm tracking-widest text-[rgba(26,23,20,0.45)] uppercase">
          Thousands of solo moments · Each one someone's turning point
        </p>
      </div>

      {/* Scroller */}
      <div className="relative w-full flex flex-col gap-10" style={{ perspective: "1000px" }}
        onMouseEnter={pause} onMouseLeave={resume}>

        <div ref={row1Ref} className="flex gap-8 w-max items-center"
          style={{ animation: "scrollRight 28s linear infinite" }}>
          {row1Cards.map((card, idx) => <MemCard key={`r1-${idx}`} card={card} idx={idx} rowKey="r1" />)}
        </div>

        <div ref={row2Ref} className="flex gap-8 w-max items-center"
          style={{ animation: "scrollLeft 34s linear infinite" }}>
          {row2Cards.map((card, idx) => <MemCard key={`r2-${idx}`} card={card} idx={idx} rowKey="r2" />)}
        </div>

        {/* Light fade masks */}
        <div className="absolute inset-y-0 left-0 w-[10%] pointer-events-none z-10" style={{ background: "linear-gradient(to right,#FDFBF7,transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-[10%] pointer-events-none z-10" style={{ background: "linear-gradient(to left,#FDFBF7,transparent)" }} />
      </div>

      {/* Bottom blend — into dark StoriesRoad */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom,transparent,#0c0a08)" }} />
    </section>
  );
}
