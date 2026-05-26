import { index, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { createdAtColumn, idColumn } from "./shared";

export const contactSubmissionsTable = pgTable(
  "contact_submissions",
  {
    id: idColumn,
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    subject: varchar("subject", { length: 200 }).notNull(),
    message: text("message").notNull(),
    source: varchar("source", { length: 80 }).notNull().default("website"),
    createdAt: createdAtColumn,
  },
  (table) => ({
    emailIndex: index("contact_submissions_email_idx").on(table.email),
    createdAtIndex: index("contact_submissions_created_at_idx").on(table.createdAt),
  }),
);
