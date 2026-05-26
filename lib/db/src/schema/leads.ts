import { index, pgEnum, pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createdAtColumn, idColumn, updatedAtColumn } from "./shared";

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "in_progress",
  "closed",
]);

export const leadsTable = pgTable(
  "leads",
  {
    id: idColumn,
    fullName: varchar("full_name", { length: 160 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 32 }).notNull(),
    companyName: varchar("company_name", { length: 160 }).notNull().default(""),
    selectedService: varchar("selected_service", { length: 160 }).notNull(),
    selectedServiceSlug: varchar("selected_service_slug", { length: 160 }).notNull(),
    budgetRange: varchar("budget_range", { length: 120 }).notNull(),
    message: text("message").notNull(),
    source: varchar("source", { length: 80 }).notNull().default("website"),
    status: leadStatusEnum("status").notNull().default("new"),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
  },
  (table) => ({
    emailIndex: index("leads_email_idx").on(table.email),
    statusIndex: index("leads_status_idx").on(table.status),
    createdAtIndex: index("leads_created_at_idx").on(table.createdAt),
    serviceSlugIndex: index("leads_service_slug_idx").on(table.selectedServiceSlug),
    emailCreatedAtUniqueishIndex: uniqueIndex("leads_email_created_at_idx").on(
      table.email,
      table.createdAt,
    ),
  }),
);
