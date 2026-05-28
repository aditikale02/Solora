import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight, CircleUserRound, LogIn, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { signInAdmin, signInWithPassword } from "@/lib/admin-auth";
import { isAllowedAdminEmail } from "@/lib/admin-auth";
import { useSessionRole } from "@/hooks/use-session-role";

function AuthBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0F0D0A]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,169,110,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(141,188,156,0.16),transparent_30%),linear-gradient(180deg,rgba(15,13,10,0.96),rgba(15,13,10,0.82))]" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.35),rgba(0,0,0,0.08))]" />
    </div>
  );
}

const glassInputClassName =
  "h-11 border-white/20 bg-white/10 text-[#F7F0E6] caret-[#C9A96E] placeholder:text-[#F7F0E6]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] focus-visible:border-[#C9A96E]/80 focus-visible:ring-2 focus-visible:ring-[#C9A96E]/40 focus-visible:ring-offset-0 focus-visible:bg-white/15 selection:bg-[#C9A96E]/30 selection:text-[#F7F0E6] transition-all duration-200";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const sessionRole = useSessionRole();
  const isAdminPath = typeof window !== "undefined" && window.location.pathname === "/admin/login";
  const initialTab = useMemo<"login" | "signup">(() => {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/login";
    return pathname === "/signup" ? "signup" : "login";
  }, []);
  const [tab, setTab] = useState<"login" | "signup">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sessionRole.status === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }

    if (sessionRole.status === "user") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, sessionRole.status]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (isAdminPath) {
        await signInAdmin(email, password);
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      const data = await signInWithPassword(email, password);
      if (isAllowedAdminEmail(data.user.email ?? email)) {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        if (isAllowedAdminEmail(data.user?.email ?? email)) {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
        return;
      }

      toast.success("Account created. Check your email to confirm your account.");
      setTab("login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign up.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0F0D0A] text-[#F7F0E6]">
      <AuthBackdrop />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl sm:p-10">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#C9A96E]">Solora Access</p>
              <h1 className="mt-4 max-w-xl font-serif text-5xl leading-tight sm:text-6xl">
                Explore India freely. Save your journey when you’re ready.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#F7F0E6]/72 sm:text-base">
                Browse destinations, packages, and categories without logging in. Sign in only when you want a personalized dashboard, wishlist, or travel planning tools.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Travel-first", "Premium routes and immersive browsing."],
                ["Personalized", "Saved trips, history, and future planning."],
                ["Protected", "Admins and travelers stay cleanly separated."],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-medium text-[#F7F0E6]">{title}</p>
                  <p className="mt-2 text-xs leading-6 text-[#F7F0E6]/58">{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[rgba(247,242,236,0.08)] p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-[#F7F0E6]/80">
              <Sparkles className="size-4 text-[#C9A96E]" />
              <span>{isAdminPath ? "Admin access uses the same login page." : "Traveler access is one step away."}</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`rounded-xl px-4 py-3 text-sm transition ${tab === "login" ? "bg-[#C9A96E] text-[#1A1714]" : "text-[#F7F0E6]/72"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setTab("signup")}
                className={`rounded-xl px-4 py-3 text-sm transition ${tab === "signup" ? "bg-[#C9A96E] text-[#1A1714]" : "text-[#F7F0E6]/72"}`}
              >
                Signup
              </button>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/", { replace: false })}
                className="h-11 w-full justify-between border border-white/8 bg-transparent text-[#F7F0E6]/75 hover:bg-white/5 hover:text-[#F7F0E6]"
              >
                <span>Continue exploring without login</span>
                <ChevronRight className="size-4" />
              </Button>
            </div>

            {tab === "login" ? (
              <form className="mt-6 grid gap-4" onSubmit={handleLogin}>
                <div className="grid gap-2">
                  <Label htmlFor="auth-email">Email</Label>
                  <Input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={glassInputClassName}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="auth-password">Password</Label>
                  <Input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={glassInputClassName}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="h-11 bg-[#C9A96E] text-[#1A1714] hover:bg-[#d7b777]">
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            ) : (
              <form className="mt-6 grid gap-4" onSubmit={handleSignup}>
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className={glassInputClassName}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={glassInputClassName}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={glassInputClassName}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className={glassInputClassName}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="h-11 bg-[#C9A96E] text-[#1A1714] hover:bg-[#d7b777]">
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
