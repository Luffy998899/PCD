-- ===========================================================================
-- Phase 7 — Media, blogs and downloads.
--
-- Press releases, news and blog articles share one table because they share a
-- lifecycle (draft → published), an SEO surface and an author model. They are
-- separated by `article_type` rather than by three near-identical tables.
-- ===========================================================================

create table if not exists article_categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  display_order integer not null default 0,
  status        publish_status not null default 'published'
);

create table if not exists articles (
  id                  uuid primary key default gen_random_uuid(),
  article_type        text not null default 'blog'
                      check (article_type in ('blog', 'news', 'press_release')),
  title               text not null,
  slug                text not null unique,
  category_id         uuid references article_categories (id) on delete set null,
  author_id           uuid references people (id) on delete set null,
  author_name         text,
  excerpt             text,
  body                text not null,
  hero_image_url      text,
  hero_image_alt      text,
  -- Health content that has been checked by a qualified reviewer is labelled
  -- as such. The flag is only meaningful with a named reviewer, which the
  -- constraint below enforces (Rules.md §2).
  medically_reviewed  boolean not null default false,
  reviewer_name       text,
  reviewer_credential text,
  reviewed_on         date,
  related_therapy_id  uuid references therapies (id) on delete set null,
  related_product_id  uuid references products (id) on delete set null,
  source_url          text,
  published_at        timestamptz,
  status              publish_status not null default 'draft',
  seo_title           text,
  seo_description     text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint articles_reviewer_required
    check (medically_reviewed = false or reviewer_name is not null),
  constraint articles_published_needs_date
    check (status <> 'published' or published_at is not null)
);

create index if not exists articles_type_published_idx
  on articles (article_type, status, published_at desc);
create index if not exists articles_category_idx on articles (category_id);

drop trigger if exists articles_updated_at on articles;
create trigger articles_updated_at before update on articles
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- gallery_items
-- ---------------------------------------------------------------------------
create table if not exists gallery_items (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  -- Alt text is required: a gallery of unlabelled images is unusable with a
  -- screen reader (Rules.md §20).
  alt_text      text not null,
  image_url     text not null,
  category      text not null default 'facility'
                check (category in ('facility', 'team', 'event', 'product', 'other')),
  captured_on   date,
  display_order integer not null default 0,
  status        publish_status not null default 'draft',
  created_at    timestamptz not null default now()
);

create index if not exists gallery_items_status_idx on gallery_items (status, display_order);

-- ---------------------------------------------------------------------------
-- downloads
-- ---------------------------------------------------------------------------
create table if not exists downloads (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  file_url      text not null,
  file_type     text not null default 'pdf',
  file_size_kb  integer,
  category      text not null default 'general'
                check (category in ('general', 'product', 'quality', 'corporate', 'partner')),
  display_order integer not null default 0,
  status        publish_status not null default 'draft',
  updated_on    date,
  created_at    timestamptz not null default now()
);

create index if not exists downloads_status_idx on downloads (status, category, display_order);

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
create table if not exists events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  location      text,
  starts_on     date not null,
  ends_on       date,
  event_url     text,
  image_url     text,
  image_alt     text,
  status        publish_status not null default 'draft',
  created_at    timestamptz not null default now()
);

create index if not exists events_status_idx on events (status, starts_on desc);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table article_categories enable row level security;
alter table articles           enable row level security;
alter table gallery_items      enable row level security;
alter table downloads          enable row level security;
alter table events             enable row level security;

drop policy if exists "article_categories public read" on article_categories;
create policy "article_categories public read"
  on article_categories for select using (status = 'published');

-- A published article with a future publish date is scheduled, not live.
drop policy if exists "articles public read" on articles;
create policy "articles public read"
  on articles for select using (status = 'published' and published_at <= now());

drop policy if exists "gallery_items public read" on gallery_items;
create policy "gallery_items public read"
  on gallery_items for select using (status = 'published');

drop policy if exists "downloads public read" on downloads;
create policy "downloads public read"
  on downloads for select using (status = 'published');

drop policy if exists "events public read" on events;
create policy "events public read"
  on events for select using (status = 'published');
