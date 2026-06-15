-- ============================================================
-- AIPulse — Initial schema
-- Run in Supabase: SQL Editor → paste → Run
-- (or `supabase db push` with the CLI)
-- ============================================================

-- ── Helper: is the current user an admin? ────────────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── profiles ─────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  phone       text,
  locale      text not null default 'en',
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── consultation_types ───────────────────────────────────────
create table if not exists public.consultation_types (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name_en          text not null,
  name_fa          text not null,
  desc_en          text,
  desc_fa          text,
  duration_minutes int  not null default 60,
  price_cents      int  not null,
  currency         text not null default 'cad',
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

alter table public.consultation_types enable row level security;

create policy "consultation_types: public read active"
  on public.consultation_types for select
  using (active or public.is_admin());

create policy "consultation_types: admin write"
  on public.consultation_types for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── availability_rules (consultant working hours) ────────────
create table if not exists public.availability_rules (
  id         uuid primary key default gen_random_uuid(),
  weekday    int  not null check (weekday between 0 and 6), -- 0 = Sunday
  start_time time not null,
  end_time   time not null,
  timezone   text not null default 'America/Toronto',
  active     boolean not null default true
);

alter table public.availability_rules enable row level security;

create policy "availability_rules: public read"
  on public.availability_rules for select
  using (true);

create policy "availability_rules: admin write"
  on public.availability_rules for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── bookings ─────────────────────────────────────────────────
create table if not exists public.bookings (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  consultation_type_id  uuid not null references public.consultation_types(id),
  start_at              timestamptz not null,
  end_at                timestamptz not null,
  status                text not null default 'pending'
                          check (status in ('pending', 'confirmed', 'cancelled')),
  stripe_session_id     text,
  stripe_payment_intent text,
  amount_cents          int,
  currency              text default 'cad',
  google_event_id       text,
  meet_url              text,
  expires_at            timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists bookings_user_idx   on public.bookings (user_id);
create index if not exists bookings_start_idx  on public.bookings (start_at);
create index if not exists bookings_status_idx on public.bookings (status);

alter table public.bookings enable row level security;

create policy "bookings: read own or admin"
  on public.bookings for select
  using (auth.uid() = user_id or public.is_admin());

create policy "bookings: insert own"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "bookings: admin update"
  on public.bookings for update
  using (public.is_admin())
  with check (public.is_admin());
-- NOTE: payment confirmation + Google event writes happen via the
-- service-role key in the Stripe webhook (bypasses RLS).

-- ── admin_integrations (consultant's Google connection) ──────
-- No RLS policies → only the service-role key can read/write.
create table if not exists public.admin_integrations (
  id            uuid primary key default gen_random_uuid(),
  provider      text not null default 'google',
  refresh_token text,
  calendar_id   text default 'primary',
  connected_at  timestamptz not null default now(),
  unique (provider)
);

alter table public.admin_integrations enable row level security;

-- ── Future: webinars (schema-ready, not wired in v1) ─────────
create table if not exists public.webinars (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title_en     text not null,
  title_fa     text not null,
  desc_en      text,
  desc_fa      text,
  starts_at    timestamptz,
  price_cents  int not null default 0,
  currency     text not null default 'cad',
  capacity     int,
  published    boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.webinar_registrations (
  id          uuid primary key default gen_random_uuid(),
  webinar_id  uuid not null references public.webinars(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  status      text not null default 'pending',
  created_at  timestamptz not null default now(),
  unique (webinar_id, user_id)
);

alter table public.webinars enable row level security;
alter table public.webinar_registrations enable row level security;

create policy "webinars: public read published"
  on public.webinars for select using (published or public.is_admin());
create policy "webinars: admin write"
  on public.webinars for all using (public.is_admin()) with check (public.is_admin());
create policy "webinar_regs: read own or admin"
  on public.webinar_registrations for select
  using (auth.uid() = user_id or public.is_admin());
create policy "webinar_regs: insert own"
  on public.webinar_registrations for insert with check (auth.uid() = user_id);

-- ── Seed: one default consultation type ──────────────────────
insert into public.consultation_types (slug, name_en, name_fa, desc_en, desc_fa, duration_minutes, price_cents, currency)
values (
  'discovery-60',
  'AI Consultation — 60 min',
  'مشاوره هوش مصنوعی — ۶۰ دقیقه',
  'A focused one-on-one session about your business and where AI creates real value.',
  'یک جلسه‌ی اختصاصی متمرکز درباره‌ی کسب‌وکار شما و جایی که هوش مصنوعی ارزش واقعی می‌سازد.',
  60,
  20000,   -- $200.00 CAD — placeholder, edit in the admin panel
  'cad'
)
on conflict (slug) do nothing;

-- ── Seed: example weekly availability (Mon–Fri 9:00–17:00 ET) ─
insert into public.availability_rules (weekday, start_time, end_time, timezone)
select wd, time '09:00', time '17:00', 'America/Toronto'
from generate_series(1, 5) as wd
where not exists (select 1 from public.availability_rules);
