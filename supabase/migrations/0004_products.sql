-- ===========================================================================
-- Phase 4 — Products and the product catalogue.
--
-- Product content is structured data reused by listing pages, therapy and
-- division pages, search, the sitemap, metadata and schema (PRD §8). Nothing
-- about a product is ever hardcoded in a component (Rules.md §21).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Taxonomies
-- ---------------------------------------------------------------------------
create table if not exists divisions (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  summary       text,
  description   text,
  hero_image_url text,
  hero_image_alt text,
  display_order integer not null default 0,
  status        publish_status not null default 'draft',
  seo_title     text,
  seo_description text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists therapies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  summary       text,
  description   text,
  display_order integer not null default 0,
  status        publish_status not null default 'draft',
  seo_title     text,
  seo_description text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists dosage_forms (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  display_order integer not null default 0,
  status        publish_status not null default 'draft',
  created_at    timestamptz not null default now()
);

create index if not exists divisions_status_idx    on divisions (status, display_order);
create index if not exists therapies_status_idx    on therapies (status, display_order);
create index if not exists dosage_forms_status_idx on dosage_forms (status, display_order);

drop trigger if exists divisions_updated_at on divisions;
create trigger divisions_updated_at before update on divisions
  for each row execute function set_updated_at();

drop trigger if exists therapies_updated_at on therapies;
create trigger therapies_updated_at before update on therapies
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- products
--
-- Prescribing fields are nullable: a product page shows only the sections the
-- company has approved content for. An empty section is omitted rather than
-- filled with generic medical text (Rules.md §2).
-- ---------------------------------------------------------------------------
create table if not exists products (
  id                          uuid primary key default gen_random_uuid(),
  brand_name                  text not null,
  slug                        text not null unique,
  generic_composition         text not null,
  strength                    text,
  pack_size                   text,
  therapy_id                  uuid references therapies (id) on delete set null,
  division_id                 uuid references divisions (id) on delete set null,
  dosage_form_id              uuid references dosage_forms (id) on delete set null,
  summary                     text,
  indications                 text,
  directions                  text,
  warnings                    text,
  contraindications           text,
  side_effects                text,
  storage                     text,
  manufactured_by             text,
  marketed_by                 text,
  licence_number              text,
  prescribing_information_url text,
  is_prescription_only        boolean not null default true,
  status                      publish_status not null default 'draft',
  seo_title                   text,
  seo_description             text,
  source_reference            text,
  verified_by                 text,
  verified_at                 timestamptz,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists products_status_idx      on products (status, brand_name);
create index if not exists products_therapy_idx     on products (therapy_id) where status = 'published';
create index if not exists products_division_idx    on products (division_id) where status = 'published';
create index if not exists products_dosage_form_idx on products (dosage_form_id) where status = 'published';

-- Product search covers brand name and composition, which is how both doctors
-- and distributors look for a product.
create index if not exists products_search_idx on products
  using gin (to_tsvector('simple', brand_name || ' ' || generic_composition));

drop trigger if exists products_updated_at on products;
create trigger products_updated_at before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- product_images — pack front, back and label close-up (PRD §8).
-- ---------------------------------------------------------------------------
create table if not exists product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references products (id) on delete cascade,
  image_url     text not null,
  alt_text      text not null,
  image_type    text not null default 'pack_front'
                check (image_type in ('pack_front', 'pack_back', 'label', 'other')),
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists product_images_product_idx on product_images (product_id, display_order);

-- ---------------------------------------------------------------------------
-- product_documents — prescribing information, CoA samples, leaflets.
-- ---------------------------------------------------------------------------
create table if not exists product_documents (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references products (id) on delete cascade,
  title         text not null,
  document_url  text not null,
  document_type text not null default 'prescribing_information'
                check (document_type in ('prescribing_information', 'coa', 'leaflet', 'other')),
  display_order integer not null default 0,
  status        publish_status not null default 'draft',
  created_at    timestamptz not null default now()
);

create index if not exists product_documents_product_idx
  on product_documents (product_id, status, display_order);

-- ---------------------------------------------------------------------------
-- Company-level catalogue document.
-- ---------------------------------------------------------------------------
alter table site_settings
  add column if not exists product_catalogue_url text,
  add column if not exists product_catalogue_updated_on date;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table divisions          enable row level security;
alter table therapies          enable row level security;
alter table dosage_forms       enable row level security;
alter table products           enable row level security;
alter table product_images     enable row level security;
alter table product_documents  enable row level security;

drop policy if exists "divisions public read" on divisions;
create policy "divisions public read" on divisions for select using (status = 'published');

drop policy if exists "therapies public read" on therapies;
create policy "therapies public read" on therapies for select using (status = 'published');

drop policy if exists "dosage_forms public read" on dosage_forms;
create policy "dosage_forms public read" on dosage_forms for select using (status = 'published');

drop policy if exists "products public read" on products;
create policy "products public read" on products for select using (status = 'published');

-- Images inherit their parent's visibility: an image of a draft product must
-- not be reachable before the product is published.
drop policy if exists "product_images public read" on product_images;
create policy "product_images public read"
  on product_images for select using (
    exists (
      select 1 from products
      where products.id = product_images.product_id
        and products.status = 'published'
    )
  );

drop policy if exists "product_documents public read" on product_documents;
create policy "product_documents public read"
  on product_documents for select using (
    status = 'published'
    and exists (
      select 1 from products
      where products.id = product_documents.product_id
        and products.status = 'published'
    )
  );
