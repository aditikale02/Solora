import { Link } from "wouter";
import SoloraLogo from "./SoloraLogo";
import NewsletterSignup from "./NewsletterSignup";
import { useLeadInquiry } from "@/components/lead/LeadInquiryProvider";

export default function Footer() {
  const { openInquiry } = useLeadInquiry();

  return (
    <footer
      className="relative pt-24 pb-10 px-6 text-[#F7F0E6] overflow-hidden"
      style={{ background: "#0F0D0A" }}
    >
      {/* Warm glow remnant from transformation scene above */}
      <div className="absolute top-0 left-0 right-0 h-1 pointer-events-none" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.18), transparent)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] rounded-full pointer-events-none opacity-20" style={{ background: "radial-gradient(ellipse, rgba(201,169,110,0.25) 0%, transparent 70%)", filter: "blur(30px)" }} />

      {/* Grain */}
      <div className="absolute inset-0 grain opacity-[0.025] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-8">

        {/* Left column */}
        <div className="lg:w-[35%] space-y-7">
          <div className="flex items-center gap-3">
            <SoloraLogo variant="light" size={48} />
            <span className="font-serif text-xl tracking-widest text-[#C9A96E]">SOLORA</span>
          </div>

          <p className="font-serif italic text-[#F7F0E6]/55 text-sm leading-relaxed max-w-[260px]">
            "Discover who you become when you finally explore alone."
          </p>

          {/* Social links */}
          <div className="flex gap-6 pt-2">
            {["Instagram", "X / Twitter", "YouTube"].map((social) => (
              <a key={social} href="#" className="font-sans text-xs text-[#F7F0E6]/40 hover:text-[#C9A96E] transition-colors duration-300">
                {social}
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div className="pt-4 max-w-xs">
            <NewsletterSignup />
            <p className="font-sans text-[9px] tracking-widest text-[#F7F0E6]/25 uppercase mt-2">No spam. Only wanderlust.</p>
          </div>
        </div>

        {/* Right columns */}
        <div className="lg:w-[65%] grid grid-cols-2 md:grid-cols-4 gap-10 font-sans text-sm">
          <div className="space-y-4">
            <h4 className="text-[#C9A96E] tracking-[0.25em] uppercase text-[10px] mb-5">Explore</h4>
            <ul className="space-y-3 text-[#F7F0E6]/55">
              {["For Healing", "For Silence", "For Adventure", "For Self-Discovery", "For Slow Living"].map((l) => (
                <li key={l}><Link href="#" className="hover:text-[#F7F0E6] transition-colors duration-300">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#C9A96E] tracking-[0.25em] uppercase text-[10px] mb-5">Community</h4>
            <ul className="space-y-3 text-[#F7F0E6]/55">
              {["Explorer Stories", "Solo Journals", "Become a Guide", "Testimonials"].map((l) => (
                <li key={l}><Link href="#" className="hover:text-[#F7F0E6] transition-colors duration-300">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#C9A96E] tracking-[0.25em] uppercase text-[10px] mb-5">About SOLORA</h4>
            <ul className="space-y-3 text-[#F7F0E6]/55">
              {["Our Philosophy", "The Team", "Careers", "Press"].map((l) => (
                <li key={l}><Link href="#" className="hover:text-[#F7F0E6] transition-colors duration-300">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#C9A96E] tracking-[0.25em] uppercase text-[10px] mb-5">Safety & Support</h4>
            <ul className="space-y-3 text-[#F7F0E6]/55">
              <li><Link href="#" className="hover:text-[#F7F0E6] transition-colors duration-300">FAQs</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInquiry({
                      mode: "contact",
                      source: "footer_contact",
                    })
                  }
                  className="hover:text-[#F7F0E6] transition-colors duration-300 text-left"
                >
                  Contact Us
                </button>
              </li>
              <li><Link href="#" className="hover:text-[#F7F0E6] transition-colors duration-300">Solo Safety Guide</Link></li>
              <li><Link href="#" className="hover:text-[#F7F0E6] transition-colors duration-300">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 max-w-7xl mx-auto mt-20 pt-8 border-t border-[#F7F0E6]/8 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] font-sans text-[#F7F0E6]/30 tracking-widest uppercase">
        <p>© 2026 Solora <span className="text-[#C9A96E]/50 mx-1">—</span> <em className="normal-case tracking-normal text-[#C9A96E]/40 not-italic">Made for the ones still searching for themselves.</em></p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-[#C9A96E] transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-[#C9A96E] transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
