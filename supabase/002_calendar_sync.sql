-- Round 2: Google Calendar events that block slots + sync bookkeeping.
-- Run in the SQL Editor after schema.sql.

-- Events from my Google Calendar (pulled every few minutes by the gcal-sync function).
-- Only start/end are stored: no titles, so nothing private is exposed.
create table if not exists public.external_busy (
  google_event_id text primary key,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  seen_at         timestamptz not null default now()
);
create index if not exists external_busy_starts_idx on public.external_busy (starts_at);
alter table public.external_busy enable row level security;
drop policy if exists external_busy_admin on public.external_busy;
create policy external_busy_admin on public.external_busy for select using (public.is_admin());

-- What the Google event looked like when we last synced (to detect edits)
alter table public.lessons add column if not exists gcal_synced_start timestamptz;
alter table public.lessons add column if not exists gcal_synced_end   timestamptz;

-- Public busy list now includes my Google Calendar events
create or replace function public.public_busy(from_ts timestamptz, to_ts timestamptz)
returns table (starts_at timestamptz, ends_at timestamptz, status text)
language sql stable security definer set search_path = public as $$
  select l.starts_at, l.ends_at,
         case l.status when 'pending' then 'pending' else 'busy' end
  from public.lessons l
  where l.starts_at < to_ts and l.ends_at > from_ts
    and l.status in ('pending','booked','approved')
  union all
  select e.starts_at, e.ends_at, 'busy'
  from public.external_busy e
  where e.starts_at < to_ts and e.ends_at > from_ts
$$;
revoke all on function public.public_busy(timestamptz, timestamptz) from public;
grant execute on function public.public_busy(timestamptz, timestamptz) to anon, authenticated;
