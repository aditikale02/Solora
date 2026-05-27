import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { fetchSessionRole } from "@workspace/api-client-react";
import { isAllowedAdminEmail } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

export type SessionRoleState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "user"; email: string; fullName?: string }
  | { status: "admin"; email: string; fullName?: string };

async function resolveState(session: Session | null): Promise<SessionRoleState> {
  if (!session?.access_token) {
    return { status: "signed-out" };
  }

  try {
    const role = await fetchSessionRole();

    if (role.role === "admin") {
      return {
        status: "admin",
        email: role.email ?? session.user.email ?? "",
        fullName: role.fullName,
      };
    }

    if (role.role === "user") {
      return {
        status: "user",
        email: role.email ?? session.user.email ?? "",
        fullName: role.fullName,
      };
    }
  } catch {
    const email = session.user.email ?? "";

    return {
      status: isAllowedAdminEmail(email) ? "admin" : "user",
      email,
      fullName: session.user.user_metadata?.full_name as string | undefined,
    };
  }

  return { status: "signed-out" };
}

export function useSessionRole() {
  const [state, setState] = useState<SessionRoleState>({ status: "loading" });

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setState(await resolveState(data.session));
    });

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState(await resolveState(session));
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return state;
}
