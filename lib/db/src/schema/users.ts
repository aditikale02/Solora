import { index, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createdAtColumn, idColumn } from "./shared";

export const usersTable = pgTable(
  "users",
  {
    id: idColumn,
    fullName: varchar("full_name", { length: 160 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    createdAt: createdAtColumn,
  },
  (table) => ({
    emailUniqueIndex: uniqueIndex("users_email_unique_idx").on(table.email),
    createdAtIndex: index("users_created_at_idx").on(table.createdAt),
  }),
);
