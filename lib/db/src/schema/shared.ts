import { index, timestamp, uuid } from "drizzle-orm/pg-core";

export const idColumn = uuid("id").defaultRandom().primaryKey();

export const createdAtColumn = timestamp("created_at", {
  withTimezone: true,
  mode: "date",
})
  .notNull()
  .defaultNow();

export const updatedAtColumn = timestamp("updated_at", {
  withTimezone: true,
  mode: "date",
})
  .notNull()
  .defaultNow();

export const byCreatedAtIndex = (name: string) => index(name);