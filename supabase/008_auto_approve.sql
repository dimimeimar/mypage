-- Άμεση κράτηση whitelisted μαθητή: μπαίνει κατευθείαν σε status 'approved'
-- (πιάνει την ώρα και περνάει μόνο του στο Google Calendar με πρόσκληση).
drop policy if exists lessons_insert_direct on public.lessons;
create policy lessons_insert_direct on public.lessons for insert to authenticated
  with check (
    kind = 'lesson' and status = 'approved'
    and user_id = auth.uid()
    and starts_at >= now() + interval '48 hours'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.can_book_direct)
  );
