-- Round 3: admin tools. Run in the SQL Editor after 002 and 004.

-- Keep profiles.can_book_direct in step with the whitelist (works before and after a person signs in)
create or replace function public.sync_whitelist_to_profiles()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    update public.profiles set can_book_direct = false where email = lower(old.email);
  else
    update public.profiles set can_book_direct = true where email = lower(new.email);
  end if;
  return null;
end $$;

drop trigger if exists whitelist_sync on public.whitelist_emails;
create trigger whitelist_sync after insert or delete on public.whitelist_emails
  for each row execute function public.sync_whitelist_to_profiles();

-- Statistics for the admin dashboard: imported history + lessons accepted since
create or replace function public.admin_stats()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare r jsonb;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;

  with allb as (
    select starts_at at time zone 'Europe/Athens' as ts, hours::numeric as hours
      from public.history_events where is_lesson
    union all
    select starts_at at time zone 'Europe/Athens', extract(epoch from (ends_at - starts_at)) / 3600
      from public.lessons where kind = 'lesson' and status = 'approved'
  )
  select jsonb_build_object(
    'totals', (select jsonb_build_object('lessons', count(*), 'hours', round(coalesce(sum(hours), 0), 1)) from allb),
    'monthly', (select coalesce(jsonb_agg(x order by x.k), '[]'::jsonb) from (
        select to_char(ts, 'YYYY-MM') as k, count(*) as lessons, round(sum(hours), 1) as hours
        from allb group by 1) x),
    'weekday', (select coalesce(jsonb_agg(x order by x.k), '[]'::jsonb) from (
        select extract(isodow from ts)::int as k, count(*) as lessons, round(sum(hours), 1) as hours
        from allb group by 1) x),
    'hour', (select coalesce(jsonb_agg(x order by x.k), '[]'::jsonb) from (
        select extract(hour from ts)::int as k, count(*) as lessons
        from allb group by 1) x)
  ) into r;
  return r;
end $$;
revoke all on function public.admin_stats() from public;
grant execute on function public.admin_stats() to authenticated;
