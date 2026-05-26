import { integer, index, pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createdAtColumn, idColumn, updatedAtColumn } from "./shared";

export const destinationCategoriesTable = pgTable(
  "destination_categories",
  {
    id: idColumn,
    title: varchar("title", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    description: text("description").notNull().default(""),
    imageUrl: text("image_url").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
  },
  (table) => ({
    slugUniqueIndex: uniqueIndex("destination_categories_slug_unique_idx").on(table.slug),
    createdAtIndex: index("destination_categories_created_at_idx").on(table.createdAt),
    sortOrderIndex: index("destination_categories_sort_order_idx").on(table.sortOrder),
  }),
);
