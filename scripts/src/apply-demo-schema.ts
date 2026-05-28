import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pool } from "../../lib/db/src/index";

async function main() {
  const client = await pool.connect();

  try {
    await client.query(`
      create table if not exists "destination_categories" (
        "id" uuid primary key default gen_random_uuid(),
        "title" varchar(160) not null,
        "slug" varchar(160) not null unique,
        "description" text not null default '',
        "image_url" text not null default '',
        "sort_order" integer not null default 0,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now()
      );

      create index if not exists "destination_categories_created_at_idx" on "destination_categories" ("created_at");
      create index if not exists "destination_categories_sort_order_idx" on "destination_categories" ("sort_order");

      create table if not exists "destination_images" (
        "id" uuid primary key default gen_random_uuid(),
        "destination_id" uuid not null references "destinations" ("id") on delete cascade,
        "storage_path" text not null,
        "public_url" text not null,
        "alt_text" varchar(240) not null default '',
        "sort_order" integer not null default 0,
        "is_hero" boolean not null default false,
        "created_at" timestamptz not null default now()
      );

      create index if not exists "destination_images_destination_id_idx" on "destination_images" ("destination_id");
      create index if not exists "destination_images_sort_order_idx" on "destination_images" ("sort_order");

      alter table if exists "destinations"
        add column if not exists "title" varchar(160) not null default '',
        add column if not exists "category_id" uuid,
        add column if not exists "state" varchar(120) not null default '',
        add column if not exists "city" varchar(120) not null default '',
        add column if not exists "short_description" text not null default '',
        add column if not exists "long_description" text not null default '',
        add column if not exists "tags" text not null default '',
        add column if not exists "hero_image_url" text not null default '',
        add column if not exists "best_season" varchar(120) not null default '',
        add column if not exists "estimated_budget" varchar(120) not null default '',
        add column if not exists "ideal_duration_days" integer not null default 3,
        add column if not exists "travel_tips" text not null default '',
        add column if not exists "featured" boolean not null default false,
        add column if not exists "is_active" boolean not null default true;
    `);

    await client.query(`
      update "destinations"
      set "title" = coalesce(nullif("title", ''), "name")
      where nullif("title", '') is null and "name" is not null;
    `);

    await client.query(`
      update "destinations"
      set "short_description" = coalesce(nullif("short_description", ''), "description")
      where nullif("short_description", '') is null and "description" is not null;
    `);

    await client.query(`
      create unique index if not exists "destinations_slug_unique_idx" on "destinations" ("slug");
      create index if not exists "destinations_created_at_idx" on "destinations" ("created_at");
      create index if not exists "destinations_category_id_idx" on "destinations" ("category_id");
      create index if not exists "destinations_state_idx" on "destinations" ("state");
      create index if not exists "destinations_city_idx" on "destinations" ("city");
      create index if not exists "destinations_is_active_idx" on "destinations" ("is_active");
      create index if not exists "destinations_featured_idx" on "destinations" ("featured");

      alter table if exists "packages"
        add column if not exists "features" text not null default '';

      create unique index if not exists "packages_slug_unique_idx" on "packages" ("slug");
      create index if not exists "packages_created_at_idx" on "packages" ("created_at");
      create index if not exists "packages_destination_id_idx" on "packages" ("destination_id");
      create index if not exists "packages_is_active_idx" on "packages" ("is_active");
    `);

    const scriptDir = new URL(".", import.meta.url).pathname;
    // On Windows,pathname might have a leading slash like /C:/Users/...
    // Using fileURLToPath from 'node:url' is the standard way to convert URL to path.
    const { fileURLToPath } = await import("node:url");
    const resolvedDir = fileURLToPath(new URL(".", import.meta.url));
    const seedSql = readFileSync(
      resolve(resolvedDir, "../../lib/db/migrations/0004_saved_packages_and_demo_content.sql"),
      "utf8",
    );

    await client.query(seedSql);

    console.log("Demo schema and seed content applied.");
  } finally {
    client.release();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
