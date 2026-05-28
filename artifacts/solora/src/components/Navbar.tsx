import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useLocation } from "wouter";
import { CircleUserRound, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import SoloraLogo from "./SoloraLogo";
import PremiumButton from "./PremiumButton";
import { useLeadInquiry } from "@/components/lead/LeadInquiryProvider";
import { supabase } from "@/lib/supabase";
import { useSessionRole } from "@/hooks/use-session-role";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const navItems = [
  { label: "Destinations", id: "destinations" },
  { label: "Stories",      id: "stories" },
  { label: "Community",    id: "community" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { openInquiry } = useLeadInquiry();
  const session = useSessionRole();
  const [, navigate] = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  const isLoggedIn = session.status === "user" || session.status === "admin";

  const handleJourneyClick = () => {
    if (session.status === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    if (session.status === "user") {
      openInquiry({
        mode: "lead",
        source: "navbar_cta",
      });
      return;
    }

    navigate("/auth");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const dashboardHref = session.status === "admin" ? "/admin/dashboard" : "/dashboard";

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? "rgba(247,242,236,0.08)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,169,110,0.1)" : "none",
        transition: "background 0.6s ease, backdrop-filter 0.6s ease, border-bottom 0.6s ease",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="group flex items-center gap-4 cursor-none bg-transparent border-none p-0"
          aria-label="Return to top"
        >
          <div className="w-[clamp(48px,5.5vw,62px)]">
            <SoloraLogo variant="light" />
          </div>
          <span
            className="font-serif text-[clamp(1.25rem,2vw,1.55rem)] tracking-widest text-[#F7F0E6] transition-colors duration-500"
          >
            SOLORA
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="cursor-none bg-transparent border-none p-0 group"
            >
              <span className="text-sm tracking-widest uppercase text-[#F7F0E6]/70 hover:text-[#C9A96E] transition-colors duration-300">
                {label}
              </span>
            </button>
          ))}
          <Link href="/packages" className="text-sm tracking-widest uppercase text-[#F7F0E6]/70 hover:text-[#C9A96E] transition-colors duration-300">
            Packages
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="rounded-full border border-[rgba(201,169,110,0.25)] bg-[rgba(247,242,236,0.08)] px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F7F0E6] backdrop-blur-xl transition hover:border-[rgba(201,169,110,0.55)] hover:bg-[rgba(247,242,236,0.12)]"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="rounded-full border border-[rgba(201,169,110,0.25)] bg-[rgba(247,242,236,0.08)] px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F7F0E6] backdrop-blur-xl transition hover:border-[rgba(201,169,110,0.55)] hover:bg-[rgba(247,242,236,0.12)]"
              >
                Signup
              </button>
              <PremiumButton variant="secondary" onClick={handleJourneyClick}>
                Begin Your Journey
              </PremiumButton>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-[rgba(201,169,110,0.25)] bg-[rgba(247,242,236,0.08)] px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F7F0E6] backdrop-blur-xl transition hover:border-[rgba(201,169,110,0.55)] hover:bg-[rgba(247,242,236,0.12)]">
                <CircleUserRound className="size-4" />
                Profile
              </Link>
              <Link href={dashboardHref} className="inline-flex items-center gap-2 rounded-full border border-[rgba(201,169,110,0.25)] bg-[rgba(247,242,236,0.08)] px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F7F0E6] backdrop-blur-xl transition hover:border-[rgba(201,169,110,0.55)] hover:bg-[rgba(247,242,236,0.12)]">
                <LayoutDashboard className="size-4" />
                {session.status === "admin" ? "Admin Dashboard" : "Dashboard"}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(201,169,110,0.25)] bg-[rgba(247,242,236,0.08)] px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F7F0E6] backdrop-blur-xl transition hover:border-[rgba(201,169,110,0.55)] hover:bg-[rgba(247,242,236,0.12)]"
              >
                <LogOut className="size-4" />
                Logout
              </button>
              <PremiumButton variant="secondary" onClick={handleJourneyClick}>
                Begin Your Journey
              </PremiumButton>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="rounded-full border border-[rgba(201,169,110,0.25)] bg-[rgba(247,242,236,0.08)] px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#F7F0E6] backdrop-blur-xl transition hover:border-[rgba(201,169,110,0.55)]"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="rounded-full border border-[rgba(201,169,110,0.25)] bg-[rgba(247,242,236,0.08)] px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#F7F0E6] backdrop-blur-xl transition hover:border-[rgba(201,169,110,0.55)]"
          >
            Signup
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(201,169,110,0.25)] bg-[rgba(247,242,236,0.08)] text-[#F7F0E6] backdrop-blur-xl transition hover:border-[rgba(201,169,110,0.55)]"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 md:hidden">
          <div className="rounded-[24px] border border-[rgba(201,169,110,0.18)] bg-[rgba(15,13,10,0.72)] p-4 text-[#F7F0E6] shadow-2xl backdrop-blur-2xl">
            <div className="grid gap-2">
              <Link
                href="/packages"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-left text-sm tracking-wide text-[#F7F0E6]/84"
              >
                Packages
              </Link>
              {navItems.map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => {
                    scrollTo(id);
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-left text-sm tracking-wide text-[#F7F0E6]/84"
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleJourneyClick();
                }}
                className="rounded-2xl border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.12)] px-4 py-3 text-left text-sm tracking-wide text-[#F7F0E6]"
              >
                Begin Your Journey
              </button>
              {!isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/auth");
                    }}
                    className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-left text-sm tracking-wide text-[#F7F0E6]/84"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/signup");
                    }}
                    className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-left text-sm tracking-wide text-[#F7F0E6]/84"
                  >
                    Signup
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm tracking-wide text-[#F7F0E6]/84"
                  >
                    <CircleUserRound className="size-4" />
                    Profile
                  </Link>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm tracking-wide text-[#F7F0E6]/84"
                  >
                    <LayoutDashboard className="size-4" />
                    {session.status === "admin" ? "Admin Dashboard" : "Dashboard"}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-left text-sm tracking-wide text-[#F7F0E6]/84"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
