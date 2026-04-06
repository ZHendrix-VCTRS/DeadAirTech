-- Run in Supabase SQL editor (once) so /api/subscribe can persist emails.
create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

alter table public.newsletter_signups enable row level security;

-- No public policies — inserts only via service role (API route).
