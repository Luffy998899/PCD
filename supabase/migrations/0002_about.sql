-- ===========================================================================
-- Phase 2 — About & corporate authority.
--
-- Narrative page copy lives in `content_blocks` rather than in source files so
-- the company can edit it without a developer (PRD §14, Rules.md §21).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- content_blocks — editable narrative sections, keyed by page.
-- Reused by About, Divisions, Science & Quality, Network and Careers pages.
-- ---------------------------------------------------------------------------
create table if not exists content_blocks (
  id                    uuid primary key default gen_random_uuid(),
  page_key              text not null,
  block_key             text not null,
  heading               text,
  body                  text,
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  -- Provenance (Architecture.md §9)
  source_reference      text,
  source_document_url   text,
  source_note           text,
  verified_by           text,
  verified_at           timestamptz,
  valid_until           date,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (page_key, block_key)
);

create index if not exists content_blocks_page_idx
  on content_blocks (page_key, status, display_order);

drop trigger if exists content_blocks_updated_at on content_blocks;
create trigger content_blocks_updated_at
  before update on content_blocks
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- people — founders, board members and leadership.
-- `photo_url` stays null until the client supplies a real photograph; stock
-- imagery must never stand in for a named person (Rules.md §14).
-- ---------------------------------------------------------------------------
create table if not exists people (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  slug                  text not null unique,
  designation           text not null,
  category              text not null default 'leadership'
                        check (category in ('founder', 'board', 'leadership')),
  qualification         text,
  bio                   text,
  message               text,
  photo_url             text,
  photo_alt             text,
  linkedin_url          text,
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  source_reference      text,
  verified_by           text,
  verified_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists people_category_idx on people (category, status, display_order);

drop trigger if exists people_updated_at on people;
create trigger people_updated_at
  before update on people
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- milestones
-- ---------------------------------------------------------------------------
create table if not exists milestones (
  id                    uuid primary key default gen_random_uuid(),
  year                  integer not null,
  month                 integer check (month between 1 and 12),
  title                 text not null,
  description           text,
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  source_reference      text,
  source_document_url   text,
  verified_by           text,
  verified_at           timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists milestones_year_idx on milestones (status, year desc, display_order);

-- ---------------------------------------------------------------------------
-- core_values — "values" is a reserved word in SQL, hence the prefix.
-- ---------------------------------------------------------------------------
create table if not exists core_values (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null,
  icon          text,
  display_order integer not null default 0,
  status        publish_status not null default 'draft'
);

create index if not exists core_values_order_idx on core_values (status, display_order);

-- ---------------------------------------------------------------------------
-- awards
-- ---------------------------------------------------------------------------
create table if not exists awards (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  awarded_by            text,
  year                  integer,
  description           text,
  image_url             text,
  document_url          text,
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  source_reference      text,
  source_document_url   text,
  verified_by           text,
  verified_at           timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists awards_order_idx on awards (status, year desc, display_order);

-- ---------------------------------------------------------------------------
-- RLS — published rows are world-readable, everything else is not.
-- ---------------------------------------------------------------------------
alter table content_blocks enable row level security;
alter table people         enable row level security;
alter table milestones     enable row level security;
alter table core_values    enable row level security;
alter table awards         enable row level security;

drop policy if exists "content_blocks public read" on content_blocks;
create policy "content_blocks public read"
  on content_blocks for select using (status = 'published');

drop policy if exists "people public read" on people;
create policy "people public read"
  on people for select using (status = 'published');

drop policy if exists "milestones public read" on milestones;
create policy "milestones public read"
  on milestones for select using (status = 'published');

drop policy if exists "core_values public read" on core_values;
create policy "core_values public read"
  on core_values for select using (status = 'published');

drop policy if exists "awards public read" on awards;
create policy "awards public read"
  on awards for select using (status = 'published');
