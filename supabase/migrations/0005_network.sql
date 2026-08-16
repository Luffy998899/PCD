-- ===========================================================================
-- Phase 6 — Network and reach.
--
-- Coverage claims are among the easiest things to exaggerate on a pharma
-- website, so every figure this section shows is counted from these tables at
-- render time. There is no stored "states covered" number to inflate
-- (Rules.md §7, Phases.md §6).
-- ===========================================================================

create table if not exists network_states (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  slug                  text not null unique,
  region                text check (region in ('north', 'south', 'east', 'west', 'central', 'north-east')),
  since_year            integer,
  notes                 text,
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  source_reference      text,
  verified_by           text,
  verified_at           timestamptz,
  created_at            timestamptz not null default now()
);

create table if not exists network_districts (
  id                    uuid primary key default gen_random_uuid(),
  state_id              uuid not null references network_states (id) on delete cascade,
  name                  text not null,
  status                publish_status not null default 'draft',
  source_reference      text,
  verified_by           text,
  verified_at           timestamptz,
  created_at            timestamptz not null default now(),
  unique (state_id, name)
);

create table if not exists network_countries (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  slug                  text not null unique,
  iso_code              text,
  since_year            integer,
  registration_status   text check (registration_status in (
                          'registered', 'under_registration', 'export_only', 'not_applicable'
                        )),
  notes                 text,
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  source_reference      text,
  source_document_url   text,
  verified_by           text,
  verified_at           timestamptz,
  created_at            timestamptz not null default now()
);

-- Distributors and stockists. Only entries the company has confirmed — and
-- whose contact details the partner has consented to publishing — are listed.
create table if not exists partners (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  partner_type          text not null default 'distributor'
                        check (partner_type in ('distributor', 'stockist', 'cnf', 'institutional')),
  city                  text,
  state_id              uuid references network_states (id) on delete set null,
  contact_person        text,
  phone                 text,
  email                 text,
  address               text,
  consent_to_publish    boolean not null default false,
  display_order         integer not null default 0,
  status                publish_status not null default 'draft',
  verified_by           text,
  verified_at           timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists network_states_status_idx    on network_states (status, display_order, name);
create index if not exists network_districts_state_idx  on network_districts (state_id, status, name);
create index if not exists network_countries_status_idx on network_countries (status, display_order, name);
create index if not exists partners_status_idx          on partners (status, display_order, name);

alter table network_states    enable row level security;
alter table network_districts enable row level security;
alter table network_countries enable row level security;
alter table partners          enable row level security;

drop policy if exists "network_states public read" on network_states;
create policy "network_states public read"
  on network_states for select using (status = 'published');

drop policy if exists "network_districts public read" on network_districts;
create policy "network_districts public read"
  on network_districts for select using (
    status = 'published'
    and exists (
      select 1 from network_states
      where network_states.id = network_districts.state_id
        and network_states.status = 'published'
    )
  );

drop policy if exists "network_countries public read" on network_countries;
create policy "network_countries public read"
  on network_countries for select using (status = 'published');

-- A partner's contact details are only public when that partner has consented.
drop policy if exists "partners public read" on partners;
create policy "partners public read"
  on partners for select using (status = 'published' and consent_to_publish = true);
