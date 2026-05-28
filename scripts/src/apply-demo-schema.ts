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

    await client.query(`
      update "destination_categories"
      set "image_url" = case "slug"
        when 'mountains-treks' then 'http://localhost:5173/generated/mountains-treks.svg'
        when 'beaches' then 'http://localhost:5173/generated/beaches.svg'
        when 'temples-spiritual' then 'http://localhost:5173/generated/temples-spiritual.svg'
        when 'heritage-culture' then 'http://localhost:5173/generated/heritage-culture.svg'
        when 'nature-forest' then 'http://localhost:5173/generated/nature-forest.svg'
        when 'adventure' then 'http://localhost:5173/generated/adventure.svg'
        when 'hill-stations' then 'http://localhost:5173/generated/hill-stations.svg'
        when 'wildlife' then 'http://localhost:5173/generated/wildlife.svg'
        else "image_url"
      end
      where "slug" in (
        'mountains-treks',
        'beaches',
        'temples-spiritual',
        'heritage-culture',
        'nature-forest',
        'adventure',
        'hill-stations',
        'wildlife'
      );

      update "destinations"
      set "hero_image_url" = case "slug"
        when 'manali' then 'http://localhost:5173/generated/mountains-treks.svg'
        when 'leh-ladakh' then 'http://localhost:5173/generated/mountains-treks.svg'
        when 'goa' then 'http://localhost:5173/generated/beaches.svg'
        when 'andaman' then 'http://localhost:5173/generated/beaches.svg'
        when 'varanasi' then 'http://localhost:5173/generated/temples-spiritual.svg'
        when 'rishikesh' then 'http://localhost:5173/generated/temples-spiritual.svg'
        when 'udaipur' then 'http://localhost:5173/generated/heritage-culture.svg'
        when 'hampi' then 'http://localhost:5173/generated/heritage-culture.svg'
        when 'coorg' then 'http://localhost:5173/generated/nature-forest.svg'
        when 'meghalaya' then 'http://localhost:5173/generated/nature-forest.svg'
        when 'kasol' then 'http://localhost:5173/generated/adventure.svg'
        when 'rishikesh-adventure' then 'http://localhost:5173/generated/adventure.svg'
        when 'ooty' then 'http://localhost:5173/generated/hill-stations.svg'
        when 'munnar' then 'http://localhost:5173/generated/hill-stations.svg'
        when 'jim-corbett' then 'http://localhost:5173/generated/wildlife.svg'
        when 'kaziranga' then 'http://localhost:5173/generated/wildlife.svg'
        else "hero_image_url"
      end
      where "slug" in (
        'manali', 'leh-ladakh', 'goa', 'andaman', 'varanasi', 'rishikesh',
        'udaipur', 'hampi', 'coorg', 'meghalaya', 'kasol', 'rishikesh-adventure',
        'ooty', 'munnar', 'jim-corbett', 'kaziranga'
      );

      update "packages"
      set "hero_image_url" = case "slug"
        when 'manali-winter-reset' then 'http://localhost:5173/generated/mountains-treks.svg'
        when 'leh-ladakh-signature-loop' then 'http://localhost:5173/generated/mountains-treks.svg'
        when 'goa-slow-coast-escape' then 'http://localhost:5173/generated/beaches.svg'
        when 'andaman-island-drift' then 'http://localhost:5173/generated/beaches.svg'
        when 'varanasi-dawn-ghats' then 'http://localhost:5173/generated/temples-spiritual.svg'
        when 'rishikesh-calm-flow' then 'http://localhost:5173/generated/temples-spiritual.svg'
        when 'udaipur-lake-heritage' then 'http://localhost:5173/generated/heritage-culture.svg'
        when 'hampi-ruins-boulders' then 'http://localhost:5173/generated/heritage-culture.svg'
        when 'coorg-coffee-trails' then 'http://localhost:5173/generated/nature-forest.svg'
        when 'meghalaya-waterfall-weekender' then 'http://localhost:5173/generated/nature-forest.svg'
        when 'kasol-trail-starter' then 'http://localhost:5173/generated/adventure.svg'
        when 'rishikesh-white-water-kickoff' then 'http://localhost:5173/generated/adventure.svg'
        when 'ooty-hill-station-classic' then 'http://localhost:5173/generated/hill-stations.svg'
        when 'munnar-green-escape' then 'http://localhost:5173/generated/hill-stations.svg'
        when 'jim-corbett-safari-break' then 'http://localhost:5173/generated/wildlife.svg'
        when 'kaziranga-rhino-run' then 'http://localhost:5173/generated/wildlife.svg'
        else "hero_image_url"
      end
      where "slug" in (
        'manali-winter-reset', 'leh-ladakh-signature-loop', 'goa-slow-coast-escape', 'andaman-island-drift',
        'varanasi-dawn-ghats', 'rishikesh-calm-flow', 'udaipur-lake-heritage', 'hampi-ruins-boulders',
        'coorg-coffee-trails', 'meghalaya-waterfall-weekender', 'kasol-trail-starter', 'rishikesh-white-water-kickoff',
        'ooty-hill-station-classic', 'munnar-green-escape', 'jim-corbett-safari-break', 'kaziranga-rhino-run'
      );

      delete from "package_images"
      where "package_id" in (
        select "id" from "packages" where "slug" in (
          'manali-winter-reset', 'leh-ladakh-signature-loop', 'goa-slow-coast-escape', 'andaman-island-drift',
          'varanasi-dawn-ghats', 'rishikesh-calm-flow', 'udaipur-lake-heritage', 'hampi-ruins-boulders',
          'coorg-coffee-trails', 'meghalaya-waterfall-weekender', 'kasol-trail-starter', 'rishikesh-white-water-kickoff',
          'ooty-hill-station-classic', 'munnar-green-escape', 'jim-corbett-safari-break', 'kaziranga-rhino-run'
        )
      );

      insert into "package_images" ("package_id", "storage_path", "public_url", "alt_text", "sort_order", "is_hero")
      select p.id, img.storage_path, img.public_url, img.alt_text, img.sort_order, img.is_hero
      from (values
        ('manali-winter-reset', 'generated/mountains-treks.svg', 'http://localhost:5173/generated/mountains-treks.svg', 'Manali winter mountain view', 0, true),
        ('leh-ladakh-signature-loop', 'generated/mountains-treks.svg', 'http://localhost:5173/generated/mountains-treks.svg', 'Leh Ladakh road landscape', 0, true),
        ('goa-slow-coast-escape', 'generated/beaches.svg', 'http://localhost:5173/generated/beaches.svg', 'Goa beach sunset', 0, true),
        ('andaman-island-drift', 'generated/beaches.svg', 'http://localhost:5173/generated/beaches.svg', 'Andaman island coastline', 0, true),
        ('varanasi-dawn-ghats', 'generated/temples-spiritual.svg', 'http://localhost:5173/generated/temples-spiritual.svg', 'Varanasi river sunrise', 0, true),
        ('rishikesh-calm-flow', 'generated/temples-spiritual.svg', 'http://localhost:5173/generated/temples-spiritual.svg', 'Rishikesh riverfront', 0, true),
        ('udaipur-lake-heritage', 'generated/heritage-culture.svg', 'http://localhost:5173/generated/heritage-culture.svg', 'Udaipur palace and lake', 0, true),
        ('hampi-ruins-boulders', 'generated/heritage-culture.svg', 'http://localhost:5173/generated/heritage-culture.svg', 'Hampi heritage ruins', 0, true),
        ('coorg-coffee-trails', 'generated/nature-forest.svg', 'http://localhost:5173/generated/nature-forest.svg', 'Coorg coffee hills', 0, true),
        ('meghalaya-waterfall-weekender', 'generated/nature-forest.svg', 'http://localhost:5173/generated/nature-forest.svg', 'Meghalaya waterfall landscape', 0, true),
        ('kasol-trail-starter', 'generated/adventure.svg', 'http://localhost:5173/generated/adventure.svg', 'Kasol mountain trail', 0, true),
        ('rishikesh-white-water-kickoff', 'generated/adventure.svg', 'http://localhost:5173/generated/adventure.svg', 'Rishikesh rafting river', 0, true),
        ('ooty-hill-station-classic', 'generated/hill-stations.svg', 'http://localhost:5173/generated/hill-stations.svg', 'Ooty tea hills', 0, true),
        ('munnar-green-escape', 'generated/hill-stations.svg', 'http://localhost:5173/generated/hill-stations.svg', 'Munnar tea estates', 0, true),
        ('jim-corbett-safari-break', 'generated/wildlife.svg', 'http://localhost:5173/generated/wildlife.svg', 'Jim Corbett safari forest', 0, true),
        ('kaziranga-rhino-run', 'generated/wildlife.svg', 'http://localhost:5173/generated/wildlife.svg', 'Kaziranga grasslands', 0, true)
      ) as img(destination_slug, storage_path, public_url, alt_text, sort_order, is_hero)
      join "packages" p on p.slug = img.destination_slug;
    `);

    console.log("Demo schema and seed content applied.");
  } finally {
    client.release();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
