import { boolean, index, integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { packagesTable } from "./packages";
import { createdAtColumn, idColumn } from "./shared";

export const packageImagesTable = pgTable(
  "package_images",
  {
    id: idColumn,
    packageId: uuid("package_id")
      .notNull()
      .references(() => packagesTable.id, { onDelete: "cascade" }),
    storagePath: text("storage_path").notNull(),
    publicUrl: text("public_url").notNull(),
    altText: varchar("alt_text", { length: 240 }).notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    isHero: boolean("is_hero").notNull().default(false),
    createdAt: createdAtColumn,
  },
  (table) => ({
    packageIndex: index("package_images_package_id_idx").on(table.packageId),
    sortOrderIndex: index("package_images_sort_order_idx").on(table.sortOrder),
  }),
);
