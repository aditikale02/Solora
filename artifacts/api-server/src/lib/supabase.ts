import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "./env";

const env = getServerEnv();

export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);