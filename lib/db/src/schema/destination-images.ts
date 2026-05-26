import { boolean, index, integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { destinationsTable } from "./destinations";
import { createdAtColumn, idColumn } from "./shared";

export const destinationImagesTable = pgTable(
  "destination_images",
  {
    id: idColumn,
    destinationId: uuid("destination_id")
      .notNull()
      .references(() => destinationsTable.id, { onDelete: "cascade" }),
    storagePath: text("storage_path").notNull(),
    publicUrl: text("public_url").notNull(),
    altText: varchar("alt_text", { length: 240 }).notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    isHero: boolean("is_hero").notNull().default(false),
    createdAt: createdAtColumn,
  },
  (table) => ({
    destinationIndex: index("destination_images_destination_id_idx").on(table.destinationId),
    sortOrderIndex: index("destination_images_sort_order_idx").on(table.sortOrder),
  }),
);
