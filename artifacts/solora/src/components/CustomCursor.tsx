import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const lensRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice()) return;

    let mouseX = 0, mouseY = 0;
    let lensX = 0, lensY = 0;
    let ringX = 0, ringY = 0;
    let rafId = 0;

    const LENS_LERP = 0.12;
    const RING_LERP = 0.07;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isButton = target.closest("button") || target.closest("a") || target.closest("[role='button']");
      const isOrbitNode = target.closest(".orbit-node");
      const isText = ["H1","H2","H3","H4","P","SPAN","EM"].includes(target.tagName);

      if (!lensRef.current || !ringRef.current || !handleRef.current) return;

      if (isButton) {
        lensRef.current.style.width = "54px";
        lensRef.current.style.height = "54px";
        lensRef.current.style.background = "rgba(201,169,110,0.12)";
        lensRef.current.style.borderColor = "rgba(201,169,110,0.7)";
        handleRef.current.style.opacity = "0";
        ringRef.current.style.width = "64px";
        ringRef.current.style.height = "64px";
      } else if (isOrbitNode) {
        lensRef.current.style.width = "58px";
        lensRef.current.style.height = "58px";
        lensRef.current.style.background = "rgba(255,248,235,0.06)";
        lensRef.current.style.borderColor = "rgba(201,169,110,0.55)";
        handleRef.current.style.opacity = "1";
        ringRef.current.style.width = "80px";
        ringRef.current.style.height = "80px";
      } else if (isText) {
        lensRef.current.style.width = "58px";
        lensRef.current.style.height = "58px";
        lensRef.current.style.background = "rgba(255,248,235,0.03)";
        lensRef.current.style.borderColor = "rgba(201,169,110,0.45)";
        handleRef.current.style.opacity = "1";
        ringRef.current.style.width = "76px";
        ringRef.current.style.height = "76px";
      } else {
        lensRef.current.style.width = "48px";
        lensRef.current.style.height = "48px";
        lensRef.current.style.background = "rgba(255,248,235,0.04)";
        lensRef.current.style.borderColor = "rgba(201,169,110,0.5)";
        handleRef.current.style.opacity = "1";
        ringRef.current.style.width = "72px";
        ringRef.current.style.height = "72px";
      }
    };

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
        handleRef.current.style.transform = `translate3d(${lensX + 14}px, ${lensY + 14}px, 0) rotate(45deg)`;
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
          transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), height 0.5s cubic-bezier(0.16,1,0.3,1), background 0.5s, border-color 0.5s",
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
          width: "12px",
          height: "1.5px",
          background: "rgba(201,169,110,0.45)",
          borderRadius: "2px",
          willChange: "transform",
          transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1)",
          transformOrigin: "left center",
        }}
      />
    </>
  );
}
