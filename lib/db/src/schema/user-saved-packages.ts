import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { packagesTable } from "./packages";
import { createdAtColumn, idColumn } from "./shared";

export const userSavedPackagesTable = pgTable(
  "user_saved_packages",
  {
    id: idColumn,
    userId: uuid("user_id").notNull(),
    packageId: uuid("package_id")
      .notNull()
      .references(() => packagesTable.id, { onDelete: "cascade" }),
    createdAt: createdAtColumn,
  },
  (table) => ({
    uniqueIndex: uniqueIndex("user_saved_packages_user_package_unique_idx").on(
      table.userId,
      table.packageId,
    ),
    userIndex: index("user_saved_packages_user_id_idx").on(table.userId),
    packageIndex: index("user_saved_packages_package_id_idx").on(table.packageId),
    createdAtIndex: index("user_saved_packages_created_at_idx").on(table.createdAt),
  }),
);
