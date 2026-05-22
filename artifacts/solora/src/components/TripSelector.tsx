import { useState } from "react";
import { motion } from "framer-motion";

const destinations = [
  { value: "spiti",        label: "Spiti Valley — For Silence" },
  { value: "meghalaya",    label: "Meghalaya — For Healing" },
  { value: "hampi",        label: "Hampi — For Self-Discovery" },
  { value: "kasol",        label: "Kasol — For Escape" },
  { value: "varanasi",     label: "Varanasi — For Depth" },
  { value: "pondicherry",  label: "Pondicherry — For Slow Living" },
  { value: "gokarna",      label: "Gokarna — For Freedom" },
  { value: "leh",          label: "Leh-Ladakh — For Adventure" },
  { value: "coorg",        label: "Coorg — For Peace" },
  { value: "mcleodganj",   label: "McLeodganj — For Solitude" },
];

const stats = [
  { number: "180+",    label: "Destinations" },
  { number: "12,000+", label: "Solo Travelers" },
  { number: "98%",     label: "Would Return" },
];

export default function TripSelector() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState<string | null>(null);

  const handleDates = (start: string, end: string) => {
    if (!start || !end) { setDuration(null); return; }
    const diff = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000);
    setDuration(diff < 0 ? "Invalid dates" : `${diff} day${diff !== 1 ? "s" : ""}`);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,248,235,0.55)",
    border: "1px solid rgba(201,169,110,0.3)",
    borderRadius: "8px",
    color: "#1A1714",
    fontSize: "16px",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    minHeight: "48px",
    cursor: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "rgba(26,23,20,0.6)",
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontFamily: "var(--app-font-sans)",
    marginBottom: "8px",
    fontWeight: 500,
  };

  return (
    <section
      id="selector"
      className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg,#F9F6F0 0%,#F5F0E8 100%)" }}
    >
      {/* Warm ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(201,169,110,0.08) 0%,transparent 70%)" }}
      />

      <div className="relative z-10 max-w-xl mx-auto text-center">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#C9A96E] mb-4">
            Your Journey Awaits
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1A1714] font-light leading-tight">
            When Are You Ready
            <br />
            <em className="italic text-[#8B6340]">to Explore?</em>
          </h2>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "rgba(255,248,235,0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(201,169,110,0.22)",
            borderRadius: "16px",
            padding: "clamp(1.5rem,4vw,2.5rem)",
            marginBottom: "2.5rem",
            boxShadow: "0 8px 40px rgba(26,23,20,0.06)",
          }}
        >
          {/* Destination */}
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={labelStyle}>Where do you want to go?</label>
            <div style={{ position: "relative" }}>
              <select
                value={destination}
                onChange={e => setDestination(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(201,169,110,0.65)"; e.target.style.boxShadow = "0 0 0 3px rgba(201,169,110,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(201,169,110,0.3)"; e.target.style.boxShadow = "none"; }}
              >
                <option value="">Choose a destination…</option>
                {destinations.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#C9A96E", fontSize: "10px" }}>▼</div>
            </div>
          </div>

          {/* Dates — two columns on desktop, stacked on mobile */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(0.75rem,2vw,1.2rem)", marginBottom: "20px" }}
            className="date-grid"
          >
            <div style={{ textAlign: "left" }}>
              <label style={labelStyle}>Start date</label>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => { setStartDate(e.target.value); handleDates(e.target.value, endDate); }}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(201,169,110,0.65)"; e.target.style.boxShadow = "0 0 0 3px rgba(201,169,110,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(201,169,110,0.3)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div style={{ textAlign: "left" }}>
              <label style={labelStyle}>End date</label>
              <input
                type="date"
                value={endDate}
                min={startDate || new Date().toISOString().split("T")[0]}
                onChange={e => { setEndDate(e.target.value); handleDates(startDate, e.target.value); }}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(201,169,110,0.65)"; e.target.style.boxShadow = "0 0 0 3px rgba(201,169,110,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(201,169,110,0.3)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* Duration display */}
          <div
            style={{
              background: "rgba(201,169,110,0.1)",
              borderLeft: "2px solid rgba(201,169,110,0.45)",
              padding: "12px 16px",
              borderRadius: "4px",
              marginBottom: "22px",
              textAlign: "left",
            }}
          >
            <p style={{ color: "rgba(26,23,20,0.7)", fontSize: "0.9rem", margin: 0, fontFamily: "var(--app-font-sans)" }}>
              Trip duration:{" "}
              <strong style={{ color: "#1A1714", fontWeight: 600 }}>
                {duration ?? "—"}
              </strong>
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              width: "100%",
              padding: "16px 24px",
              minHeight: "52px",
              background: "linear-gradient(135deg,rgba(201,169,110,0.16) 0%,rgba(201,169,110,0.08) 100%)",
              border: "1px solid rgba(201,169,110,0.42)",
              borderRadius: "100px",
              color: "#1A1714",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "none",
              fontFamily: "var(--app-font-sans)",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.7)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(201,169,110,0.12)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.42)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Find My Perfect Trip
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-3 gap-6 md:gap-10"
        >
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div
                className="font-serif mb-1"
                style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", color: "rgba(201,169,110,0.9)", fontWeight: 300 }}
              >
                {s.number}
              </div>
              <div
                className="font-sans uppercase tracking-widest"
                style={{ fontSize: "clamp(8px,1vw,11px)", color: "rgba(26,23,20,0.52)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Top blend — from dark ExplorerTransition above */}
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to bottom,#0F0D0A,transparent)" }} />
      {/* Bottom blend — into CinematicDestinations (also light) */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none" style={{ background: "linear-gradient(to bottom,transparent,#F5F0E8)" }} />

      <style>{`
        @media (max-width: 640px) {
          .date-grid { grid-template-columns: 1fr !important; }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0.5; cursor: pointer;
        }
      `}</style>
    </section>
  );
}
