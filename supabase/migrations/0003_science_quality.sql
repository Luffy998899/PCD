-- ===========================================================================
-- Phase 3 — Science, manufacturing and quality.
--
-- This is the evidence layer. Every table here carries provenance columns
-- because everything it publishes is a factual claim about the company's
-- capability or approvals (Architecture.md §9, Rules.md §7).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- facilities — manufacturing units and laboratories.
-- ---------------------------------------------------------------------------
create table if not exists facilities (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  slug                  text not null unique,
  facility_type         text not null default 'manufacturing'
                        check (facility_type in ('manufacturing', 'laboratory', 'warehouse', 'rnd')),
  summary               text,
  description           text,
  address               text,
  city                  text,
  state                 text,
  country               text not null default 'India',
  commissioned_year     integer,
  hero_image_url        text,
  hero_image_alt        text,
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  source_reference      text,
  source_document_url   text,
  source_note           text,
  verified_by           text,
  verified_at           timestamptz,
  valid_until           date,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists facilities_status_idx on facilities (status, display_order);

drop trigger if exists facilities_updated_at on facilities;
create trigger facilities_updated_at
  before update on facilities
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- facility_specs — the technical data table for a facility.
--
-- Kept as label/value rows rather than fixed columns so the company can publish
-- exactly the figures it can evidence, and nothing more. A figure with no
-- source is simply not entered.
-- ---------------------------------------------------------------------------
create table if not exists facility_specs (
  id                    uuid primary key default gen_random_uuid(),
  facility_id           uuid not null references facilities (id) on delete cascade,
  category              text not null default 'general'
                        check (category in ('general', 'production', 'quality', 'utilities')),
  label                 text not null,
  value                 text not null,
  unit                  text,
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  source_reference      text,
  source_document_url   text,
  verified_by           text,
  verified_at           timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists facility_specs_facility_idx
  on facility_specs (facility_id, status, category, display_order);

-- ---------------------------------------------------------------------------
-- certificates — approvals and accreditations.
--
-- A certificate is only publishable with an issuing body. `valid_until` drives
-- an expiry indicator so a lapsed certificate is not presented as current
-- (Rules.md §7).
-- ---------------------------------------------------------------------------
create table if not exists certificates (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  issuing_body          text not null,
  certificate_number    text,
  scope                 text,
  issued_on             date,
  valid_until           date,
  document_url          text,
  image_url             text,
  category              text not null default 'quality'
                        check (category in ('quality', 'regulatory', 'product', 'environment', 'other')),
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  source_reference      text,
  source_note           text,
  verified_by           text,
  verified_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists certificates_status_idx on certificates (status, display_order);

drop trigger if exists certificates_updated_at on certificates;
create trigger certificates_updated_at
  before update on certificates
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- quality_tests — QA/QC capabilities and the tests performed.
-- ---------------------------------------------------------------------------
create table if not exists quality_tests (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  description           text,
  equipment             text,
  stage                 text not null default 'finished_product'
                        check (stage in ('raw_material', 'in_process', 'finished_product', 'stability', 'packaging')),
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  source_reference      text,
  created_at            timestamptz not null default now()
);

create index if not exists quality_tests_status_idx on quality_tests (status, stage, display_order);

-- ---------------------------------------------------------------------------
-- regulatory_items — compliance commitments and the documents behind them.
-- ---------------------------------------------------------------------------
create table if not exists regulatory_items (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  description           text,
  reference_number      text,
  document_url          text,
  category              text not null default 'compliance'
                        check (category in ('compliance', 'licence', 'policy', 'submission')),
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  source_reference      text,
  source_document_url   text,
  verified_by           text,
  verified_at           timestamptz,
  valid_until           date,
  created_at            timestamptz not null default now()
);

create index if not exists regulatory_items_status_idx
  on regulatory_items (status, category, display_order);

-- ---------------------------------------------------------------------------
-- pharmacovigilance_reports — adverse events and suspected quality defects.
--
-- Held separately from `enquiries` because the retention obligation, the
-- access rules and the workflow differ. No public read policy exists, and the
-- narrative is never included in notification email.
-- ---------------------------------------------------------------------------
create table if not exists pharmacovigilance_reports (
  id                    uuid primary key default gen_random_uuid(),
  report_type           text not null default 'adverse_event'
                        check (report_type in ('adverse_event', 'product_complaint')),
  reporter_name         text not null,
  reporter_email        text not null,
  reporter_phone        text not null,
  reporter_category     text not null default 'other'
                        check (reporter_category in ('patient', 'physician', 'pharmacist', 'other_hcp', 'other')),
  product_name          text,
  batch_number          text,
  expiry_date           text,
  event_description     text not null,
  event_started_on      text,
  patient_age_group     text,
  patient_sex           text,
  consent               boolean not null default false,
  source_page           text,
  status                enquiry_status not null default 'new',
  internal_notes        text,
  created_at            timestamptz not null default now()
);

create index if not exists pharmacovigilance_created_idx
  on pharmacovigilance_reports (status, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table facilities                enable row level security;
alter table facility_specs            enable row level security;
alter table certificates              enable row level security;
alter table quality_tests             enable row level security;
alter table regulatory_items          enable row level security;
alter table pharmacovigilance_reports enable row level security;

drop policy if exists "facilities public read" on facilities;
create policy "facilities public read"
  on facilities for select using (status = 'published');

drop policy if exists "facility_specs public read" on facility_specs;
create policy "facility_specs public read"
  on facility_specs for select using (status = 'published');

drop policy if exists "certificates public read" on certificates;
create policy "certificates public read"
  on certificates for select using (status = 'published');

drop policy if exists "quality_tests public read" on quality_tests;
create policy "quality_tests public read"
  on quality_tests for select using (status = 'published');

drop policy if exists "regulatory_items public read" on regulatory_items;
create policy "regulatory_items public read"
  on regulatory_items for select using (status = 'published');

-- Reports may be submitted by anyone and read by no one without an
-- authenticated admin session.
drop policy if exists "pharmacovigilance public insert" on pharmacovigilance_reports;
create policy "pharmacovigilance public insert"
  on pharmacovigilance_reports for insert with check (true);
