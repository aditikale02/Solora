import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const lensRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = 0, mouseY = 0;
    let lensX = 0, lensY = 0;
    let ringX = 0, ringY = 0;
    let rafId = 0;

    const LENS_LERP = 0.25;  // Increased from 0.12 for faster movement
    const RING_LERP = 0.18;  // Increased from 0.07 for faster movement
    const MAGNIFY_RADIUS = 120;
    const MAGNIFY_SCALE = 1.35;

    // ── mouse tracking ──
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // ── cursor state per context ──
    const onMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!lensRef.current || !ringRef.current || !handleRef.current) return;
      const isBtn = !!(t.closest("button") || t.closest("a") || t.closest("[role='button']"));
      const isText = ["H1","H2","H3","H4","H5","P","SPAN","EM","BLOCKQUOTE"].includes(t.tagName);

      if (isBtn) {
        lensRef.current.style.cssText += ";width:52px;height:52px;background:rgba(201,169,110,0.12);border-color:rgba(201,169,110,0.72);";
        ringRef.current.style.cssText += ";width:62px;height:62px;";
        handleRef.current.style.opacity = "0";
      } else if (isText) {
        lensRef.current.style.cssText += ";width:56px;height:56px;background:rgba(255,248,235,0.06);border-color:rgba(201,169,110,0.68);box-shadow:inset 0 0 16px rgba(255,248,235,0.1),0 0 32px rgba(201,169,110,0.18),0 4px 24px rgba(0,0,0,0.2);";
        ringRef.current.style.cssText += ";width:76px;height:76px;";
        handleRef.current.style.opacity = "1";
      } else {
        lensRef.current.style.cssText += ";width:48px;height:48px;background:rgba(255,248,235,0.04);border-color:rgba(201,169,110,0.5);box-shadow:inset 0 0 12px rgba(255,248,235,0.06),0 0 20px rgba(201,169,110,0.08),0 4px 20px rgba(0,0,0,0.15);";
        ringRef.current.style.cssText += ";width:72px;height:72px;";
        handleRef.current.style.opacity = "1";
      }
    };

    // ── text magnification (only for slogans/quotes) ──
    const getTextTargets = (): HTMLElement[] =>
      Array.from(document.querySelectorAll<HTMLElement>(
        ".peaceful-quote, em, blockquote, [class*='slogan'], [class*='tagline'], [class*='quote']"
      )).filter(el => !el.closest("nav") && !el.closest("[data-fixed]"));

    let textTargets: HTMLElement[] = [];
    // Refresh targets periodically (lazy DOM content)
    const refreshTargets = () => { textTargets = getTextTargets(); };
    refreshTargets();
    const refreshInterval = window.setInterval(refreshTargets, 2000);

    // ── main RAF loop ──
    const animate = () => {
      lensX += (mouseX - lensX) * LENS_LERP;
      lensY += (mouseY - lensY) * LENS_LERP;
      ringX += (mouseX - ringX) * RING_LERP;
      ringY += (mouseY - ringY) * RING_LERP;

      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${lensX - 24}px, ${lensY - 24}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 36}px, ${ringY - 36}px, 0)`;
      }
      if (handleRef.current) {
        handleRef.current.style.transform = `translate3d(${lensX + 13}px, ${lensY + 13}px, 0) rotate(45deg)`;
      }

      // Text magnification
      for (const el of textTargets) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(lensX - cx, lensY - cy);
        const influence = MAGNIFY_RADIUS * 2.5;

        if (dist < influence) {
          const prox = 1 - dist / influence;
          const scale = 1 + (MAGNIFY_SCALE - 1) * prox * prox;
          const sharp = prox * 0.25;
          el.style.transform = `scale(${scale.toFixed(3)})`;
          el.style.transformOrigin = `${(lensX - rect.left).toFixed(1)}px ${(lensY - rect.top).toFixed(1)}px`;
          el.style.transition = "transform 0.15s ease, filter 0.15s ease, text-shadow 0.2s ease";
          el.style.filter = `contrast(${(1 + sharp * 0.12).toFixed(3)})`;
          el.style.textShadow = `0 0 ${(prox * 28).toFixed(0)}px rgba(201,169,110,${(prox * 0.22).toFixed(2)})`;
        } else {
          el.style.transform = "scale(1)";
          el.style.filter = "";
          el.style.textShadow = "";
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
      clearInterval(refreshInterval);
      // Reset all magnified elements
      for (const el of textTargets) {
        el.style.transform = "";
        el.style.filter = "";
        el.style.textShadow = "";
      }
    };
  }, []);

  return (
    <>
      {/* Layer 1 — Inner lens */}
      <div
        ref={lensRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{
          width: "48px",
          height: "48px",
          background: "rgba(255,248,235,0.04)",
          backdropFilter: "blur(0.5px)",
          border: "1px solid rgba(201,169,110,0.5)",
          boxShadow: "inset 0 0 12px rgba(255,248,235,0.06), 0 0 20px rgba(201,169,110,0.08), 0 4px 20px rgba(0,0,0,0.15)",
          willChange: "transform",
          transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), height 0.5s cubic-bezier(0.16,1,0.3,1), background 0.5s, border-color 0.5s, box-shadow 0.5s",
        }}
      />

      {/* Layer 2 — Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{
          width: "72px",
          height: "72px",
          border: "1px solid rgba(201,169,110,0.15)",
          willChange: "transform",
          transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), height 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      {/* Layer 3 — Magnifying glass handle */}
      <div
        ref={handleRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          width: "13px",
          height: "1.5px",
          background: "rgba(201,169,110,0.45)",
          borderRadius: "2px",
          willChange: "transform",
          transformOrigin: "left center",
          transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </>
  );
}
