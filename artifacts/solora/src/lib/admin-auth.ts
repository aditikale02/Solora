import { supabase } from "./supabase";

export type AdminSessionState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "forbidden"; email: string }
  | { status: "signed-in"; email: string };

export function getAdminEmails(): Set<string> {
  return new Set(
    (import.meta.env.VITE_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email: string) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().has(email.toLowerCase());
}

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!isAllowedAdminEmail(data.user.email ?? undefined)) {
    await supabase.auth.signOut({ scope: "local" });
    throw new Error("This account is not approved for Solora admin access.");
  }

  return data;
}

export async function signOutAdmin() {
  await supabase.auth.signOut({ scope: "local" });
}
