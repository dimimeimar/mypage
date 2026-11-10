import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const LINES = [
  '> uplink established',
  '> decrypting curriculum ......... 100%',
  '> loading: java python c++ c# unity',
  '> welcome to the real syllabus.',
];
const FULL = LINES.join('\n');

/* Μικρό "boot sequence" τερματικού. Παίζει μόνο τη στιγμή που ο επισκέπτης
   επιλέγει το θέμα Matrix (όχι σε κάθε φόρτωση). Κλικ = παράλειψη. */
const MatrixBoot = () => {
  const { matrixBoot } = useTheme();
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState('off'); // off | typing | leaving

  useEffect(() => {
    if (!matrixBoot) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    setChars(0);
    setPhase('typing');
    let n = 0;
    const type = setInterval(() => {
      n += 2;
      setChars(n);
      if (n >= FULL.length) clearInterval(type);
    }, 16);
    const leave = setTimeout(() => setPhase('leaving'), FULL.length * 8 + 700);
    const off = setTimeout(() => setPhase('off'), FULL.length * 8 + 1350);
    return () => { clearInterval(type); clearTimeout(leave); clearTimeout(off); };
  }, [matrixBoot]);

  if (phase === 'off') return null;
  return (
    <div className={`matrix-boot${phase === 'leaving' ? ' is-leaving' : ''}`} onClick={() => setPhase('off')} role="presentation">
      <pre>{FULL.slice(0, chars)}</pre>
    </div>
  );
};

export default MatrixBoot;
