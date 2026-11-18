// gcal-sync: keeps Google Calendar and the database in step.
//  1. PUSH  approved lessons -> create / update / delete the Google event
//  2. PULL  my Google events -> external_busy (start/end only), so they block slots on the site
// Called by pg_cron every 5 minutes (header x-sync-secret) and by the admin page right after an approval (admin JWT).
// Deploy with: supabase functions deploy gcal-sync --no-verify-jwt
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GAS_URL = Deno.env.get('APPS_SCRIPT_URL')!;
const GAS_TOKEN = Deno.env.get('APPS_SCRIPT_TOKEN')!;
const SYNC_SECRET = Deno.env.get('SYNC_SECRET')!;

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-sync-secret, apikey, x-client-info',
};
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

async function gas(action: string, payload: Record<string, unknown> = {}) {
  const r = await fetch(GAS_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, token: GAS_TOKEN, payload }),
  });
  const text = await r.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Apps Script returned non-JSON: ${text.slice(0, 160)}`);
  }
}

async function authorized(req: Request): Promise<boolean> {
  if (SYNC_SECRET && req.headers.get('x-sync-secret') === SYNC_SECRET) return true;
  const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!jwt) return false;
  const { data } = await db.auth.getUser(jwt);
  if (!data?.user) return false;
  const { data: p } = await db.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
  return p?.role === 'admin';
}

const eventTitle = (l: any) => (l.subject ? `${l.student_name} ${l.subject}` : l.student_name);
const eventNotes = (l: any) =>
  [l.student_email && `Email: ${l.student_email}`, l.student_phone && `Tel: ${l.student_phone}`, l.notes]
    .filter(Boolean).join('\n');
const same = (a: string | null, b: string) => !!a && new Date(a).getTime() === new Date(b).getTime();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (!(await authorized(req))) return reply({ error: 'unauthorized' }, 401);

  const stats = { created: 0, updated: 0, deleted: 0, pulled: 0, errors: [] as string[] };

  try {
    // ── PUSH: create ──
    const { data: toCreate } = await db.from('lessons').select('*')
      .eq('status', 'approved').is('gcal_event_id', null);
    for (const l of toCreate ?? []) {
      const r = await gas('createEvent', {
        title: eventTitle(l), startTime: l.starts_at, endTime: l.ends_at, notes: eventNotes(l),
      });
      if (r.success) {
        await db.from('lessons').update({
          gcal_event_id: r.googleEventId, gcal_synced_at: new Date().toISOString(),
          gcal_synced_start: l.starts_at, gcal_synced_end: l.ends_at,
        }).eq('id', l.id);
        stats.created++;
      } else stats.errors.push(`create ${l.id}: ${r.error}`);
    }

    // ── PUSH: update (time or text changed) ──
    const { data: synced } = await db.from('lessons').select('*')
      .eq('status', 'approved').not('gcal_event_id', 'is', null);
    for (const l of synced ?? []) {
      if (same(l.gcal_synced_start, l.starts_at) && same(l.gcal_synced_end, l.ends_at)) continue;
      const r = await gas('updateEvent', {
        googleEventId: l.gcal_event_id, title: eventTitle(l), notes: eventNotes(l),
        startTime: l.starts_at, endTime: l.ends_at,
      });
      if (r.success) {
        await db.from('lessons').update({
          gcal_synced_at: new Date().toISOString(), gcal_synced_start: l.starts_at, gcal_synced_end: l.ends_at,
        }).eq('id', l.id);
        stats.updated++;
      } else stats.errors.push(`update ${l.id}: ${r.error}`);
    }

    // ── PUSH: delete (cancelled / rejected after being in Google) ──
    const { data: toDelete } = await db.from('lessons').select('id, gcal_event_id')
      .in('status', ['cancelled', 'rejected']).not('gcal_event_id', 'is', null);
    for (const l of toDelete ?? []) {
      const r = await gas('deleteEvent', { googleEventId: l.gcal_event_id });
      if (r.success || r.error === 'Event not found') {
        await db.from('lessons').update({ gcal_event_id: null }).eq('id', l.id);
        stats.deleted++;
      } else stats.errors.push(`delete ${l.id}: ${r.error}`);
    }

    // ── PULL: my Google events -> external_busy ──
    const from = new Date(Date.now() - 24 * 3600e3);
    const to = new Date(Date.now() + 270 * 24 * 3600e3);
    const res = await gas('getEvents', { timeMin: from.toISOString(), timeMax: to.toISOString() });
    if (!res.success) throw new Error(`getEvents: ${res.error}`);

    const { data: own } = await db.from('lessons').select('gcal_event_id').not('gcal_event_id', 'is', null);
    const ownIds = new Set((own ?? []).map((r: any) => r.gcal_event_id));
    const runStamp = new Date().toISOString();
    // recurring events repeat the same id, so de-duplicate on id + start
    const extMap = new Map<string, any>();
    for (const e of res.events as any[]) {
      if (e.isAllDay || ownIds.has(e.googleEventId)) continue;
      extMap.set(`${e.googleEventId}|${e.start}`, {
        google_event_id: e.googleEventId, starts_at: e.start, ends_at: e.end, title: e.title ?? null, seen_at: runStamp,
      });
    }
    const ext = [...extMap.values()];

    for (let i = 0; i < ext.length; i += 500) {
      const { error } = await db.from('external_busy')
        .upsert(ext.slice(i, i + 500), { onConflict: 'google_event_id,starts_at' });
      if (error) throw new Error(`upsert external_busy: ${error.message}`);
    }
    // anything in the window that was not refreshed this run has disappeared from Google
    await db.from('external_busy').delete()
      .lt('seen_at', runStamp).gte('starts_at', from.toISOString()).lte('starts_at', to.toISOString());
    // old rows are no longer needed
    await db.from('external_busy').delete().lt('ends_at', from.toISOString());
    stats.pulled = ext.length;
  } catch (e) {
    stats.errors.push(String(e));
    return reply({ ok: false, ...stats }, 500);
  }
  return reply({ ok: stats.errors.length === 0, ...stats });
});
