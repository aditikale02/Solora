import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminSession } from "@/hooks/use-admin-session";
import { signInAdmin } from "@/lib/admin-auth";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const session = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session.status === "signed-in") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate, session.status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signInAdmin(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#1A1714] text-[#F7F0E6]">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-md border border-[#C9A96E]/30 bg-[#C9A96E]/10">
            <LockKeyhole className="size-5 text-[#C9A96E]" />
          </div>
          <div>
            <p className="font-serif text-3xl leading-none">Solora Admin</p>
            <p className="mt-1 text-sm text-[#F7F0E6]/60">Protected operations dashboard</p>
          </div>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border-[#C9A96E]/25 bg-[#F7F0E6] text-[#1A1714]"
              autoComplete="email"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border-[#C9A96E]/25 bg-[#F7F0E6] text-[#1A1714]"
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <p className="rounded-md border border-red-300/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 bg-[#C9A96E] text-[#1A1714] hover:bg-[#d7b777]"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
