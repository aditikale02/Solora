import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { destinationsTable } from "./destinations";
import { createdAtColumn, idColumn } from "./shared";

export const userSavedDestinationsTable = pgTable(
  "user_saved_destinations",
  {
    id: idColumn,
    userId: uuid("user_id").notNull(),
    destinationId: uuid("destination_id")
      .notNull()
      .references(() => destinationsTable.id, { onDelete: "cascade" }),
    createdAt: createdAtColumn,
  },
  (table) => ({
    uniqueIndex: uniqueIndex("user_saved_destinations_user_destination_unique_idx").on(
      table.userId,
      table.destinationId,
    ),
    userIndex: index("user_saved_destinations_user_id_idx").on(table.userId),
    destinationIndex: index("user_saved_destinations_destination_id_idx").on(table.destinationId),
    createdAtIndex: index("user_saved_destinations_created_at_idx").on(table.createdAt),
  }),
);
