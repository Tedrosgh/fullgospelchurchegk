create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  title text not null check (char_length(title) between 1 and 160),
  message text not null default '',
  tags text[] not null default '{}',
  selected_file text,
  name text not null default '',
  creator uuid references auth.users(id) on delete set null,
  likes uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.mezmurs (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  title text not null check (char_length(title) between 1 and 200),
  artist text not null default '',
  lyrics text not null,
  name text not null default '',
  creator uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists mezmurs_title_idx on public.mezmurs (lower(title));

alter table public.posts enable row level security;
alter table public.mezmurs enable row level security;

drop policy if exists "Posts are publicly readable" on public.posts;
create policy "Posts are publicly readable" on public.posts for select using (true);
drop policy if exists "Authenticated users create posts" on public.posts;
create policy "Authenticated users create posts" on public.posts for insert to authenticated with check (auth.uid() = creator);
drop policy if exists "Owners update posts" on public.posts;
create policy "Owners update posts" on public.posts for update to authenticated using (auth.uid() = creator) with check (auth.uid() = creator);
drop policy if exists "Owners delete posts" on public.posts;
create policy "Owners delete posts" on public.posts for delete to authenticated using (auth.uid() = creator);

drop policy if exists "Mezmurs are publicly readable" on public.mezmurs;
create policy "Mezmurs are publicly readable" on public.mezmurs for select using (true);
drop policy if exists "Authenticated users create mezmurs" on public.mezmurs;
create policy "Authenticated users create mezmurs" on public.mezmurs for insert to authenticated with check (auth.uid() = creator);
drop policy if exists "Owners update mezmurs" on public.mezmurs;
create policy "Owners update mezmurs" on public.mezmurs for update to authenticated using (auth.uid() = creator) with check (auth.uid() = creator);
drop policy if exists "Owners delete mezmurs" on public.mezmurs;
create policy "Owners delete mezmurs" on public.mezmurs for delete to authenticated using (auth.uid() = creator);

create or replace function public.toggle_post_like(post_id uuid)
returns public.posts
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_post public.posts;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  update public.posts
  set likes = case
    when auth.uid() = any(likes) then array_remove(likes, auth.uid())
    else array_append(likes, auth.uid())
  end
  where id = post_id
  returning * into updated_post;

  return updated_post;
end;
$$;

grant execute on function public.toggle_post_like(uuid) to authenticated;
revoke execute on function public.toggle_post_like(uuid) from anon;
