import { type AdminSessionState } from "@/lib/admin-auth";
import { useSessionRole } from "./use-session-role";

export function useAdminSession() {
  const sessionRole = useSessionRole();

  if (sessionRole.status === "loading") {
    return { status: "loading" } as AdminSessionState;
  }

  if (sessionRole.status === "admin") {
    return { status: "signed-in", email: sessionRole.email } as AdminSessionState;
  }

  if (sessionRole.status === "user") {
    return { status: "forbidden", email: sessionRole.email } as AdminSessionState;
  }

  return { status: "signed-out" } as AdminSessionState;
}
