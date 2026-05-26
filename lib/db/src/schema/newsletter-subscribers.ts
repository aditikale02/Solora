import { index, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createdAtColumn, idColumn } from "./shared";

export const newsletterSubscribersTable = pgTable(
  "newsletter_subscribers",
  {
    id: idColumn,
    email: varchar("email", { length: 320 }).notNull(),
    source: varchar("source", { length: 80 }).notNull().default("website"),
    createdAt: createdAtColumn,
  },
  (table) => ({
    emailUniqueIndex: uniqueIndex("newsletter_subscribers_email_unique_idx").on(table.email),
    createdAtIndex: index("newsletter_subscribers_created_at_idx").on(table.createdAt),
  }),
);
