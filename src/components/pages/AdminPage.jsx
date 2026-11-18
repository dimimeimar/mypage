import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import PageHero from '../common/PageHero';
import '../../styles/admin.css';

/* Σελίδα διαχείρισης (μόνο για τον admin). Η πραγματική προστασία είναι οι κανόνες της βάσης (RLS):
   ακόμα κι αν κάποιος ανοίξει αυτή τη σελίδα, δεν μπορεί να διαβάσει ή να αλλάξει τίποτα. */

const DAYS = ['Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ', 'Κυρ'];
const MONTHS = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαϊ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'];

const fmt = (iso) =>
  new Date(iso).toLocaleString('el-GR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });
const OVERLAP_MSG = 'Η ώρα συγκρούεται με άλλο κλεισμένο μάθημα.';
const errText = (error) => (error?.code === '23P01' ? OVERLAP_MSG : error?.message || 'Άγνωστο σφάλμα');

const TABS = [
  ['requests', 'Αιτήματα'],
  ['schedule', 'Πρόγραμμα'],
  ['add', 'Νέο'],
  ['whitelist', 'Whitelist'],
  ['bulk', 'Μαζική ακύρωση'],
  ['stats', 'Στατιστικά'],
];

/* ───────── Αιτήματα και άμεσες κρατήσεις που περιμένουν αποδοχή ───────── */
const Requests = ({ notify, sync }) => {
  const [rows, setRows] = useState(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('lessons').select('*')
      .in('status', ['pending', 'booked']).eq('kind', 'lesson')
      .gte('ends_at', new Date().toISOString()).order('starts_at');
    if (error) notify(errText(error), 'err');
    setRows(data || []);
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  const decide = async (row, status) => {
    const { error } = await supabase.from('lessons').update({ status }).eq('id', row.id);
    if (error) { notify(errText(error), 'err'); return; }
    notify(status === 'approved' ? 'Εγκρίθηκε. Στέλνεται στο Google Calendar.' : 'Απορρίφθηκε.');
    await load();
    if (status === 'approved') sync();
  };

  if (!rows) return <p className="adm-muted">Φόρτωση...</p>;
  if (!rows.length) return <p className="adm-muted">Δεν υπάρχουν αιτήματα που περιμένουν.</p>;

  return (
    <ul className="adm-list">
      {rows.map((r) => (
        <li key={r.id} className="adm-item">
          <div className="adm-item__main">
            <strong>{r.student_name}</strong>
            <span className={`adm-badge${r.status === 'booked' ? ' adm-badge--direct' : ''}`}>
              {r.status === 'booked' ? 'Άμεση κράτηση (πιάνει την ώρα)' : 'Αίτημα'}
            </span>
            <div>{fmt(r.starts_at)} - {fmtTime(r.ends_at)}</div>
            {r.student_email && <div className="adm-muted">{r.student_email}</div>}
            {r.notes && <div className="adm-muted">{r.notes}</div>}
          </div>
          <div className="adm-item__actions">
            <button type="button" className="btn-primary" onClick={() => decide(r, 'approved')}>Αποδοχή</button>
            <button type="button" className="btn-outline" onClick={() => decide(r, 'rejected')}>Απόρριψη</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

/* ───────── Πρόγραμμα (εγκεκριμένα) ───────── */
const Schedule = ({ notify, sync }) => {
  const [rows, setRows] = useState(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('lessons').select('*').eq('status', 'approved')
      .gte('ends_at', new Date().toISOString()).order('starts_at').limit(300);
    if (error) notify(errText(error), 'err');
    setRows(data || []);
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  const cancel = async (row) => {
    if (!window.confirm(`Ακύρωση: ${row.student_name}, ${fmt(row.starts_at)};`)) return;
    const { error } = await supabase.from('lessons').update({ status: 'cancelled' }).eq('id', row.id);
    if (error) { notify(errText(error), 'err'); return; }
    notify('Ακυρώθηκε. Σβήνεται και από το Google Calendar.');
    await load();
    sync();
  };

  if (!rows) return <p className="adm-muted">Φόρτωση...</p>;
  if (!rows.length) return <p className="adm-muted">Δεν υπάρχουν εγκεκριμένα μαθήματα στο μέλλον.</p>;

  return (
    <ul className="adm-list">
      {rows.map((r) => (
        <li key={r.id} className="adm-item">
          <div className="adm-item__main">
            <strong>{r.student_name}{r.subject ? ` ${r.subject}` : ''}</strong>
            {r.kind === 'block' && <span className="adm-badge">Κλείσιμο ώρας</span>}
            <div>{fmt(r.starts_at)} - {fmtTime(r.ends_at)}</div>
            {!r.gcal_event_id && <div className="adm-muted">Δεν έχει περάσει ακόμα στο Google Calendar</div>}
          </div>
          <div className="adm-item__actions">
            <button type="button" className="btn-outline" onClick={() => cancel(r)}>Ακύρωση</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

/* ───────── Νέο μάθημα ή κλείσιμο ώρας από τον admin ───────── */
const AddLesson = ({ notify, sync }) => {
  const [f, setF] = useState({ kind: 'lesson', name: '', email: '', subject: '', start: '', minutes: 60 });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const start = new Date(f.start);
    if (Number.isNaN(start.getTime()) || !f.name.trim()) { notify('Συμπλήρωσε όνομα και ώρα.', 'err'); return; }
    const end = new Date(start.getTime() + Number(f.minutes) * 60000);
    const { error } = await supabase.from('lessons').insert({
      kind: f.kind, status: 'approved', student_name: f.name.trim(),
      student_email: f.email.trim().toLowerCase() || null, subject: f.subject.trim() || null,
      starts_at: start.toISOString(), ends_at: end.toISOString(),
    });
    if (error) { notify(errText(error), 'err'); return; }
    notify('Προστέθηκε. Στέλνεται στο Google Calendar.');
    setF((p) => ({ ...p, name: '', email: '', subject: '' }));
    sync();
  };

  return (
    <form className="adm-form" onSubmit={submit}>
      <label>Τύπος
        <select value={f.kind} onChange={set('kind')}>
          <option value="lesson">Μάθημα</option>
          <option value="block">Κλείσιμο ώρας (π.χ. ταξίδι, συντήρηση)</option>
        </select>
      </label>
      <label>{f.kind === 'block' ? 'Τίτλος' : 'Όνομα μαθητή'}
        <input value={f.name} onChange={set('name')} required />
      </label>
      {f.kind === 'lesson' && (
        <>
          <label>Email (προαιρετικό)<input type="email" value={f.email} onChange={set('email')} /></label>
          <label>Μάθημα (προαιρετικό)<input value={f.subject} onChange={set('subject')} /></label>
        </>
      )}
      <label>Έναρξη<input type="datetime-local" value={f.start} onChange={set('start')} required /></label>
      <label>Διάρκεια (λεπτά)<input type="number" min="15" step="15" value={f.minutes} onChange={set('minutes')} /></label>
      <button type="submit" className="btn-primary">Προσθήκη</button>
    </form>
  );
};

/* ───────── Whitelist ───────── */
const Whitelist = ({ notify }) => {
  const [list, setList] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    const [w, p] = await Promise.all([
      supabase.from('whitelist_emails').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ]);
    if (w.error) notify(errText(w.error), 'err');
    setList(w.data || []);
    setProfiles(p.data || []);
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  const add = async (e) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) { notify('Μη έγκυρο email.', 'err'); return; }
    const { error } = await supabase.from('whitelist_emails').insert({ email: clean, note: note.trim() || null });
    if (error) { notify(error.code === '23505' ? 'Το email υπάρχει ήδη.' : errText(error), 'err'); return; }
    notify('Προστέθηκε. Μπορεί να κλείνει άμεσα μόλις συνδεθεί με αυτό το Google account.');
    setEmail(''); setNote('');
    load();
  };

  const remove = async (row) => {
    if (!window.confirm(`Αφαίρεση ${row.email} από το whitelist;`)) return;
    const { error } = await supabase.from('whitelist_emails').delete().eq('email', row.email);
    if (error) { notify(errText(error), 'err'); return; }
    notify('Αφαιρέθηκε.');
    load();
  };

  return (
    <div>
      <form className="adm-form adm-form--inline" onSubmit={add}>
        <label>Email μαθητή (το Google account που θα χρησιμοποιεί)
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Σημείωση (προαιρετικό)<input value={note} onChange={(e) => setNote(e.target.value)} /></label>
        <button type="submit" className="btn-primary">Προσθήκη</button>
      </form>

      <h3 className="adm-h">Με δικαίωμα άμεσης κράτησης</h3>
      {!list.length ? <p className="adm-muted">Κανείς ακόμα.</p> : (
        <ul className="adm-list">
          {list.map((w) => (
            <li key={w.email} className="adm-item">
              <div className="adm-item__main"><strong>{w.email}</strong>{w.note && <div className="adm-muted">{w.note}</div>}</div>
              <div className="adm-item__actions"><button type="button" className="btn-outline" onClick={() => remove(w)}>Αφαίρεση</button></div>
            </li>
          ))}
        </ul>
      )}

      <h3 className="adm-h">Χρήστες που έχουν συνδεθεί</h3>
      {!profiles.length ? <p className="adm-muted">Κανείς ακόμα.</p> : (
        <ul className="adm-list">
          {profiles.map((p) => (
            <li key={p.id} className="adm-item">
              <div className="adm-item__main">
                <strong>{p.full_name || p.email}</strong>
                {p.role === 'admin' && <span className="adm-badge">Admin</span>}
                {p.can_book_direct && <span className="adm-badge adm-badge--direct">Άμεση κράτηση</span>}
                <div className="adm-muted">{p.email}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ───────── Μαζική ακύρωση ───────── */
const Bulk = ({ notify, sync }) => {
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [found, setFound] = useState(null);

  const preview = async (e) => {
    e.preventDefault();
    if (!q.trim() && !from && !to) { notify('Βάλε τουλάχιστον ένα φίλτρο (όνομα ή ημερομηνίες).', 'err'); return; }
    let query = supabase.from('lessons')
      .select('id, student_name, starts_at, ends_at, status')
      .in('status', ['pending', 'booked', 'approved']).eq('kind', 'lesson')
      .order('starts_at').limit(500);
    if (q.trim()) query = query.ilike('student_name', `%${q.trim()}%`);
    if (from) query = query.gte('starts_at', new Date(`${from}T00:00:00`).toISOString());
    if (to) query = query.lte('starts_at', new Date(`${to}T23:59:59`).toISOString());
    const { data, error } = await query;
    if (error) { notify(errText(error), 'err'); return; }
    setFound(data || []);
  };

  const run = async () => {
    if (!found?.length) return;
    if (!window.confirm(`Θα ακυρωθούν ${found.length} μαθήματα και θα σβηστούν από το Google Calendar. Συνέχεια;`)) return;
    const { error } = await supabase.from('lessons').update({ status: 'cancelled' }).in('id', found.map((r) => r.id));
    if (error) { notify(errText(error), 'err'); return; }
    notify(`Ακυρώθηκαν ${found.length} μαθήματα.`);
    setFound(null);
    sync();
  };

  return (
    <div>
      <form className="adm-form adm-form--inline" onSubmit={preview}>
        <label>Όνομα περιέχει<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="π.χ. Νεκτάριος" /></label>
        <label>Από<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label>Μέχρι<input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button type="submit" className="btn-outline">Προεπισκόπηση</button>
      </form>

      {found && (
        <>
          <p><strong>{found.length}</strong> μαθήματα ταιριάζουν{found.length === 500 ? ' (εμφανίζονται τα πρώτα 500)' : ''}.</p>
          {found.length > 0 && (
            <>
              <ul className="adm-list adm-list--compact">
                {found.slice(0, 60).map((r) => (
                  <li key={r.id} className="adm-item"><div className="adm-item__main">{r.student_name}: {fmt(r.starts_at)}</div></li>
                ))}
              </ul>
              {found.length > 60 && <p className="adm-muted">... και άλλα {found.length - 60}</p>}
              <button type="button" className="btn-primary" onClick={run}>Ακύρωση {found.length} μαθημάτων</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

/* ───────── Στατιστικά ───────── */
const Bars = ({ items, label, value, unit }) => {
  const max = Math.max(1, ...items.map((i) => Number(i[value])));
  return (
    <div className="adm-bars">
      {items.map((i) => (
        <div key={i.k} className="adm-bar" title={`${label(i)}: ${i[value]} ${unit}`}>
          <div className="adm-bar__fill" style={{ height: `${(Number(i[value]) / max) * 100}%` }} />
          <span className="adm-bar__label">{label(i)}</span>
        </div>
      ))}
    </div>
  );
};

const Stats = ({ notify }) => {
  const [s, setS] = useState(null);

  useEffect(() => {
    supabase.rpc('admin_stats').then(({ data, error }) => {
      if (error) notify(errText(error), 'err');
      else setS(data);
    });
  }, [notify]);

  if (!s) return <p className="adm-muted">Φόρτωση...</p>;

  const monthLabel = (i) => `${MONTHS[Number(i.k.slice(5)) - 1]} ${i.k.slice(2, 4)}`;
  const last = s.monthly.slice(-24);
  const byYear = {};
  s.monthly.forEach((m) => {
    const y = m.k.slice(0, 4);
    byYear[y] = byYear[y] || { lessons: 0, hours: 0 };
    byYear[y].lessons += Number(m.lessons);
    byYear[y].hours += Number(m.hours);
  });

  return (
    <div>
      <div className="adm-cards">
        <div className="adm-card"><b>{s.totals.lessons}</b><span>μαθήματα συνολικά</span></div>
        <div className="adm-card"><b>{s.totals.hours}</b><span>ώρες συνολικά</span></div>
        {Object.entries(byYear).map(([y, v]) => (
          <div key={y} className="adm-card"><b>{Math.round(v.hours)}</b><span>ώρες το {y}</span></div>
        ))}
      </div>

      <h3 className="adm-h">Ώρες ανά μήνα (τελευταίοι 24)</h3>
      <Bars items={last} label={monthLabel} value="hours" unit="ώρες" />

      <h3 className="adm-h">Μαθήματα ανά ημέρα της εβδομάδας</h3>
      <Bars items={s.weekday} label={(i) => DAYS[i.k - 1]} value="lessons" unit="μαθήματα" />

      <h3 className="adm-h">Μαθήματα ανά ώρα έναρξης</h3>
      <Bars items={s.hour} label={(i) => `${i.k}`} value="lessons" unit="μαθήματα" />
    </div>
  );
};

/* ───────── Σελίδα ───────── */
const AdminPage = () => {
  const { ready, user, isAdmin, signOut } = useAuth();
  const [tab, setTab] = useState('requests');
  const [toast, setToast] = useState(null);

  const notify = useCallback((text, kind = 'ok') => {
    setToast({ text, kind });
    window.clearTimeout(notify.t);
    notify.t = window.setTimeout(() => setToast(null), 6000);
  }, []);

  // Στέλνει τις αλλαγές στο Google Calendar. Αν αποτύχει, το ξαναδοκιμάζει το αυτόματο sync κάθε 5 λεπτά.
  const sync = useCallback(async () => {
    const { error } = await supabase.functions.invoke('gcal-sync');
    if (error) notify('Αποθηκεύτηκε. Ο συγχρονισμός με το Google Calendar θα γίνει σε λίγα λεπτά.', 'warn');
  }, [notify]);

  const header = <PageHero compact title="Διαχείριση" />;
  const head = (<Helmet><title>Διαχείριση</title><meta name="robots" content="noindex" /></Helmet>);

  if (!ready) return <div>{head}{header}<section className="band"><div className="container"><p className="adm-muted">Φόρτωση...</p></div></section></div>;

  if (!user || !isAdmin) {
    return (
      <div>
        {head}{header}
        <section className="band"><div className="container">
          <div className="auth-card">
            <p>{user ? `Ο λογαριασμός ${user.email} δεν έχει δικαίωμα διαχείρισης.` : 'Χρειάζεται σύνδεση.'}</p>
            <Link className="btn-primary" to={ROUTES.LOGIN}>{user ? 'Αλλαγή λογαριασμού' : 'Σύνδεση'}</Link>
          </div>
        </div></section>
      </div>
    );
  }

  const Active = { requests: Requests, schedule: Schedule, add: AddLesson, whitelist: Whitelist, bulk: Bulk, stats: Stats }[tab];

  return (
    <div>
      {head}{header}
      <section className="band">
        <div className="container">
          <div className="adm-top">
            <span className="adm-muted">{user.email}</span>
            <button type="button" className="btn-outline" onClick={signOut}>Αποσύνδεση</button>
          </div>
          <div className="adm-tabs" role="tablist">
            {TABS.map(([key, label]) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} className={tab === key ? 'is-active' : ''} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </div>
          {toast && <div className={`adm-toast adm-toast--${toast.kind}`} role="status">{toast.text}</div>}
          <Active notify={notify} sync={sync} />
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
