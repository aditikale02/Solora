import { useRef } from "react";

const cards = [
  { caption: "Spiti, 4100m", bg: "linear-gradient(135deg, #ff6b35, #f7931e, #ffd700)" },
  { caption: "Sunrise, Hampi", bg: "linear-gradient(180deg, #667eea, #764ba2)" },
  { caption: "Solo, Kasol", bg: "linear-gradient(135deg, #2d5016, #6a9e3f, #a8d5a2)" },
  { caption: "Hidden, Gokarna", bg: "linear-gradient(135deg, #c9a96e, #e8c97e, #f5e6c8)" },
  { caption: "Dawn, Mcleodganj", bg: "linear-gradient(180deg, #0077b6, #00b4d8, #90e0ef)" },
  { caption: "Silence, Zuluk", bg: "linear-gradient(135deg, #1a1714, #2b3f5c, #3d5a80)" },
  { caption: "Found, Pushkar", bg: "linear-gradient(135deg, #f77f00, #d62828, #fcbf49)" },
  { caption: "Free, Coorg", bg: "linear-gradient(180deg, #d8e2dc, #a8c5b0, #588157)" },
];

// Duplicate for infinite scroll
const row1Cards = [...cards, ...cards];
const row2Cards = [...[...cards].reverse(), ...[...cards].reverse()];

export default function MemoryScroller() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (row1Ref.current) row1Ref.current.style.animationPlayState = "paused";
    if (row2Ref.current) row2Ref.current.style.animationPlayState = "paused";
  };

  const handleMouseLeave = () => {
    if (row1Ref.current) row1Ref.current.style.animationPlayState = "running";
    if (row2Ref.current) row2Ref.current.style.animationPlayState = "running";
  };

  return (
    <section className="bg-[#0f0d0b] py-32 overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-6 text-center mb-24 relative z-10">
        <h2 className="font-serif text-5xl md:text-6xl mb-6">
          <span className="text-[#C9A96E]">MEMORIES</span> <span className="text-[#1A1714] text-stroke-white" style={{ WebkitTextStroke: "1px rgba(255,248,235,0.4)" }}>FROM THE ROAD</span>
        </h2>
        <p className="font-sans text-[#F7F0E6]/70 text-lg">
          Thousands of solo moments. Each one someone's turning point.
        </p>
      </div>

      <div 
        className="relative w-full h-[700px] flex flex-col gap-12 justify-center"
        style={{ perspective: "1000px", perspectiveOrigin: "center center" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Row 1 (Right) */}
        <div 
          ref={row1Ref}
          className="flex gap-8 w-max"
          style={{ animation: "scrollRight 30s linear infinite" }}
        >
          {row1Cards.map((card, idx) => (
            <div 
              key={`r1-${idx}`}
              className="group relative w-[200px] h-[280px] rounded-[20px] overflow-hidden transition-all duration-500 hover:scale-108 hover:z-20 hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              style={{
                background: card.bg,
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                transform: `rotateY(${-20 + (idx % 8) * 5}deg) translateZ(${-40 + (idx % 4) * 20}px) translateY(${(idx % 3) * 15}px)`,
              }}
            >
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <p className="font-sans text-xs text-white/85">{card.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 (Left) */}
        <div 
          ref={row2Ref}
          className="flex gap-8 w-max"
          style={{ animation: "scrollLeft 25s linear infinite" }}
        >
          {row2Cards.map((card, idx) => (
            <div 
              key={`r2-${idx}`}
              className="group relative w-[200px] h-[280px] rounded-[20px] overflow-hidden transition-all duration-500 hover:scale-108 hover:z-20 hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              style={{
                background: card.bg,
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                transform: `rotateY(${20 - (idx % 8) * 5}deg) translateZ(${40 - (idx % 4) * 20}px) translateY(${-(idx % 3) * 15}px)`,
              }}
            >
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <p className="font-sans text-xs text-white/85">{card.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fade Masks */}
        <div className="absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-[#0f0d0b] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-[#0f0d0b] to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
