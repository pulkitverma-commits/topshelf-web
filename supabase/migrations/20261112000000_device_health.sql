-- TopShelf Device Health: readings reported by linked Macs, shown on the signed-in website.
--
-- Data flow: native TopShelf app → /api/device-health/* (server, service role) → these tables
-- → /api/device-health/dashboard (server, checks the signed-in user) → the website.
-- The website never inspects devices itself.
--
-- Security model
--  * Every row carries user_id. All writes go through server routes that resolve the user from
--    a session (website) or a hashed per-Mac device token (app) before touching data.
--  * Row-level security is on for every table as defence in depth: signed-in users can read only
--    their own rows, and cannot write directly. Token hashes are not readable by users.
--  * Unlinking a Mac deletes it; its devices, samples and alerts cascade away with it.
--  * No raw hardware identifiers: device keys arrive already salted/hashed per Mac.

create table if not exists public.dh_computers (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null check (char_length(name) between 1 and 80),
  platform      text not null default 'macOS' check (char_length(platform) <= 20),
  os_version    text check (char_length(os_version) <= 40),
  app_version   text check (char_length(app_version) <= 40),
  token_hash    text not null unique,
  last_sequence bigint not null default 0,
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz
);
create index if not exists dh_computers_user_idx on public.dh_computers (user_id);

create table if not exists public.dh_link_requests (
  id               uuid primary key default gen_random_uuid(),
  device_code_hash text not null unique,
  user_code        text not null unique,
  computer_name    text not null check (char_length(computer_name) between 1 and 80),
  os_version       text check (char_length(os_version) <= 40),
  app_version      text check (char_length(app_version) <= 40),
  created_at       timestamptz not null default now(),
  expires_at       timestamptz not null,
  approved_by      uuid references auth.users(id) on delete cascade,
  denied           boolean not null default false,
  consumed_at      timestamptz
);

create table if not exists public.dh_devices (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  computer_id    uuid not null references public.dh_computers(id) on delete cascade,
  device_key     text not null check (char_length(device_key) <= 80),
  category       text not null,
  source         text not null,
  name           text not null check (char_length(name) <= 120),
  custom_name    text check (char_length(custom_name) <= 60),
  hidden         boolean not null default false,
  favourite      boolean not null default false,
  connection     text not null,
  last_seen      timestamptz,
  battery        jsonb not null default '{}'::jsonb,
  battery_health jsonb not null default '{}'::jsonb,
  storage        jsonb not null default '{}'::jsonb,
  thermal        jsonb not null default '{}'::jsonb,
  attention      text[] not null default '{}',
  reported_at    timestamptz not null default now(),
  unique (computer_id, device_key)
);
create index if not exists dh_devices_user_idx on public.dh_devices (user_id);

-- Optional battery history (only when the user turns on "Upload battery history"). 30-day retention.
create table if not exists public.dh_samples (
  id           bigint generated always as identity primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  computer_id  uuid not null references public.dh_computers(id) on delete cascade,
  device_key   text not null,
  at           timestamptz not null,
  percent      smallint not null check (percent between 0 and 100),
  charge_state text not null,
  unique (computer_id, device_key, at)
);
create index if not exists dh_samples_lookup_idx on public.dh_samples (user_id, device_key, at);

create table if not exists public.dh_alerts (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  computer_id        uuid not null references public.dh_computers(id) on delete cascade,
  dedupe_key         text not null check (char_length(dedupe_key) <= 200),
  kind               text not null,
  device_key         text not null,
  level              text,
  title              text not null check (char_length(title) <= 200),
  body               text not null check (char_length(body) <= 500),
  created_at         timestamptz not null,
  received_at        timestamptz not null default now(),
  delivered_natively boolean not null default false,
  route_to           uuid references public.dh_computers(id) on delete set null,
  relayed_at         timestamptz,
  unique (user_id, dedupe_key)
);
create index if not exists dh_alerts_user_idx on public.dh_alerts (user_id, received_at desc);

create table if not exists public.dh_settings (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  version          integer not null default 0,
  preferences      jsonb not null default '{}'::jsonb,
  device_overrides jsonb not null default '{}'::jsonb,
  updated_at       timestamptz not null default now(),
  updated_by       text
);

-- Report ids already processed (idempotency for retried uploads). Short retention.
create table if not exists public.dh_reports (
  report_id   text primary key,
  computer_id uuid not null references public.dh_computers(id) on delete cascade,
  received_at timestamptz not null default now()
);

alter table public.dh_computers     enable row level security;
alter table public.dh_link_requests enable row level security;
alter table public.dh_devices       enable row level security;
alter table public.dh_samples       enable row level security;
alter table public.dh_alerts        enable row level security;
alter table public.dh_settings      enable row level security;
alter table public.dh_reports       enable row level security;

-- Read-only access to one's own rows. No insert/update/delete policies: writes are server-only.
drop policy if exists "own computers" on public.dh_computers;
create policy "own computers" on public.dh_computers for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "own devices" on public.dh_devices;
create policy "own devices" on public.dh_devices for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "own samples" on public.dh_samples;
create policy "own samples" on public.dh_samples for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "own alerts" on public.dh_alerts;
create policy "own alerts" on public.dh_alerts for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "own settings" on public.dh_settings;
create policy "own settings" on public.dh_settings for select to authenticated using (user_id = (select auth.uid()));
-- dh_link_requests and dh_reports: no policies → not readable by users at all.

-- Token hashes are never readable from the client, even for the owner.
revoke all on public.dh_computers from anon, authenticated;
grant select (id, user_id, name, platform, os_version, app_version, created_at, last_seen_at) on public.dh_computers to authenticated;
revoke all on public.dh_link_requests, public.dh_reports from anon, authenticated;
revoke insert, update, delete on public.dh_devices, public.dh_samples, public.dh_alerts, public.dh_settings from anon, authenticated;
revoke all on public.dh_devices, public.dh_samples, public.dh_alerts, public.dh_settings from anon;
