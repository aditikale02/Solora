import { Link } from "wouter";
import SoloraLogo from "./SoloraLogo";

export default function Footer() {
  return (
    <footer className="bg-[#1A1714] pt-32 pb-12 px-6 text-[#F7F0E6] border-t border-[#F7F0E6]/10 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-8">
        
        <div className="lg:w-[40%] space-y-8">
          <SoloraLogo variant="light" size={64} />
          <p className="font-sans text-[#F7F0E6]/70 max-w-sm">
            Discover who you become when you finally explore alone.
          </p>
          
          <div className="flex gap-6">
            {["Instagram", "Twitter/X", "YouTube"].map((social) => (
              <a key={social} href="#" className="text-sm font-sans text-[#F7F0E6]/50 hover:text-[#C9A96E] transition-colors">
                {social}
              </a>
            ))}
          </div>
          
          <div className="pt-8">
            <div className="relative max-w-sm border-b border-[#F7F0E6]/30 focus-within:border-[#C9A96E] transition-colors">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-transparent py-2 outline-none font-sans text-sm placeholder:text-[#F7F0E6]/30"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[#C9A96E]">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="lg:w-[60%] grid grid-cols-2 md:grid-cols-4 gap-8 font-sans text-sm">
          <div className="space-y-4">
            <h4 className="text-[#C9A96E] tracking-widest uppercase text-xs mb-6">About</h4>
            <ul className="space-y-3 text-[#F7F0E6]/70">
              <li><Link href="#">About SOLORA</Link></li>
              <li><Link href="#">Our Philosophy</Link></li>
              <li><Link href="#">Careers</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#C9A96E] tracking-widest uppercase text-xs mb-6">Destinations</h4>
            <ul className="space-y-3 text-[#F7F0E6]/70">
              <li><Link href="#">For Healing</Link></li>
              <li><Link href="#">For Silence</Link></li>
              <li><Link href="#">For Adventure</Link></li>
              <li><Link href="#">For Self-Discovery</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#C9A96E] tracking-widest uppercase text-xs mb-6">Community</h4>
            <ul className="space-y-3 text-[#F7F0E6]/70">
              <li><Link href="#">Explorer Stories</Link></li>
              <li><Link href="#">Testimonials</Link></li>
              <li><Link href="#">Become a Guide</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#C9A96E] tracking-widest uppercase text-xs mb-6">Support</h4>
            <ul className="space-y-3 text-[#F7F0E6]/70">
              <li><Link href="#">Safety & Support</Link></li>
              <li><Link href="#">FAQs</Link></li>
              <li><Link href="#">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
      </div>
      
      <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-[#F7F0E6]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-[#F7F0E6]/50">
        <p>© 2025 SOLORA. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-[#C9A96E] transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-[#C9A96E] transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
