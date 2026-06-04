-- Single-key, JSON-valued settings table used by the admin Calculator
-- Settings page. The app reads/writes the row with key='calculator'.
--
-- Run this once in your Supabase SQL editor (or via `supabase db push`).

create table if not exists app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Service-role inserts/updates from server actions bypass RLS, but keeping
-- RLS on prevents accidental browser writes if the anon key is ever used.
alter table app_settings enable row level security;

-- Allow anyone to read settings (the public GET /api/calculator-settings
-- endpoint serves them to the calculator UI).
drop policy if exists app_settings_read on app_settings;
create policy app_settings_read on app_settings
  for select using (true);
