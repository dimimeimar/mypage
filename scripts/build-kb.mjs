// Χτίζει τη βάση γνώσης της Ψηφιακής Γραμματείας από τα data files του site.
//
//   node scripts/build-kb.mjs --dry     -> γράφει τα κομμάτια στο scripts/.kb-preview.json, χωρίς δίκτυο
//   node scripts/build-kb.mjs           -> embeddings (Gemini) και upsert στο Supabase (μόνο ό,τι άλλαξε)
//
// Χρειάζεται (στο περιβάλλον ή σε αρχείο .env.kb που ΔΕΝ γίνεται commit):
//   GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const EMBED_MODEL = process.env.EMBED_MODEL || 'gemini-embedding-001';
const DIMS = 768;
const MAX_CHARS = 1000;

// ── Ρυθμίσεις ανά αρχείο δεδομένων: ποιο export, ποια σελίδα του site αφορά ──
const SOURCES = [
  { file: 'home_data', exp: 'homeData', url: '/', title: { el: 'Αρχική', en: 'Home' } },
  { file: 'about_data', exp: 'aboutData', url: '/about', title: { el: 'Σχετικά με εμένα', en: 'About me' } },
  { file: 'services_data', exp: 'servicesData', url: '/services', title: { el: 'Υπηρεσίες', en: 'Services' } },
  { file: 'subjects', exp: 'subjectsData', url: '/services/subjects', title: { el: 'Μαθήματα', en: 'Lessons' } },
  { file: 'schools_data', exp: 'schoolsData', url: '/services/schools', title: { el: 'Σχολές και εξετάσεις', en: 'Schools and exams' } },
  { file: 'consulting_data', exp: 'consultingData', url: '/services/consulting', title: { el: 'Συμβουλευτική', en: 'Consulting' } },
  { file: 'repairs_data', exp: 'repairsData', url: '/services/repairs', title: { el: 'Επισκευές', en: 'Repairs' } },
  { file: 'contact_data', exp: 'contactData', url: '/contact', title: { el: 'Επικοινωνία', en: 'Contact' } },
  { file: 'map_data', exp: 'mapData', url: '/contact', title: { el: 'Περιοχές μαθημάτων', en: 'Lesson areas' } },
  { file: 'work_data', exp: 'workData', url: '/work', title: { el: 'Έργα', en: 'Work' } },
  { file: 'privacy_data', exp: 'privacyData', url: '/privacy', title: { el: 'Πολιτική απορρήτου', en: 'Privacy policy' } },
  { file: 'assistant_facts', exp: 'assistantFacts', url: null, title: { el: 'Βασικές πληροφορίες', en: 'Key facts' } },
];
const SKIP_KEYS = new Set(['icon', 'key', 'image', 'img', 'src', 'coords', 'color', 'cta', 'ctaBanner', 'form', 'validation',
  'alerts', 'buttons', 'nav', 'eyebrow', 'updated', 'contactLead', 'placeholder', 'youtubeId', 'ctaPrimary', 'ctaSecondary',
  'allButton', 'inquireLabel', 'outputLabel', 'action', 'textParam', 'number', 'n', 'tag', 'id', 'dragHint', 'scene', 'nodes']);
const PLAIN_LABEL = new Set(['title', 'name', 'heading', 'text', 'description', 'subtitle', 'label', 'details', 'items', 'body']);

// ── Μετατροπή αντικειμένου σε μονάδες κειμένου ──
function units(v, key) {
  if (v == null || typeof v === 'function') return [];
  if (typeof v === 'string') {
    const s = v.replace(/\s+/g, ' ').trim();
    if (!s) return [];
    return [key && !PLAIN_LABEL.has(key) && !/^\d+$/.test(key) ? `${key}: ${s}` : s];
  }
  if (typeof v === 'number' || typeof v === 'boolean') return [];
  if (Array.isArray(v)) return v.flatMap((x) => {
    const u = units(x);
    if (typeof x === 'object' && x && u.length > 1) return [u.join('. ')];   // ένα στοιχείο λίστας = μία μονάδα
    return u;
  });
  if ('question' in v && 'answer' in v) return [`${v.question} ${v.answer}`.replace(/\s+/g, ' ').trim()];
  const out = [];
  for (const [k, val] of Object.entries(v)) {
    if (SKIP_KEYS.has(k)) continue;
    out.push(...units(val, k));
  }
  return out;
}

function splitLong(s) {
  if (s.length <= MAX_CHARS) return [s];
  const parts = s.split(/(?<=[.!;])\s+/);
  const res = []; let cur = '';
  for (const p of parts) {
    if ((cur + ' ' + p).trim().length > MAX_CHARS && cur) { res.push(cur.trim()); cur = p; } else cur = `${cur} ${p}`;
  }
  if (cur.trim()) res.push(cur.trim());
  return res;
}

function pack(us) {
  const chunks = []; let cur = '';
  for (const u of us.flatMap(splitLong)) {
    if (cur && (cur.length + u.length + 1) > MAX_CHARS) { chunks.push(cur); cur = u; } else cur = cur ? `${cur}\n${u}` : u;
  }
  if (cur) chunks.push(cur);
  return chunks;
}

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

async function collect() {
  const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
  const rows = [];
  try {
    for (const s of SOURCES) {
      let mod;
      try { mod = await vite.ssrLoadModule(`/src/data/${s.file}.js`); } catch (e) { console.warn(`παράλειψη ${s.file}: ${e.message}`); continue; }
      const data = mod[s.exp];
      if (!data) { console.warn(`παράλειψη ${s.file}: δεν υπάρχει το export ${s.exp}`); continue; }
      for (const lang of ['el', 'en']) {
        const langData = data[lang];
        if (!langData) continue;
        let idx = 0;
        for (const [section, val] of Object.entries(langData)) {
          if (SKIP_KEYS.has(section)) continue;
          for (const text of pack(units(val))) {
            if (text.length < 60) continue;
            const header = `[${s.title[lang]}${s.url ? ` | ${s.url}` : ''}]`;
            const content = `${header}\n${text}`;
            rows.push({ id: `${s.file}:${lang}:${idx++}`, lang, source: s.file, url: s.url, title: s.title[lang], content, content_hash: sha(content) });
          }
        }
      }
    }
  } finally { await vite.close(); }
  return rows;
}

// ── Gemini embeddings (έως 100 κείμενα ανά αίτημα) ──
async function embed(texts) {
  let res;
  for (let attempt = 0; attempt < 5; attempt++) {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:batchEmbedContents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({ requests: texts.map((t) => ({
      model: `models/${EMBED_MODEL}`, content: { parts: [{ text: t }] }, taskType: 'RETRIEVAL_DOCUMENT', outputDimensionality: DIMS })) }),
  });
    if (res.status !== 429) break;
    console.log('  όριο Gemini (free tier), αναμονή 35s…');
    await new Promise((r) => setTimeout(r, 35000));
  }
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  return (await res.json()).embeddings.map((e) => e.values);
}

async function sb(pathAndQuery, init = {}) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    ...init,
    headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function loadEnvFile() {
  const f = path.join(root, '.env.kb');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const rows = await collect();
console.log(`${rows.length} κομμάτια (${rows.filter((r) => r.lang === 'el').length} el, ${rows.filter((r) => r.lang === 'en').length} en)`);

if (DRY) {
  fs.writeFileSync(path.join(root, 'scripts', '.kb-preview.json'), JSON.stringify(rows, null, 2));
  console.log('Γράφτηκε scripts/.kb-preview.json');
  process.exit(0);
}

loadEnvFile();
for (const k of ['GEMINI_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
  if (!process.env[k]) { console.error(`Λείπει το ${k}`); process.exit(1); }
}

const existing = await sb('kb_chunks?select=id,content_hash&limit=10000');
const have = new Map(existing.map((r) => [r.id, r.content_hash]));
const todo = rows.filter((r) => have.get(r.id) !== r.content_hash);
console.log(`Νέα ή αλλαγμένα: ${todo.length}, αμετάβλητα: ${rows.length - todo.length}`);

for (let i = 0; i < todo.length; i += 50) {
  const batch = todo.slice(i, i + 50);
  const vectors = await embed(batch.map((r) => r.content));
  const payload = batch.map((r, j) => ({ ...r, embedding: `[${vectors[j].join(',')}]`, updated_at: new Date().toISOString() }));
  await sb('kb_chunks?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates' }, body: JSON.stringify(payload) });
  console.log(`  ανέβηκαν ${Math.min(i + 50, todo.length)}/${todo.length}`);
}

// διαγραφή κομματιών που δεν υπάρχουν πια στα data files
const live = new Set(rows.map((r) => r.id));
const stale = existing.map((r) => r.id).filter((id) => !live.has(id));
for (const id of stale) await sb(`kb_chunks?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
if (stale.length) console.log(`Διαγράφηκαν ${stale.length} παλιά κομμάτια`);
console.log('Έτοιμο.');
