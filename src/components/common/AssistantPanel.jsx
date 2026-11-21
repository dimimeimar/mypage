import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, SendHorizontal, RotateCcw } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { assistantData } from '../../data/assistant_data';

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask`;
const MAX_LEN = 400;

const AssistantPanel = ({ open, onClose, lang }) => {
  const d = assistantData[lang];
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const logRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [messages, busy]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const ask = async (raw) => {
    const question = raw.trim();
    if (!question || busy) return;
    if (question.length > MAX_LEN) { setMessages((m) => [...m, { role: 'assistant', text: d.tooLong }]); return; }
    const history = messages.filter((m) => !m.local).slice(-4).map(({ role, text: t }) => ({ role, text: t }));
    setMessages((m) => [...m, { role: 'user', text: question }]);
    setText('');
    setBusy(true);
    try {
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      setMessages((m) => [...m, { role: 'assistant', text: j.answer, sources: j.sources || [] }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: d.error, local: true }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  if (!open) return null;

  return (
    <section className="assistant" role="dialog" aria-label={d.name}>
      <header className="assistant__head">
        <div>
          <strong>{d.name}</strong>
          <small>{d.subtitle}</small>
        </div>
        <div className="assistant__actions">
          {messages.length > 0 && (
            <button type="button" onClick={() => setMessages([])} aria-label={d.clear} title={d.clear}><RotateCcw size={16} /></button>
          )}
          <button type="button" onClick={onClose} aria-label={d.close} title={d.close}><X size={18} /></button>
        </div>
      </header>

      <div className="assistant__log" ref={logRef} aria-live="polite">
        <p className="assistant__msg assistant__msg--bot">{d.intro}</p>
        {messages.length === 0 && (
          <div className="assistant__chips">
            {d.chips.map((c) => (<button key={c} type="button" onClick={() => ask(c)}>{c}</button>))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`assistant__msg assistant__msg--${m.role === 'user' ? 'user' : 'bot'}`}>
            <p>{m.text}</p>
            {m.sources?.length > 0 && (
              <p className="assistant__sources">
                {d.sources}:{' '}
                {m.sources.map((s, k) => (
                  <Link key={s.url} to={s.url} onClick={onClose}>{s.title}{k < m.sources.length - 1 ? ', ' : ''}</Link>
                ))}
              </p>
            )}
          </div>
        ))}
        {busy && <p className="assistant__msg assistant__msg--bot assistant__typing">{d.thinking}</p>}
      </div>

      <form className="assistant__form" onSubmit={(e) => { e.preventDefault(); ask(text); }}>
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={d.placeholder}
          maxLength={MAX_LEN}
          aria-label={d.placeholder}
          autoComplete="off"
        />
        <button type="submit" disabled={busy || !text.trim()} aria-label={d.send}><SendHorizontal size={18} /></button>
      </form>
      <p className="assistant__notice">
        {d.notice} <Link to={ROUTES.PRIVACY} onClick={onClose}>{d.privacy}</Link> · <Link to={ROUTES.CONTACT} onClick={onClose}>{d.contact}</Link>
      </p>
    </section>
  );
};

export default AssistantPanel;
