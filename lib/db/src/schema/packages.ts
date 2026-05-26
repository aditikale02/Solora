import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { destinationsTable } from "./destinations";
import { createdAtColumn, idColumn, updatedAtColumn } from "./shared";

export const packagesTable = pgTable(
  "packages",
  {
    id: idColumn,
    destinationId: uuid("destination_id")
      .notNull()
      .references(() => destinationsTable.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 180 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    description: text("description").notNull(),
    durationDays: integer("duration_days").notNull(),
    priceAmount: integer("price_amount").notNull(),
    priceCurrency: varchar("price_currency", { length: 8 }).notNull().default("INR"),
    heroImageUrl: text("hero_image_url").notNull().default(""),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
  },
  (table) => ({
    slugUniqueIndex: uniqueIndex("packages_slug_unique_idx").on(table.slug),
    destinationIndex: index("packages_destination_id_idx").on(table.destinationId),
    isActiveIndex: index("packages_is_active_idx").on(table.isActive),
    createdAtIndex: index("packages_created_at_idx").on(table.createdAt),
  }),
);
