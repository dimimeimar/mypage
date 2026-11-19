-- Κλείδωμα για το gcal-sync: μόνο ένα sync τη φορά.
-- Χωρίς αυτό, δύο ταυτόχρονες κλήσεις (έγκριση στο admin + cron) δημιουργούσαν διπλά events στο Google Calendar.
create table if not exists public.sync_lock (
  id int primary key default 1 check (id = 1),
  locked_until timestamptz not null default 'epoch'
);
insert into public.sync_lock (id) values (1) on conflict do nothing;
alter table public.sync_lock enable row level security;  -- χωρίς policies: μόνο service_role

create or replace function public.try_sync_lock(seconds int default 120)
returns boolean language plpgsql security definer set search_path = public as $$
declare got boolean;
begin
  update public.sync_lock set locked_until = now() + make_interval(secs => seconds)
  where id = 1 and locked_until < now()
  returning true into got;
  return coalesce(got, false);
end $$;

create or replace function public.release_sync_lock()
returns void language sql security definer set search_path = public as $$
  update public.sync_lock set locked_until = 'epoch' where id = 1;
$$;

revoke all on function public.try_sync_lock(int) from public, anon, authenticated;
revoke all on function public.release_sync_lock() from public, anon, authenticated;
grant execute on function public.try_sync_lock(int) to service_role;
grant execute on function public.release_sync_lock() to service_role;
