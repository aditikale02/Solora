import { createClient } from "@supabase/supabase-js";
import { setAuthTokenGetter } from "@workspace/api-client-react";

const FALLBACK_SUPABASE_URL = "https://iekygvfianzgklwpgiqr.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla3lndmZpYW56Z2tsd3BnaXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzA5NTgsImV4cCI6MjA5NTEwNjk1OH0.AwSLDQLfOc8O-29UoYg6sf76JWdBOVV7lfIOTLiFnPw";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? FALLBACK_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? FALLBACK_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.");
}

// Warn when falling back to embedded demo credentials so deploys surface configuration issues
if (supabaseUrl === FALLBACK_SUPABASE_URL || supabaseAnonKey === FALLBACK_SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[supabase] Using fallback demo credentials. Ensure VITE_SUPABASE_* env vars are set in your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

setAuthTokenGetter(async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
});
