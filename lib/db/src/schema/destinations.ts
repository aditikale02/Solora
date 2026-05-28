import { boolean, index, integer, pgTable, text, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { destinationCategoriesTable } from "./destination-categories";
import { createdAtColumn, idColumn, updatedAtColumn } from "./shared";

export const destinationsTable = pgTable(
  "destinations",
  {
    id: idColumn,
    categoryId: uuid("category_id").references(() => destinationCategoriesTable.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    state: varchar("state", { length: 120 }).notNull().default(""),
    city: varchar("city", { length: 120 }).notNull().default(""),
    shortDescription: text("short_description").notNull().default(""),
    longDescription: text("long_description").notNull().default(""),
    tags: text("tags").notNull().default(""),
    heroImageUrl: text("hero_image_url").notNull().default(""),
    bestSeason: varchar("best_season", { length: 120 }).notNull().default(""),
    estimatedBudget: varchar("estimated_budget", { length: 120 }).notNull().default(""),
    idealDurationDays: integer("ideal_duration_days").notNull().default(3),
    travelTips: text("travel_tips").notNull().default(""),
    featured: boolean("featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
  },
  (table) => ({
    slugUniqueIndex: uniqueIndex("destinations_slug_unique_idx").on(table.slug),
    createdAtIndex: index("destinations_created_at_idx").on(table.createdAt),
    categoryIndex: index("destinations_category_id_idx").on(table.categoryId),
    stateIndex: index("destinations_state_idx").on(table.state),
    cityIndex: index("destinations_city_idx").on(table.city),
    activeIndex: index("destinations_is_active_idx").on(table.isActive),
    featuredIndex: index("destinations_featured_idx").on(table.featured),
  }),
);
