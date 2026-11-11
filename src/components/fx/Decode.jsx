import { createElement, useLayoutEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/* Τίτλος που στο θέμα Matrix "αποκρυπτογραφείται" από 0 και 1 όταν μπει στην οθόνη.
   Στα άλλα θέματα είναι απλό κείμενο.
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

    // Κλασικό / Τετράδιο: απλό κείμενο, χωρίς εφέ
    el.textContent = text;
    if (reduced) return undefined;

    if (theme === 'matrix') {
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

    return undefined;
  }, [text, theme, delay]);

  // Το περιεχόμενο το διαχειρίζεται το effect - το React δεν αποδίδει children εδώ.
  return createElement(as, { ref, className, 'aria-label': text, ...rest });
};

export default Decode;
