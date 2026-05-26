create table if not exists "destinations" (
  "id" uuid primary key default gen_random_uuid(),
  "name" varchar(160) not null,
  "slug" varchar(160) not null unique,
  "description" text not null default '',
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

create index if not exists "destinations_created_at_idx" on "destinations" ("created_at");

create table if not exists "packages" (
  "id" uuid primary key default gen_random_uuid(),
  "destination_id" uuid not null references "destinations" ("id") on delete restrict,
  "title" varchar(180) not null,
  "slug" varchar(180) not null unique,
  "description" text not null,
  "duration_days" integer not null check ("duration_days" > 0),
  "price_amount" integer not null check ("price_amount" >= 0),
  "price_currency" varchar(8) not null default 'INR',
  "hero_image_url" text not null default '',
  "is_active" boolean not null default true,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

create index if not exists "packages_destination_id_idx" on "packages" ("destination_id");
create index if not exists "packages_is_active_idx" on "packages" ("is_active");
create index if not exists "packages_created_at_idx" on "packages" ("created_at");

create table if not exists "package_images" (
  "id" uuid primary key default gen_random_uuid(),
  "package_id" uuid not null references "packages" ("id") on delete cascade,
  "storage_path" text not null,
  "public_url" text not null,
  "alt_text" varchar(240) not null default '',
  "sort_order" integer not null default 0,
  "is_hero" boolean not null default false,
  "created_at" timestamptz not null default now()
);

create index if not exists "package_images_package_id_idx" on "package_images" ("package_id");
create index if not exists "package_images_sort_order_idx" on "package_images" ("sort_order");

create or replace function "set_updated_at"()
returns trigger
language plpgsql
as $$
begin
  new."updated_at" = now();
  return new;
end;
$$;

drop trigger if exists "destinations_set_updated_at" on "destinations";
create trigger "destinations_set_updated_at"
before update on "destinations"
for each row execute function "set_updated_at"();

drop trigger if exists "packages_set_updated_at" on "packages";
create trigger "packages_set_updated_at"
before update on "packages"
for each row execute function "set_updated_at"();

insert into storage.buckets ("id", "name", "public", "file_size_limit", "allowed_mime_types")
values (
  'trip-package-images',
  'trip-package-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict ("id") do update set
  "public" = excluded."public",
  "file_size_limit" = excluded."file_size_limit",
  "allowed_mime_types" = excluded."allowed_mime_types";
