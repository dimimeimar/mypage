import { useMemo, useState } from 'react';
import { Check, X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { traceExercises, exercisesText } from '../../data/exercises_data';
import { stripTonos } from '../../utils/text';
import PageHero from '../common/PageHero';
import CtaBand from '../common/CtaBand';

// "7 3", "7,3", " 7  3 " θεωρούνται η ίδια απάντηση
const normalize = (s) => s.trim().replace(/[\s,]+/g, ' ');

/* ── Άσκηση ίχνους: πρόβλεψη εξόδου + εκτέλεση βήμα προς βήμα με πίνακα τιμών ── */
const TraceExercise = ({ exercise, t }) => {
  // steps: [δείκτης γραμμής, μεταβλητές, έξοδος?] - παράγονται εκτελώντας το πρόγραμμα
  const steps = useMemo(() => [...exercise.run()], [exercise]);
  const expected = steps[steps.length - 1][2];
  const columns = useMemo(() => {
    const seen = [];
    steps.forEach(([, vars]) => Object.keys(vars).forEach((k) => { if (!seen.includes(k)) seen.push(k); }));
    return seen;
  }, [steps]);

  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null); // null | 'correct' | 'wrong'
  const [step, setStep] = useState(-1);       // -1 = δεν έχει ξεκινήσει η εκτέλεση
  const unlocked = result !== null;
  const activeLine = step >= 0 ? steps[step][0] : -1;

  const check = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setResult(normalize(answer) === normalize(expected) ? 'correct' : 'wrong');
  };

  return (
    <div className="ex-grid">
      <div>
        <div className="code-win">
          <div className="code-win__bar">
            <span className="code-win__dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="ex-file">{exercise.id}.py</span>
          </div>
          <ol className="ex-code">
            {exercise.code.map((line, i) => (
              <li key={i} className={i === activeLine ? 'is-active' : ''}><code>{line}</code></li>
            ))}
          </ol>
          <div className="code-win__out">
            <span>{t.output}:</span>
            {step >= 0 && steps[step][2] !== undefined && <b>{steps[step][2]}</b>}
          </div>
        </div>

        <form className="ex-answer" onSubmit={check}>
          <label htmlFor={`ans-${exercise.id}`}>{t.answerLabel}</label>
          <div className="ex-answer__row">
            <input
              id={`ans-${exercise.id}`}
              className="form-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t.answerPlaceholder}
              autoComplete="off"
              inputMode="text"
            />
            <button type="submit" className="btn-primary">{stripTonos(t.check)}</button>
          </div>
          {result && (
            <p className={`ex-feedback ex-feedback--${result}`} role="status">
              {result === 'correct' ? <Check size={16} /> : <X size={16} />}
              {result === 'correct' ? t.correct : t.wrong}
            </p>
          )}
        </form>
      </div>

      <div className="ex-trace">
        <h3>{t.tableTitle}</h3>
        {!unlocked ? (
          <p className="ex-locked">{t.stepsLocked}</p>
        ) : (
          <>
            <div className="ex-controls">
              <button type="button" className="btn-outline" onClick={() => setStep((s) => Math.max(s - 1, -1))} disabled={step < 0}>
                <ChevronLeft size={16} /> {stripTonos(t.prev)}
              </button>
              <button type="button" className="btn-primary" onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))} disabled={step >= steps.length - 1}>
                {stripTonos(t.next)} <ChevronRight size={16} />
              </button>
              <button type="button" className="ex-reset" onClick={() => setStep(-1)} aria-label={t.reset} title={t.reset}>
                <RotateCcw size={16} />
              </button>
              <span className="ex-count">{t.step} {step + 1} {t.of} {steps.length}</span>
            </div>
            <div className="ex-table-wrap">
              <table className="ex-table">
                <thead>
                  <tr>
                    <th>{t.line}</th>
                    {columns.map((c) => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {steps.slice(0, step + 1).map(([line, vars], i) => (
                    <tr key={i} className={i === step ? 'is-current' : ''}>
                      <td>{line + 1}</td>
                      {columns.map((c) => <td key={c}>{vars[c] !== undefined ? String(vars[c]) : ''}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Δυαδικό σύστημα: ατελείωτες τυχαίες μετατροπές ── */
const newBinaryTask = () => ({ n: 8 + Math.floor(Math.random() * 248), toBinary: Math.random() < 0.5 });

const BinaryDrill = ({ t }) => {
  const [task, setTask] = useState(newBinaryTask);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [streak, setStreak] = useState(0);

  const binary = task.n.toString(2);
  const expected = task.toBinary ? binary : String(task.n);
  // π.χ. 45 = 32 + 8 + 4 + 1
  const breakdown = [...binary].map((bit, i) => (bit === '1' ? 2 ** (binary.length - 1 - i) : 0)).filter(Boolean).join(' + ');

  const check = (e) => {
    e.preventDefault();
    if (!answer.trim() || result === 'correct') return;
    const given = answer.trim().replace(/^0+(?=\d)/, '');
    const ok = given === expected;
    setResult(ok ? 'correct' : 'wrong');
    setStreak((s) => (ok ? s + 1 : 0));
  };
  const next = () => { setTask(newBinaryTask()); setAnswer(''); setResult(null); };

  return (
    <div className="ex-binary">
      <p className="ex-binary__q">{task.toBinary ? t.toBinary(task.n) : t.toDecimal(binary)}</p>
      <form className="ex-answer__row" onSubmit={check}>
        <input
          className="form-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          inputMode="numeric"
          autoComplete="off"
        />
        {result === 'correct'
          ? <button type="button" className="btn-primary" onClick={next}>{stripTonos(t.next)}</button>
          : <button type="submit" className="btn-primary">{stripTonos(t.check)}</button>}
      </form>
      {result && (
        <p className={`ex-feedback ex-feedback--${result}`} role="status">
          {result === 'correct' ? <Check size={16} /> : <X size={16} />}
          {result === 'correct' ? t.correct : <>{t.wrong} <strong>{task.n} = {breakdown} = {binary}<sub>2</sub></strong></>}
        </p>
      )}
      {result === 'wrong' && <button type="button" className="btn-outline" style={{ marginTop: '1rem' }} onClick={next}>{stripTonos(t.next)}</button>}
      <p className="ex-streak">{t.streak}: <strong>{streak}</strong></p>
    </div>
  );
};

const ExercisesPage = () => {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'el';
  const d = exercisesText[lang];
  const [active, setActive] = useState(0);
  const exercise = traceExercises[active];

  return (
    <div>
      <PageHero seo="exercises" art="plot" eyebrow={d.hero.eyebrow} title={d.hero.title} subtitle={d.hero.subtitle} />

      <section className="band">
        <div className="container">
          <h2 className="band__title">{d.trace.title}</h2>
          <p className="band__lead">{d.trace.lead}</p>

          <div className="ex-tabs" role="tablist" aria-label={d.trace.exercise}>
            {traceExercises.map((ex, i) => (
              <button key={ex.id} type="button" role="tab" aria-selected={i === active} className={i === active ? 'is-active' : ''} onClick={() => setActive(i)}>
                <span>{i + 1}</span> {ex.title[lang]}
              </button>
            ))}
          </div>

          {/* key: κάθε άσκηση ξεκινάει με καθαρή κατάσταση */}
          <TraceExercise key={exercise.id} exercise={exercise} t={d.trace} />
        </div>
      </section>

      <section className="band band--alt">
        <div className="container">
          <h2 className="band__title">{d.binary.title}</h2>
          <p className="band__lead">{d.binary.lead}</p>
          <BinaryDrill t={d.binary} />
        </div>
      </section>

      <CtaBand title={d.cta.title} subtitle={d.cta.subtitle} button={d.cta.button} />
    </div>
  );
};

export default ExercisesPage;
