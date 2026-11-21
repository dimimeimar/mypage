-- Ψηφιακή Γραμματεία (RAG): βάση γνώσης, αναζήτηση ομοιότητας, όρια χρήσης και καταγραφή ερωτήσεων.
-- Τρέξε ολόκληρο στο SQL Editor. Τα embeddings έχουν 768 διαστάσεις (gemini-embedding-001, outputDimensionality 768).

create extension if not exists vector with schema extensions;

-- Βάση γνώσης: κομμάτια κειμένου του site (δημόσιο υλικό μόνο)
create table if not exists public.kb_chunks (
  id           text primary key,            -- π.χ. "services_data:el:3"
  lang         text not null check (lang in ('el','en')),
  source       text not null,               -- αρχείο δεδομένων
  url          text,                        -- σελίδα του site που αφορά
  title        text,
  content      text not null,
  content_hash text not null,               -- ώστε το script να ξανακάνει embedding μόνο ό,τι άλλαξε
  embedding    extensions.vector(768),
  updated_at   timestamptz not null default now()
);
create index if not exists kb_chunks_embedding_idx
  on public.kb_chunks using hnsw (embedding extensions.vector_cosine_ops);
create index if not exists kb_chunks_lang_idx on public.kb_chunks (lang);
alter table public.kb_chunks enable row level security;   -- χωρίς policies: μόνο service_role (Edge Function / script)

create or replace function public.match_kb_chunks(
  query_embedding extensions.vector(768), match_lang text, match_count int default 6)
returns table (id text, url text, title text, content text, similarity float)
language sql stable security definer set search_path = public, extensions as $$
  select c.id, c.url, c.title, c.content, 1 - (c.embedding <=> query_embedding) as similarity
  from public.kb_chunks c
  where c.lang = match_lang and c.embedding is not null
  order by c.embedding <=> query_embedding
  limit match_count
$$;
revoke all on function public.match_kb_chunks(extensions.vector, text, int) from public, anon, authenticated;
grant execute on function public.match_kb_chunks(extensions.vector, text, int) to service_role;

-- Όρια χρήσης ανά ημέρα (ώρα Ελλάδας): ανά χρήστη (hash IP) και συνολικά
create table if not exists public.assistant_usage (
  day   date not null,
  key   text not null,
  count int  not null default 0,
  primary key (day, key)
);
alter table public.assistant_usage enable row level security;

create or replace function public.bump_assistant_usage(p_key text, p_limit int, p_global_limit int)
returns text language plpgsql security definer set search_path = public as $$
declare d date := (now() at time zone 'Europe/Athens')::date; g int; c int;
begin
  insert into public.assistant_usage (day, key, count) values (d, 'global', 1)
    on conflict (day, key) do update set count = public.assistant_usage.count + 1
    returning count into g;
  if g > p_global_limit then return 'global_limit'; end if;
  insert into public.assistant_usage (day, key, count) values (d, p_key, 1)
    on conflict (day, key) do update set count = public.assistant_usage.count + 1
    returning count into c;
  if c > p_limit then return 'user_limit'; end if;
  delete from public.assistant_usage where day < d - 7;    -- καθάρισμα παλιών μετρητών
  return 'ok';
end $$;
revoke all on function public.bump_assistant_usage(text, int, int) from public, anon, authenticated;
grant execute on function public.bump_assistant_usage(text, int, int) to service_role;

-- Καταγραφή ερωτήσεων (χωρίς IP ή στοιχεία ταυτοποίησης) για να βελτιώνεται το περιεχόμενο
create table if not exists public.assistant_log (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  lang       text,
  question   text,
  status     text,          -- ok | declined | no_context | user_limit | global_limit | error
  top_sim    real,          -- μεγαλύτερη ομοιότητα που βρέθηκε (για ρύθμιση του κατωφλιού)
  sources    text[]
);
alter table public.assistant_log enable row level security;
drop policy if exists assistant_log_admin_read on public.assistant_log;
create policy assistant_log_admin_read on public.assistant_log for select to authenticated using (public.is_admin());
