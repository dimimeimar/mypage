import { useEffect, useRef, useState } from 'react';

/* Μετρητής που "ανεβαίνει" από το 0 όταν μπει στην οθόνη. value π.χ. '500+', '100%' */
const Counter = ({ value, run }) => {
  const [shown, setShown] = useState('0');
  useEffect(() => {
    if (!run) return undefined;
    const target = parseInt(value.replace(/\D/g, ''), 10) || 0;
    const suffix = value.replace(/[0-9]/g, '');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min((now - t0) / 1800, 1);
      const eased = 1 - Math.pow(1 - k, 4);
      setShown(Math.round(eased * target) + suffix);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  return <div className="stat__num">{run ? shown : '0'}</div>;
};

/* items: [{ value: '12+', label: 'Χρονια Εμπειριας' }, ...] */
const StatsBand = ({ items }) => {
  const ref = useRef(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRun(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="stats-band">
      <div className="container">
        <div className={`stats-band__grid stats-band__grid--${items.length}`} style={{ '--cols': items.length }}>
          {items.map((s) => (
            <div key={s.label} className="stat">
              <Counter value={s.value} run={run} />
              <p className="stat__label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBand;
