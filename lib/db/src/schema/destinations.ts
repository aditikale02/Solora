import { index, pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createdAtColumn, idColumn, updatedAtColumn } from "./shared";

export const destinationsTable = pgTable(
  "destinations",
  {
    id: idColumn,
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    description: text("description").notNull().default(""),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
  },
  (table) => ({
    slugUniqueIndex: uniqueIndex("destinations_slug_unique_idx").on(table.slug),
    createdAtIndex: index("destinations_created_at_idx").on(table.createdAt),
  }),
);
