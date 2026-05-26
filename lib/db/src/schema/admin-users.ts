import { index, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createdAtColumn, idColumn } from "./shared";

export const adminUsersTable = pgTable(
  "admin_users",
  {
    id: idColumn,
    email: varchar("email", { length: 320 }).notNull(),
    createdAt: createdAtColumn,
  },
  (table) => ({
    emailUniqueIndex: uniqueIndex("admin_users_email_unique_idx").on(table.email),
    createdAtIndex: index("admin_users_created_at_idx").on(table.createdAt),
  }),
);
