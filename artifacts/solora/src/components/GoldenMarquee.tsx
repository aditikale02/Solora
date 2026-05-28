export default function GoldenMarquee() {
  const destinations = [
    "LADAKH",
    "GOA",
    "KERALA",
    "RAJASTHAN",
    "HIMACHAL",
    "ANDAMAN",
    "VARANASI",
    "MEGHALAYA",
    "KASHMIR",
  ];

  const marqueeContent = destinations.join(" ✦ ") + " ✦ ";

  return (
    <div className="relative w-full overflow-hidden bg-[#C9A84C] h-12 flex items-center">
      <div 
        className="flex whitespace-nowrap"
        style={{
          animation: "marquee 30s linear infinite",
        }}
      >
        <span className="inline-block font-sans text-sm tracking-[0.25em] uppercase text-[#1A1714] font-medium pr-4">
          {marqueeContent}
        </span>
        <span className="inline-block font-sans text-sm tracking-[0.25em] uppercase text-[#1A1714] font-medium">
          {marqueeContent}
        </span>
      </div>
    </div>
  );
}
