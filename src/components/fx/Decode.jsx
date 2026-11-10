import { createElement, useLayoutEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Τίτλος που "αποκαλύπτεται" όταν μπει στην οθόνη.
   - Cosmos / Notebook: οι λέξεις ανεβαίνουν μία μία μέσα από θόλωμα.
   - Matrix: ο τίτλος αποκρυπτογραφείται από 0 και 1.
   Χρήση: <Decode as="h1" className="hero__title" text={d.hero.title} /> */
const Decode = ({ as = 'span', text = '', className = '', delay = 0, ...rest }) => {
  const ref = useRef(null);
  const { theme } = useTheme();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let timer = 0;

    if (reduced) {
      el.textContent = text;
      return undefined;
    }

    if (theme === 'matrix') {
      el.classList.remove('dc-in');
      el.textContent = text.replace(/\S/g, () => (Math.random() < 0.5 ? '0' : '1'));
      const run = () => {
        const t0 = performance.now();
        const dur = Math.min(1500, 500 + text.length * 22);
        const tick = (now) => {
          const k = Math.min((now - t0) / dur, 1);
          const shown = Math.floor(k * text.length);
          let out = text.slice(0, shown);
          for (let i = shown; i < text.length; i++) out += /\s/.test(text[i]) ? text[i] : Math.random() < 0.5 ? '0' : '1';
          el.textContent = out;
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(run, delay);
      }, { threshold: 0.2 });
      io.observe(el);
      return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(timer); };
    }

    el.classList.remove('dc-in');
    el.style.setProperty('--dc-delay', `${delay}ms`);
    el.innerHTML = text
      .split(/\s+/)
      .filter(Boolean)
      .map((w, i) => `<span class="dc-w" style="--i:${i}">${escapeHtml(w)}</span>`)
      .join(' ');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      el.classList.add('dc-in');
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [text, theme, delay]);

  // Το περιεχόμενο το διαχειρίζεται το effect - το React δεν αποδίδει children εδώ.
  return createElement(as, { ref, className, 'aria-label': text, ...rest });
};

export default Decode;
