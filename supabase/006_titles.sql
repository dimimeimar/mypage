-- Τίτλοι στο δημόσιο ημερολόγιο (όπως ήταν στο παλιό site).
-- ΠΡΟΣΟΧΗ: ό,τι γράφεις στον τίτλο ενός Google event φαίνεται δημόσια.
alter table public.external_busy add column if not exists title text;

drop function if exists public.public_busy(timestamptz, timestamptz);
create function public.public_busy(from_ts timestamptz, to_ts timestamptz)
returns table (starts_at timestamptz, ends_at timestamptz, status text, title text)
language sql stable security definer set search_path = public as $$
  select l.starts_at, l.ends_at,
         case l.status when 'pending' then 'pending' else 'busy' end,
         case l.status when 'pending' then null else coalesce(l.student_name, l.subject) end
  from public.lessons l
  where l.starts_at < to_ts and l.ends_at > from_ts
    and l.status in ('pending','booked','approved')
  union all
  select e.starts_at, e.ends_at, 'busy', e.title
  from public.external_busy e
  where e.starts_at < to_ts and e.ends_at > from_ts
$$;
revoke all on function public.public_busy(timestamptz, timestamptz) from public;
grant execute on function public.public_busy(timestamptz, timestamptz) to anon, authenticated;
