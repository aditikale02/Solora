const requiredVars = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "RESEND_API_KEY",
  "BUSINESS_EMAIL",
  "ADMIN_EMAILS",
  "PORT",
  "CORS_ORIGIN",
] as const;

export type ServerEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  DATABASE_URL: string;
  RESEND_API_KEY: string;
  BUSINESS_EMAIL: string;
  ADMIN_EMAILS: string;
  PORT: number;
  CORS_ORIGIN: string;
};

function requireEnv(name: (typeof requiredVars)[number]): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getServerEnv(): ServerEnv {
  const rawPort = requireEnv("PORT");
  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  return {
    SUPABASE_URL: requireEnv("SUPABASE_URL"),
    SUPABASE_ANON_KEY: requireEnv("SUPABASE_ANON_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    DATABASE_URL: requireEnv("DATABASE_URL"),
    RESEND_API_KEY: requireEnv("RESEND_API_KEY"),
    BUSINESS_EMAIL: requireEnv("BUSINESS_EMAIL"),
    ADMIN_EMAILS: requireEnv("ADMIN_EMAILS"),
    PORT: port,
    CORS_ORIGIN: requireEnv("CORS_ORIGIN"),
  };
}
