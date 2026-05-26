import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/src/schema",
  out: "./lib/db/src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
