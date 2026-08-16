-- ===========================================================================
-- Phase 9 — Homepage assembly.
--
-- The homepage composes content that already exists on inner pages. The only
-- new records it needs are the ones the "Clients, partners & associations"
-- section shows, plus the founding year used by the snapshot strip.
-- ===========================================================================

-- Years in operation is derived from this, so the figure cannot drift from the
-- record and is simply hidden when the year is unknown.
alter table site_settings
  add column if not exists founded_year integer;

-- ---------------------------------------------------------------------------
-- memberships — industry bodies and associations the company belongs to.
-- ---------------------------------------------------------------------------
create table if not exists memberships (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  membership_number     text,
  since_year            integer,
  logo_url              text,
  logo_alt              text,
  website_url           text,
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  source_reference      text,
  source_document_url   text,
  verified_by           text,
  verified_at           timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists memberships_status_idx on memberships (status, display_order);

-- ---------------------------------------------------------------------------
-- testimonials
--
-- A testimonial is only publishable with a named person and their recorded
-- consent. Anonymous "great service!" quotes are exactly the fabricated social
-- proof this project must not produce (Rules.md §1).
-- ---------------------------------------------------------------------------
create table if not exists testimonials (
  id                  uuid primary key default gen_random_uuid(),
  quote               text not null,
  author_name         text not null,
  author_designation  text,
  organisation        text,
  city                text,
  consent_on_file     boolean not null default false,
  consent_recorded_on date,
  display_order       integer not null default 0,
  status              publish_status not null default 'draft',
  verified_by         text,
  verified_at         timestamptz,
  created_at          timestamptz not null default now()
);

create index if not exists testimonials_status_idx on testimonials (status, display_order);

alter table memberships  enable row level security;
alter table testimonials enable row level security;

drop policy if exists "memberships public read" on memberships;
create policy "memberships public read"
  on memberships for select using (status = 'published');

-- Consent is part of the read condition, not just an admin convention.
drop policy if exists "testimonials public read" on testimonials;
create policy "testimonials public read"
  on testimonials for select using (status = 'published' and consent_on_file = true);
