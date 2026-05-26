create table if not exists "admin_users" (
  "id" uuid primary key default gen_random_uuid(),
  "email" varchar(320) not null unique,
  "created_at" timestamptz not null default now()
);

create index if not exists "admin_users_created_at_idx" on "admin_users" ("created_at");

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

alter table "destinations"
  rename column "name" to "title";

alter table "destinations"
  add column if not exists "category_id" uuid,
  add column if not exists "state" varchar(120) not null default '',
  add column if not exists "city" varchar(120) not null default '',
  add column if not exists "short_description" text not null default '',
  add column if not exists "long_description" text not null default '',
  add column if not exists "hero_image_url" text not null default '',
  add column if not exists "best_season" varchar(120) not null default '',
  add column if not exists "estimated_budget" varchar(120) not null default '',
  add column if not exists "ideal_duration_days" integer not null default 3,
  add column if not exists "travel_tips" text not null default '',
  add column if not exists "featured" boolean not null default false,
  add column if not exists "is_active" boolean not null default true;

alter table "destinations"
  add constraint "destinations_category_id_fkey"
  foreign key ("category_id") references "destination_categories" ("id") on delete set null;

create index if not exists "destinations_category_id_idx" on "destinations" ("category_id");
create index if not exists "destinations_state_idx" on "destinations" ("state");
create index if not exists "destinations_city_idx" on "destinations" ("city");
create index if not exists "destinations_is_active_idx" on "destinations" ("is_active");
create index if not exists "destinations_featured_idx" on "destinations" ("featured");

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

create table if not exists "user_saved_destinations" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null,
  "destination_id" uuid not null references "destinations" ("id") on delete cascade,
  "created_at" timestamptz not null default now(),
  unique ("user_id", "destination_id")
);

create index if not exists "user_saved_destinations_user_id_idx" on "user_saved_destinations" ("user_id");
create index if not exists "user_saved_destinations_destination_id_idx" on "user_saved_destinations" ("destination_id");
create index if not exists "user_saved_destinations_created_at_idx" on "user_saved_destinations" ("created_at");

create table if not exists "recently_viewed_destinations" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null,
  "destination_id" uuid not null references "destinations" ("id") on delete cascade,
  "viewed_at" timestamptz not null default now(),
  unique ("user_id", "destination_id")
);

create index if not exists "recently_viewed_destinations_user_id_idx" on "recently_viewed_destinations" ("user_id");
create index if not exists "recently_viewed_destinations_destination_id_idx" on "recently_viewed_destinations" ("destination_id");
create index if not exists "recently_viewed_destinations_viewed_at_idx" on "recently_viewed_destinations" ("viewed_at");

insert into "destination_categories" ("title", "slug", "description") values
  ('Mountains', 'mountains', 'High-altitude escapes, valleys, and dramatic ridge lines.'),
  ('Treks', 'treks', 'Multi-day trails, ridge walks, and adventurous routes.'),
  ('Beaches', 'beaches', 'Coastlines, surf towns, and barefoot slow living.'),
  ('Temples', 'temples', 'Sacred architecture, rituals, and reflective journeys.'),
  ('Heritage', 'heritage', 'Historic cities, forts, and cultural landmarks.'),
  ('Wildlife', 'wildlife', 'National parks, safaris, and forest immersion.'),
  ('Spiritual', 'spiritual', 'Quiet retreats, meditation, and inner reset trips.'),
  ('Adventure', 'adventure', 'High-energy experiences and offbeat exploration.'),
  ('Hill Stations', 'hill-stations', 'Cool-climate getaways with scenic viewpoints.'),
  ('Desert', 'desert', 'Dunes, forts, and wide-open landscapes.'),
  ('Waterfalls', 'waterfalls', 'Monsoon-fed drops, mist, and lush valleys.'),
  ('Food & Culture', 'food-culture', 'Local flavors, markets, and living traditions.'),
  ('Hidden Gems', 'hidden-gems', 'Under-the-radar places with strong character.'),
  ('Monsoon Trips', 'monsoon-trips', 'Rain-soaked routes, tea estates, and green escapes.')
on conflict ("slug") do nothing;
