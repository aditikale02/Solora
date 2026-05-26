import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { destinationsTable } from "./destinations";
import { createdAtColumn, idColumn } from "./shared";

export const recentlyViewedDestinationsTable = pgTable(
  "recently_viewed_destinations",
  {
    id: idColumn,
    userId: uuid("user_id").notNull(),
    destinationId: uuid("destination_id")
      .notNull()
      .references(() => destinationsTable.id, { onDelete: "cascade" }),
    viewedAt: createdAtColumn,
  },
  (table) => ({
    uniqueIndex: uniqueIndex("recently_viewed_destinations_user_destination_unique_idx").on(
      table.userId,
      table.destinationId,
    ),
    userIndex: index("recently_viewed_destinations_user_id_idx").on(table.userId),
    destinationIndex: index("recently_viewed_destinations_destination_id_idx").on(table.destinationId),
    viewedAtIndex: index("recently_viewed_destinations_viewed_at_idx").on(table.viewedAt),
  }),
);
