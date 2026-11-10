import { useEffect, useRef } from 'react';

/* Λεπτή μπάρα προόδου στην κορυφή + φωτεινή κηλίδα που ακολουθεί το ποντίκι.
   Και τα δύο γράφουν μόνο CSS variables (καθόλου React re-render). */
export const ScrollProgress = () => {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty('--p', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
};

export const CursorGlow = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty('--cx', `${e.clientX}px`);
      el.style.setProperty('--cy', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
};
