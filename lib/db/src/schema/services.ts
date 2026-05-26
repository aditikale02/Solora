import { index, pgTable, uniqueIndex, varchar, text, boolean } from "drizzle-orm/pg-core";
import { createdAtColumn, idColumn, updatedAtColumn } from "./shared";

export const servicesTable = pgTable(
  "services",
  {
    id: idColumn,
    title: varchar("title", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    description: text("description").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
  },
  (table) => ({
    slugUniqueIndex: uniqueIndex("services_slug_unique_idx").on(table.slug),
    isActiveIndex: index("services_is_active_idx").on(table.isActive),
    createdAtIndex: index("services_created_at_idx").on(table.createdAt),
  }),
);
