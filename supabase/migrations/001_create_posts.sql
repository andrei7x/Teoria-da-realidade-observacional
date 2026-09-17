create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  category text not null,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published')),
  is_featured boolean not null default false,
  cover_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists idx_posts_slug on public.posts(slug);
create index if not exists idx_posts_status on public.posts(status);
create index if not exists idx_posts_category on public.posts(category);
create index if not exists idx_posts_featured on public.posts(is_featured);
create index if not exists idx_posts_published_at on public.posts(published_at desc);

alter table public.posts enable row level security;

-- Public visitors may read only published posts. Server-side admin uses service role.
drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
on public.posts for select
to anon, authenticated
using (status = 'published');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'consciousness-images',
  'consciousness-images',
  true,
  4194304,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
