-- Run in the Supabase SQL Editor before deploying the Mezmur YouTube field.
alter table public.mezmurs
  add column if not exists youtube_url text not null default '';
