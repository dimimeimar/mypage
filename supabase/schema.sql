-- Meimaridis tutor: Supabase schema (run once in the SQL Editor)
-- Idempotent where practical. Safe on an empty project.

create extension if not exists btree_gist;
create extension if not exists pgcrypto;

-- ───────────── Profiles (one row per signed-in user) ─────────────
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text,
  full_name        text,
  role             text not null default 'student' check (role in ('student','admin')),
  can_book_direct  boolean not null default false,   -- the whitelist flag
  created_at       timestamptz not null default now()
);

-- Emails whitelisted before the person has ever signed in
create table if not exists public.whitelist_emails (
  email      text primary key,
  note       text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Create the profile on first sign-in; apply the whitelist by email
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, can_book_direct)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    exists (select 1 from public.whitelist_emails w where w.email = lower(new.email))
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Nobody but an admin may change role / whitelist flag (also blocks self-promotion)
create or replace function public.protect_profile_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() and auth.uid() is not null then
    new.role := old.role;
    new.can_book_direct := old.can_book_direct;
    new.email := old.email;
  end if;
  return new;
end $$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- ───────────── Lessons ─────────────
-- status:
--   pending   guest request, does NOT block the slot, waits for admin
--   booked    whitelisted student booked directly, BLOCKS the slot, not in Google Calendar yet
--   approved  accepted by admin, BLOCKS the slot, synced to Google Calendar
--   rejected / cancelled  free the slot
-- kind 'block' = time the admin closes (travel, maintenance, exams...)
create table if not exists public.lessons (
  id              uuid primary key default gen_random_uuid(),
  kind            text not null default 'lesson' check (kind in ('lesson','block')),
  user_id         uuid references public.profiles(id) on delete set null,
  student_name    text not null,
  student_email   text,
  student_phone   text,
  subject         text,
  notes           text,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  status          text not null default 'pending'
                  check (status in ('pending','booked','approved','rejected','cancelled')),
  gcal_event_id   text,
  gcal_synced_at  timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint lessons_time_ok check (ends_at > starts_at),
  -- the database itself refuses double bookings, even for simultaneous requests
  constraint lessons_no_overlap exclude using gist
    (tstzrange(starts_at, ends_at) with &&)
    where (status in ('booked','approved'))
);

create index if not exists lessons_starts_idx on public.lessons (starts_at);
create index if not exists lessons_user_idx   on public.lessons (user_id);
create index if not exists lessons_status_idx on public.lessons (status);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists lessons_touch on public.lessons;
create trigger lessons_touch before update on public.lessons
  for each row execute function public.touch_updated_at();

-- ───────────── Imported history (statistics only) ─────────────
create table if not exists public.history_events (
  google_event_id text primary key,
  title           text not null,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  notes           text,
  student_guess   text,                 -- rough first-word key, refine later
  is_lesson       boolean not null default true,
  hours           numeric generated always as (extract(epoch from (ends_at - starts_at)) / 3600) stored
);
create index if not exists history_starts_idx on public.history_events (starts_at);

-- ───────────── Row Level Security ─────────────
alter table public.profiles         enable row level security;
alter table public.whitelist_emails enable row level security;
alter table public.lessons          enable row level security;
alter table public.history_events   enable row level security;

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (id = auth.uid() or public.is_admin());

-- whitelist: admin only
drop policy if exists whitelist_admin on public.whitelist_emails;
create policy whitelist_admin on public.whitelist_emails for all
  using (public.is_admin()) with check (public.is_admin());

-- history: admin only
drop policy if exists history_admin on public.history_events;
create policy history_admin on public.history_events for all
  using (public.is_admin()) with check (public.is_admin());

-- lessons: read
drop policy if exists lessons_select on public.lessons;
create policy lessons_select on public.lessons for select
  using (public.is_admin() or user_id = auth.uid());

-- lessons: anyone may send a pending request (no login needed)
drop policy if exists lessons_insert_guest on public.lessons;
create policy lessons_insert_guest on public.lessons for insert
  with check (
    kind = 'lesson' and status = 'pending'
    and (user_id is null or user_id = auth.uid())
    and starts_at > now()
  );

-- lessons: whitelisted student books directly, 48h ahead at least, in own name
drop policy if exists lessons_insert_direct on public.lessons;
create policy lessons_insert_direct on public.lessons for insert to authenticated
  with check (
    kind = 'lesson' and status = 'booked'
    and user_id = auth.uid()
    and starts_at >= now() + interval '48 hours'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.can_book_direct)
  );

-- lessons: admin does everything
drop policy if exists lessons_admin on public.lessons;
create policy lessons_admin on public.lessons for all
  using (public.is_admin()) with check (public.is_admin());

-- Students cancel their own lesson only through this function (48h rule enforced here)
create or replace function public.cancel_my_lesson(lesson_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.lessons
     set status = 'cancelled'
   where id = lesson_id
     and user_id = auth.uid()
     and status in ('pending','booked','approved')
     and starts_at >= now() + interval '48 hours';
  if not found then
    raise exception 'Cannot cancel: not your lesson or less than 48 hours ahead';
  end if;
end $$;
revoke all on function public.cancel_my_lesson(uuid) from public;
grant execute on function public.cancel_my_lesson(uuid) to authenticated;

-- ───────────── Public calendar: busy times only, no names ─────────────
create or replace function public.public_busy(from_ts timestamptz, to_ts timestamptz)
returns table (starts_at timestamptz, ends_at timestamptz, status text)
language sql stable security definer set search_path = public as $$
  select l.starts_at, l.ends_at,
         case l.status when 'pending' then 'pending' else 'busy' end
  from public.lessons l
  where l.starts_at < to_ts and l.ends_at > from_ts
    and l.status in ('pending','booked','approved')
$$;
revoke all on function public.public_busy(timestamptz, timestamptz) from public;
grant execute on function public.public_busy(timestamptz, timestamptz) to anon, authenticated;
