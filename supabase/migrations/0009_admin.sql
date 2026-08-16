-- ===========================================================================
-- Phase 11 — Admin and content operations.
--
-- Authorization is enforced in the database, not in the UI. Every admin write
-- policy checks the caller's role through `auth.uid()`, so hiding a button in
-- the browser is never what protects a table (Rules.md §16).
-- ===========================================================================

do $$ begin
  create type admin_role as enum (
    'super_admin', 'content_admin', 'sales_admin', 'hr_admin', 'quality_admin'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- admin_users — links a Supabase Auth user to a role.
--
-- A person with an auth account but no row here has no admin access at all;
-- there is no implicit privilege from merely being signed in.
-- ---------------------------------------------------------------------------
create table if not exists admin_users (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  role        admin_role not null default 'content_admin',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists admin_users_updated_at on admin_users;
create trigger admin_users_updated_at before update on admin_users
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Authorization helpers.
--
-- SECURITY DEFINER so the policies below can read `admin_users` without each
-- table needing its own grant, and STABLE so the planner can cache them within
-- a statement.
-- ---------------------------------------------------------------------------
create or replace function current_admin_role()
returns admin_role
language sql
stable
security definer
set search_path = public
as $$
  select role from admin_users where id = auth.uid() and is_active = true;
$$;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admin_users where id = auth.uid() and is_active = true);
$$;

/*
 * True when the caller holds any of the supplied roles. `super_admin` always
 * passes.
 */
create or replace function has_admin_role(required admin_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'super_admin' or role = any(required)
     from admin_users
     where id = auth.uid() and is_active = true),
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- audit_log — who changed what, and when.
-- ---------------------------------------------------------------------------
create table if not exists audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references auth.users (id) on delete set null,
  actor_email text,
  action      text not null,
  entity      text not null,
  entity_id   text,
  summary     text,
  created_at  timestamptz not null default now()
);

create index if not exists audit_log_created_idx on audit_log (created_at desc);
create index if not exists audit_log_entity_idx  on audit_log (entity, entity_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table admin_users enable row level security;
alter table audit_log   enable row level security;

-- An admin may read their own row; super_admins may read all.
drop policy if exists "admin_users self read" on admin_users;
create policy "admin_users self read"
  on admin_users for select
  using (id = auth.uid() or has_admin_role(array['super_admin']::admin_role[]));

drop policy if exists "admin_users super manage" on admin_users;
create policy "admin_users super manage"
  on admin_users for all
  using (has_admin_role(array['super_admin']::admin_role[]))
  with check (has_admin_role(array['super_admin']::admin_role[]));

drop policy if exists "audit_log admin read" on audit_log;
create policy "audit_log admin read"
  on audit_log for select using (is_admin());

drop policy if exists "audit_log admin insert" on audit_log;
create policy "audit_log admin insert"
  on audit_log for insert with check (is_admin());

-- ---------------------------------------------------------------------------
-- Admin access to content tables.
--
-- Content roles manage published content; sales sees leads; HR sees
-- applications; quality sees safety reports. Each grant is the narrowest that
-- lets the role do its job.
-- ---------------------------------------------------------------------------
do $$
declare
  content_table text;
  content_tables text[] := array[
    'site_settings', 'offices', 'department_contacts', 'content_blocks',
    'people', 'milestones', 'core_values', 'awards',
    'facilities', 'facility_specs', 'certificates', 'quality_tests',
    'regulatory_items', 'divisions', 'therapies', 'dosage_forms',
    'products', 'product_images', 'product_documents',
    'network_states', 'network_districts', 'network_countries', 'partners',
    'article_categories', 'articles', 'gallery_items', 'downloads', 'events',
    'memberships', 'testimonials'
  ];
begin
  foreach content_table in array content_tables loop
    execute format('drop policy if exists "%1$s admin manage" on %1$I', content_table);
    execute format($f$
      create policy "%1$s admin manage" on %1$I
        for all
        using (has_admin_role(array['content_admin','quality_admin']::admin_role[]))
        with check (has_admin_role(array['content_admin','quality_admin']::admin_role[]))
    $f$, content_table);
  end loop;
end $$;

-- Leads: sales and content admins read and update; nobody deletes through the
-- API. Public insert stays as defined in earlier migrations.
drop policy if exists "enquiries admin read" on enquiries;
create policy "enquiries admin read"
  on enquiries for select
  using (has_admin_role(array['sales_admin','content_admin']::admin_role[]));

drop policy if exists "enquiries admin update" on enquiries;
create policy "enquiries admin update"
  on enquiries for update
  using (has_admin_role(array['sales_admin','content_admin']::admin_role[]))
  with check (has_admin_role(array['sales_admin','content_admin']::admin_role[]));

-- Safety reports: quality role only. Sales has no reason to read a patient's
-- adverse event narrative.
drop policy if exists "pharmacovigilance admin read" on pharmacovigilance_reports;
create policy "pharmacovigilance admin read"
  on pharmacovigilance_reports for select
  using (has_admin_role(array['quality_admin']::admin_role[]));

drop policy if exists "pharmacovigilance admin update" on pharmacovigilance_reports;
create policy "pharmacovigilance admin update"
  on pharmacovigilance_reports for update
  using (has_admin_role(array['quality_admin']::admin_role[]))
  with check (has_admin_role(array['quality_admin']::admin_role[]));

-- Applications and CVs: HR only.
drop policy if exists "job_applications admin read" on job_applications;
create policy "job_applications admin read"
  on job_applications for select
  using (has_admin_role(array['hr_admin']::admin_role[]));

drop policy if exists "job_applications admin update" on job_applications;
create policy "job_applications admin update"
  on job_applications for update
  using (has_admin_role(array['hr_admin']::admin_role[]))
  with check (has_admin_role(array['hr_admin']::admin_role[]));

drop policy if exists "job_openings admin manage" on job_openings;
create policy "job_openings admin manage"
  on job_openings for all
  using (has_admin_role(array['hr_admin','content_admin']::admin_role[]))
  with check (has_admin_role(array['hr_admin','content_admin']::admin_role[]));

-- CV downloads: HR reads objects in the private bucket. No anonymous grant.
drop policy if exists "cv hr read" on storage.objects;
create policy "cv hr read"
  on storage.objects for select
  using (
    bucket_id = 'private-documents'
    and has_admin_role(array['hr_admin']::admin_role[])
  );
