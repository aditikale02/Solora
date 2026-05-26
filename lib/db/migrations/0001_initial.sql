create extension if not exists "pgcrypto";

do $$ begin
  create type "lead_status" as enum ('new', 'contacted', 'in_progress', 'closed');
exception
  when duplicate_object then null;
end $$;

create table if not exists "users" (
  "id" uuid primary key default gen_random_uuid(),
  "full_name" varchar(160) not null,
  "email" varchar(320) not null unique,
  "created_at" timestamptz not null default now()
);

create index if not exists "users_created_at_idx" on "users" ("created_at");

create table if not exists "services" (
  "id" uuid primary key default gen_random_uuid(),
  "title" varchar(160) not null,
  "slug" varchar(160) not null unique,
  "description" text not null,
  "is_active" boolean not null default true,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

create index if not exists "services_is_active_idx" on "services" ("is_active");
create index if not exists "services_created_at_idx" on "services" ("created_at");

create table if not exists "leads" (
  "id" uuid primary key default gen_random_uuid(),
  "full_name" varchar(160) not null,
  "email" varchar(320) not null,
  "phone" varchar(32) not null,
  "company_name" varchar(160) not null default '',
  "selected_service" varchar(160) not null,
  "selected_service_slug" varchar(160) not null,
  "budget_range" varchar(120) not null,
  "message" text not null,
  "source" varchar(80) not null default 'website',
  "status" "lead_status" not null default 'new',
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

create index if not exists "leads_email_idx" on "leads" ("email");
create index if not exists "leads_status_idx" on "leads" ("status");
create index if not exists "leads_service_slug_idx" on "leads" ("selected_service_slug");
create index if not exists "leads_created_at_idx" on "leads" ("created_at");

create table if not exists "newsletter_subscribers" (
  "id" uuid primary key default gen_random_uuid(),
  "email" varchar(320) not null unique,
  "source" varchar(80) not null default 'website',
  "created_at" timestamptz not null default now()
);

create index if not exists "newsletter_subscribers_created_at_idx" on "newsletter_subscribers" ("created_at");

create table if not exists "contact_submissions" (
  "id" uuid primary key default gen_random_uuid(),
  "name" varchar(160) not null,
  "email" varchar(320) not null,
  "subject" varchar(200) not null,
  "message" text not null,
  "source" varchar(80) not null default 'website',
  "created_at" timestamptz not null default now()
);

create index if not exists "contact_submissions_email_idx" on "contact_submissions" ("email");
create index if not exists "contact_submissions_created_at_idx" on "contact_submissions" ("created_at");

create or replace function "set_updated_at"()
returns trigger
language plpgsql
as $$
begin
  new."updated_at" = now();
  return new;
end;
$$;

drop trigger if exists "services_set_updated_at" on "services";
create trigger "services_set_updated_at"
before update on "services"
for each row execute function "set_updated_at"();

drop trigger if exists "leads_set_updated_at" on "leads";
create trigger "leads_set_updated_at"
before update on "leads"
for each row execute function "set_updated_at"();

insert into "services" ("title", "slug", "description") values
  ('Solo Consultation', 'solo-consultation', 'A guided planning session to shape your ideal solo travel journey.'),
  ('Custom Journey Design', 'custom-journey-design', 'End-to-end itinerary design tailored to pace, purpose, and preferences.'),
  ('Healing Retreat Planning', 'healing-retreat-planning', 'Intentional quiet time, reflection, and restorative travel experiences.'),
  ('Adventure Escapes', 'adventure-escapes', 'High-energy solo trips for explorers who want movement and momentum.'),
  ('Corporate Reset', 'corporate-reset', 'Thoughtful offsites and recovery escapes for founders and high-performers.')
on conflict ("slug") do nothing;