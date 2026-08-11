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

alter table public.posts add column if not exists display_order integer not null default 0;

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

create table if not exists public.church_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.finance_entries (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  entry_type text not null check (entry_type in ('income', 'expense')),
  category text not null check (char_length(category) between 1 and 100),
  description text not null default '',
  amount numeric(12, 2) not null check (amount > 0),
  recorded_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.finance_documents (
  id uuid primary key default gen_random_uuid(),
  document_type text not null check (document_type in ('receipt', 'invoice', 'bank_statement', 'other')),
  title text not null check (char_length(title) between 1 and 160),
  document_date date not null,
  file_url text,
  notes text not null default '',
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index if not exists finance_entries_week_start_idx
  on public.finance_entries (week_start desc);
create index if not exists finance_documents_date_idx
  on public.finance_documents (document_date desc);

alter table public.church_admins enable row level security;
alter table public.finance_entries enable row level security;
alter table public.finance_documents enable row level security;

create or replace function public.is_church_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.church_admins where user_id = auth.uid()
  );
$$;

revoke execute on function public.is_church_admin() from public;
grant execute on function public.is_church_admin() to authenticated;
revoke execute on function public.is_church_admin() from anon;

drop policy if exists "Admins can view their admin record" on public.church_admins;
create policy "Admins can view their admin record"
  on public.church_admins for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Admins view finance entries" on public.finance_entries;
drop policy if exists "Finance users view entries" on public.finance_entries;
drop policy if exists "Finance team views entries" on public.finance_entries;
create policy "Admins view finance entries"
  on public.finance_entries for select to authenticated
  using (public.is_church_admin());

drop policy if exists "Admins create finance entries" on public.finance_entries;
drop policy if exists "Finance users create entries" on public.finance_entries;
drop policy if exists "Finance team creates entries" on public.finance_entries;
create policy "Admins create finance entries"
  on public.finance_entries for insert to authenticated
  with check (public.is_church_admin() and recorded_by = auth.uid());

drop policy if exists "Admins update finance entries" on public.finance_entries;
drop policy if exists "Finance users update entries" on public.finance_entries;
drop policy if exists "Finance team updates entries" on public.finance_entries;
create policy "Admins update finance entries"
  on public.finance_entries for update to authenticated
  using (public.is_church_admin())
  with check (public.is_church_admin());

drop policy if exists "Admins delete finance entries" on public.finance_entries;
drop policy if exists "Finance users delete entries" on public.finance_entries;
drop policy if exists "Finance managers delete entries" on public.finance_entries;
create policy "Admins delete finance entries"
  on public.finance_entries for delete to authenticated
  using (public.is_church_admin());

drop policy if exists "Admins view finance documents" on public.finance_documents;
drop policy if exists "Finance users view documents" on public.finance_documents;
drop policy if exists "Finance team views documents" on public.finance_documents;
create policy "Admins view finance documents"
  on public.finance_documents for select to authenticated
  using (public.is_church_admin());

drop policy if exists "Admins create finance documents" on public.finance_documents;
drop policy if exists "Finance users create documents" on public.finance_documents;
drop policy if exists "Finance team creates documents" on public.finance_documents;
create policy "Admins create finance documents"
  on public.finance_documents for insert to authenticated
  with check (public.is_church_admin() and uploaded_by = auth.uid());

drop policy if exists "Admins update finance documents" on public.finance_documents;
drop policy if exists "Finance users update documents" on public.finance_documents;
drop policy if exists "Finance team updates documents" on public.finance_documents;
create policy "Admins update finance documents"
  on public.finance_documents for update to authenticated
  using (public.is_church_admin())
  with check (public.is_church_admin());

drop policy if exists "Admins delete finance documents" on public.finance_documents;
drop policy if exists "Finance users delete documents" on public.finance_documents;
drop policy if exists "Finance managers delete documents" on public.finance_documents;
create policy "Admins delete finance documents"
  on public.finance_documents for delete to authenticated
  using (public.is_church_admin());

-- Application roles managed from the administrator portal. The service-role
-- key used to create Auth users belongs only in the admin-users Edge Function.
create table if not exists public.user_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  app_role text not null default 'member' check (app_role in ('member', 'editor', 'admin')),
  finance_access boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_access enable row level security;

create or replace function public.is_portal_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.church_admins where user_id = auth.uid())
    or exists (select 1 from public.user_access where user_id = auth.uid() and app_role = 'admin');
$$;

create or replace function public.can_access_finance()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_portal_admin()
    or exists (select 1 from public.user_access where user_id = auth.uid() and finance_access);
$$;

revoke execute on function public.is_portal_admin() from public;
revoke execute on function public.can_access_finance() from public;
grant execute on function public.is_portal_admin() to authenticated;
grant execute on function public.can_access_finance() to authenticated;

drop policy if exists "Portal admins view user access" on public.user_access;
create policy "Portal admins view user access" on public.user_access
  for select to authenticated using ((select public.is_portal_admin()));

drop policy if exists "Users view own access" on public.user_access;
create policy "Users view own access" on public.user_access
  for select to authenticated using ((select auth.uid()) = user_id);

-- Replace finance policies so assigned finance users and portal admins are
-- authorized by RLS even if requests bypass the UI.
drop policy if exists "Admins view finance entries" on public.finance_entries;
create policy "Finance users view entries" on public.finance_entries
  for select to authenticated using ((select public.can_access_finance()));
drop policy if exists "Admins create finance entries" on public.finance_entries;
create policy "Finance users create entries" on public.finance_entries
  for insert to authenticated with check ((select public.can_access_finance()) and recorded_by = (select auth.uid()));
drop policy if exists "Admins update finance entries" on public.finance_entries;
create policy "Finance users update entries" on public.finance_entries
  for update to authenticated using ((select public.can_access_finance())) with check ((select public.can_access_finance()));
drop policy if exists "Admins delete finance entries" on public.finance_entries;
create policy "Finance users delete entries" on public.finance_entries
  for delete to authenticated using ((select public.can_access_finance()));

drop policy if exists "Admins view finance documents" on public.finance_documents;
create policy "Finance users view documents" on public.finance_documents
  for select to authenticated using ((select public.can_access_finance()));
drop policy if exists "Admins create finance documents" on public.finance_documents;
create policy "Finance users create documents" on public.finance_documents
  for insert to authenticated with check ((select public.can_access_finance()) and uploaded_by = (select auth.uid()));
drop policy if exists "Admins update finance documents" on public.finance_documents;
create policy "Finance users update documents" on public.finance_documents
  for update to authenticated using ((select public.can_access_finance())) with check ((select public.can_access_finance()));
drop policy if exists "Admins delete finance documents" on public.finance_documents;
create policy "Finance users delete documents" on public.finance_documents
  for delete to authenticated using ((select public.can_access_finance()));

create or replace function public.is_church_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select public.can_access_finance(); $$;

-- Functional-team authorization used by the dedicated admin portal.
create table if not exists public.user_team_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  team text not null check (team in ('finance', 'content', 'worship', 'programs', 'youth', 'children')),
  access_level text not null check (access_level in ('viewer', 'editor', 'manager')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, team)
);

alter table public.user_team_roles enable row level security;

create or replace function public.team_access_level(requested_team text)
returns text language sql stable security definer set search_path = public
as $$
  select case when public.is_portal_admin() then 'manager'
    else (select access_level from public.user_team_roles where user_id = auth.uid() and team = requested_team)
  end;
$$;

create or replace function public.can_view_team(requested_team text)
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(public.team_access_level(requested_team) in ('viewer', 'editor', 'manager'), false); $$;

create or replace function public.can_edit_team(requested_team text)
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(public.team_access_level(requested_team) in ('editor', 'manager'), false); $$;

create or replace function public.can_manage_team(requested_team text)
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(public.team_access_level(requested_team) = 'manager', false); $$;

revoke execute on function public.team_access_level(text) from public;
revoke execute on function public.can_view_team(text) from public;
revoke execute on function public.can_edit_team(text) from public;
revoke execute on function public.can_manage_team(text) from public;
grant execute on function public.team_access_level(text), public.can_view_team(text), public.can_edit_team(text), public.can_manage_team(text) to authenticated;

drop policy if exists "Admins view team roles" on public.user_team_roles;
create policy "Admins view team roles" on public.user_team_roles for select to authenticated
  using ((select public.is_portal_admin()) or user_id = (select auth.uid()));

-- Team roles enforce finance access at the database boundary.
drop policy if exists "Finance users view entries" on public.finance_entries;
create policy "Finance team views entries" on public.finance_entries for select to authenticated
  using ((select public.can_view_team('finance')));
drop policy if exists "Finance users create entries" on public.finance_entries;
create policy "Finance team creates entries" on public.finance_entries for insert to authenticated
  with check ((select public.can_edit_team('finance')) and recorded_by = (select auth.uid()));
drop policy if exists "Finance users update entries" on public.finance_entries;
create policy "Finance team updates entries" on public.finance_entries for update to authenticated
  using ((select public.can_edit_team('finance'))) with check ((select public.can_edit_team('finance')));
drop policy if exists "Finance users delete entries" on public.finance_entries;
create policy "Finance managers delete entries" on public.finance_entries for delete to authenticated
  using ((select public.can_manage_team('finance')));

drop policy if exists "Finance users view documents" on public.finance_documents;
create policy "Finance team views documents" on public.finance_documents for select to authenticated
  using ((select public.can_view_team('finance')));
drop policy if exists "Finance users create documents" on public.finance_documents;
create policy "Finance team creates documents" on public.finance_documents for insert to authenticated
  with check ((select public.can_edit_team('finance')) and uploaded_by = (select auth.uid()));
drop policy if exists "Finance users update documents" on public.finance_documents;
create policy "Finance team updates documents" on public.finance_documents for update to authenticated
  using ((select public.can_edit_team('finance'))) with check ((select public.can_edit_team('finance')));
drop policy if exists "Finance users delete documents" on public.finance_documents;
create policy "Finance managers delete documents" on public.finance_documents for delete to authenticated
  using ((select public.can_manage_team('finance')));

create or replace function public.is_church_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select public.can_view_team('finance'); $$;

-- Public visitors can read songs. Only Worship & Music editors/managers and
-- portal administrators can change the Mezmur catalog.
drop policy if exists "Authenticated users create mezmurs" on public.mezmurs;
drop policy if exists "Owners update mezmurs" on public.mezmurs;
drop policy if exists "Owners delete mezmurs" on public.mezmurs;
drop policy if exists "Worship team creates mezmurs" on public.mezmurs;
create policy "Worship team creates mezmurs" on public.mezmurs for insert to authenticated
  with check ((select public.can_edit_team('worship')) and creator = (select auth.uid()));
drop policy if exists "Worship team updates mezmurs" on public.mezmurs;
create policy "Worship team updates mezmurs" on public.mezmurs for update to authenticated
  using ((select public.can_edit_team('worship'))) with check ((select public.can_edit_team('worship')));
drop policy if exists "Worship managers delete mezmurs" on public.mezmurs;
create policy "Worship managers delete mezmurs" on public.mezmurs for delete to authenticated
  using ((select public.can_manage_team('worship')));

create or replace function public.get_my_portal_access()
returns jsonb language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'isAdmin', public.is_portal_admin(),
    'teams', coalesce((select jsonb_object_agg(team, access_level) from public.user_team_roles where user_id = auth.uid()), '{}'::jsonb)
  );
$$;
revoke execute on function public.get_my_portal_access() from public;
grant execute on function public.get_my_portal_access() to authenticated;

-- Announcements are public to read and managed by Content & News staff.
drop policy if exists "Authenticated users create posts" on public.posts;
drop policy if exists "Owners update posts" on public.posts;
drop policy if exists "Owners delete posts" on public.posts;
drop policy if exists "Content team creates announcements" on public.posts;
create policy "Content team creates announcements" on public.posts for insert to authenticated
  with check ((select public.can_edit_team('content')) and creator = (select auth.uid()));
drop policy if exists "Content team updates announcements" on public.posts;
create policy "Content team updates announcements" on public.posts for update to authenticated
  using ((select public.can_edit_team('content'))) with check ((select public.can_edit_team('content')));
drop policy if exists "Content managers delete announcements" on public.posts;
create policy "Content managers delete announcements" on public.posts for delete to authenticated
  using ((select public.can_manage_team('content')));
