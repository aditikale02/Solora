import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { isAllowedAdminEmail, type AdminSessionState } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

function getState(session: Session | null): AdminSessionState {
  const email = session?.user.email ?? null;

  if (!email) {
    return { status: "signed-out" };
  }

  if (!isAllowedAdminEmail(email)) {
    return { status: "forbidden", email };
  }

  return { status: "signed-in", email };
}

export function useAdminSession() {
  const [state, setState] = useState<AdminSessionState>({ status: "loading" });

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setState(getState(data.session));
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(getState(session));
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return state;
}
