-- ===========================================================================
-- Phase 1 — Core infrastructure, contact details and the enquiry system.
--
-- Conventions used by every migration in this project:
--   * `status` drives publication; public reads are restricted to 'published'.
--   * Provenance columns are added to any table that carries a factual claim.
--   * RLS is enabled on every table. Public roles get the narrowest grant that
--     makes the feature work.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Shared enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type publish_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enquiry_type as enum (
    'general', 'business', 'product', 'partner',
    'grievance', 'pharmacovigilance', 'career'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type enquiry_status as enum ('new', 'in_progress', 'closed', 'spam');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Timestamp helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- site_settings — single row holding company identity and statutory details.
-- Every column is nullable: the site renders placeholders until the client
-- supplies verified values.
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  id                        text primary key default 'default',
  legal_name                text,
  brand_name                text,
  tagline                   text,
  short_description         text,
  cin                       text,
  gst                       text,
  pan                       text,
  drug_licence_number       text,
  fssai_number              text,
  registered_address        text,
  corporate_address         text,
  primary_email             text,
  primary_phone             text,
  whatsapp_number           text,
  grievance_officer_name    text,
  grievance_officer_email   text,
  grievance_officer_phone   text,
  logo_url                  text,
  updated_at                timestamptz not null default now(),
  constraint site_settings_single_row check (id = 'default')
);

drop trigger if exists site_settings_updated_at on site_settings;
create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

insert into site_settings (id) values ('default')
  on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- offices
-- ---------------------------------------------------------------------------
create table if not exists offices (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  office_type   text not null default 'branch'
                check (office_type in ('registered', 'corporate', 'plant', 'branch', 'warehouse')),
  address       text not null,
  city          text,
  state         text,
  postal_code   text,
  country       text not null default 'India',
  phone         text,
  email         text,
  map_url       text,
  display_order integer not null default 0,
  status        publish_status not null default 'draft',
  created_at    timestamptz not null default now()
);

create index if not exists offices_status_order_idx on offices (status, display_order);

-- ---------------------------------------------------------------------------
-- department_contacts
-- ---------------------------------------------------------------------------
create table if not exists department_contacts (
  id            uuid primary key default gen_random_uuid(),
  department    text not null,
  description   text,
  email         text,
  phone         text,
  display_order integer not null default 0,
  status        publish_status not null default 'draft'
);

create index if not exists department_contacts_status_order_idx
  on department_contacts (status, display_order);

-- ---------------------------------------------------------------------------
-- enquiries — every public form writes here.
--
-- Medical detail submitted through the pharmacovigilance route is business
-- data the company is obliged to record, but it is never exposed publicly and
-- never written to application logs (Rules.md §18).
-- ---------------------------------------------------------------------------
create table if not exists enquiries (
  id                  uuid primary key default gen_random_uuid(),
  enquiry_type        enquiry_type not null,
  name                text not null,
  email               text not null,
  phone               text not null,
  organisation        text,
  city                text,
  state               text,
  country             text,
  subject             text,
  message             text not null,
  product_reference   text,
  therapy_reference   text,
  division_reference  text,
  consent             boolean not null default false,
  source_page         text,
  utm                 jsonb,
  status              enquiry_status not null default 'new',
  internal_notes      text,
  created_at          timestamptz not null default now()
);

create index if not exists enquiries_type_created_idx on enquiries (enquiry_type, created_at desc);
create index if not exists enquiries_status_created_idx on enquiries (status, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table site_settings        enable row level security;
alter table offices              enable row level security;
alter table department_contacts  enable row level security;
alter table enquiries            enable row level security;

-- Company identity is public information.
drop policy if exists "site_settings public read" on site_settings;
create policy "site_settings public read"
  on site_settings for select using (true);

drop policy if exists "offices public read" on offices;
create policy "offices public read"
  on offices for select using (status = 'published');

drop policy if exists "department_contacts public read" on department_contacts;
create policy "department_contacts public read"
  on department_contacts for select using (status = 'published');

-- Visitors may submit an enquiry but must never be able to read one back.
-- Server actions prefer the service-role key; this policy is the fallback when
-- only the anon key is configured.
drop policy if exists "enquiries public insert" on enquiries;
create policy "enquiries public insert"
  on enquiries for insert with check (true);

-- No public select policy on `enquiries` is intentional.
