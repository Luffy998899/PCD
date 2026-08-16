-- ===========================================================================
-- Phase 8 — Careers.
--
-- CVs are personal data. They are stored in a private bucket, referenced by
-- storage path rather than public URL, and are never readable through the
-- public API (Rules.md §17, Architecture.md §10).
-- ===========================================================================

create table if not exists job_openings (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  department        text not null,
  location          text not null,
  employment_type   text not null default 'full_time'
                    check (employment_type in ('full_time', 'part_time', 'contract', 'internship')),
  experience_min    integer,
  experience_max    integer,
  positions         integer,
  summary           text,
  description       text not null,
  responsibilities  text,
  requirements      text,
  posted_on         date not null default current_date,
  closes_on         date,
  -- 'open' | 'closed' controls whether applications are accepted; `status`
  -- controls whether the listing is visible at all.
  hiring_status     text not null default 'open' check (hiring_status in ('open', 'closed')),
  status            publish_status not null default 'draft',
  seo_title         text,
  seo_description   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists job_openings_status_idx
  on job_openings (status, hiring_status, posted_on desc);

drop trigger if exists job_openings_updated_at on job_openings;
create trigger job_openings_updated_at before update on job_openings
  for each row execute function set_updated_at();

create table if not exists job_applications (
  id                uuid primary key default gen_random_uuid(),
  job_opening_id    uuid references job_openings (id) on delete set null,
  -- Retained so an application still makes sense if the opening is deleted.
  applied_for       text not null,
  name              text not null,
  email             text not null,
  phone             text not null,
  current_location  text,
  experience_years  numeric(4, 1),
  current_employer  text,
  notice_period     text,
  message           text,
  -- Storage path inside the private bucket, never a public URL.
  cv_storage_path   text,
  cv_file_name      text,
  consent           boolean not null default false,
  source_page       text,
  status            text not null default 'new'
                    check (status in ('new', 'shortlisted', 'rejected', 'hired', 'spam')),
  internal_notes    text,
  created_at        timestamptz not null default now()
);

create index if not exists job_applications_status_idx
  on job_applications (status, created_at desc);
create index if not exists job_applications_opening_idx on job_applications (job_opening_id);

-- ---------------------------------------------------------------------------
-- Private storage bucket for CVs.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'private-documents',
  'private-documents',
  false,
  5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table job_openings     enable row level security;
alter table job_applications enable row level security;

drop policy if exists "job_openings public read" on job_openings;
create policy "job_openings public read"
  on job_openings for select using (status = 'published');

-- Applications may be submitted by anyone. There is deliberately no public
-- select policy: an application can only be read with an authenticated admin
-- session or the service role.
drop policy if exists "job_applications public insert" on job_applications;
create policy "job_applications public insert"
  on job_applications for insert with check (true);

-- No storage policy grants anonymous access to `private-documents`. Uploads go
-- through a server action using the service role, and admin downloads use
-- short-lived signed URLs.
