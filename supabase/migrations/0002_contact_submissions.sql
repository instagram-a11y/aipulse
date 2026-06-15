-- ── contact_submissions ──────────────────────────────────────
create table if not exists public.contact_submissions (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  email     text not null,
  company   text,
  message   text not null,
  language  text not null default 'en',
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Anyone can insert (public contact form); only admins can read
create policy "contact_submissions: insert public"
  on public.contact_submissions for insert
  with check (true);

create policy "contact_submissions: admin read"
  on public.contact_submissions for select
  using (public.is_admin());
