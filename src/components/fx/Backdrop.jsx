import { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/* Κινούμενο φόντο του θέματος Matrix: ψηφιακή βροχή με 0/1 όπως στην ταινία.
   Στα άλλα δύο θέματα (Κλασικό, Τετράδιο) το φόντο είναι στατικό και δεν αποδίδεται τίποτα. */

const rand = (a, b) => a + Math.random() * (b - a);

/* ── MATRIX: digital rain ── */
function createMatrix(ctx, W, H) {
  const KATAKANA = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
  // Κυρίως 0 και 1, με λίγα katakana για να θυμίζει την ταινία
  const glyph = () => (Math.random() < 0.84 ? (Math.random() < 0.5 ? '0' : '1') : KATAKANA[(Math.random() * KATAKANA.length) | 0]);

  // Τρία επίπεδα βάθους: μακριά (μικρά, αχνά, αργά) -> κοντά (μεγάλα, φωτεινά, γρήγορα)
  const small = W < 700;
  const layers = [
    { size: small ? 10 : 12, speed: [0.25, 0.55], color: 'rgba(0, 150, 45, 0.55)', head: 'rgba(120, 255, 160, 0.7)', fill: 0.5 },
    { size: small ? 14 : 18, speed: [0.45, 1.0], color: 'rgba(0, 255, 65, 0.9)', head: '#e6ffec', fill: 0.6 },
    { size: small ? 22 : 30, speed: [0.8, 1.5], color: 'rgba(60, 255, 110, 0.95)', head: '#ffffff', fill: 0.07 },
  ].map((l) => {
    const cols = Math.ceil(W / l.size);
    return {
      ...l,
      rows: Math.ceil(H / l.size),
      drops: Array.from({ length: cols }, () => ({
        y: rand(-60, 0),
        v: rand(l.speed[0], l.speed[1]),
        on: Math.random() < l.fill,
        last: glyph(),
      })),
    };
  });

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';

  let acc = 0;
  const STEP = 1000 / 30; // η βροχή "πέφτει" στα 30fps για το χαρακτηριστικό τικ-τικ

  return (t, dt) => {
    acc += dt;
    if (acc < STEP) return;
    acc %= STEP;

    // Το ημιδιάφανο μαύρο αφήνει τις ουρές να σβήνουν σταδιακά
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, W, H);

    for (const l of layers) {
      ctx.font = `${l.size}px "JetBrains Mono", monospace`;
      for (let i = 0; i < l.drops.length; i++) {
        const d = l.drops[i];
        if (!d.on) {
          if (Math.random() < 0.0015) d.on = true;
          continue;
        }
        const x = i * l.size + l.size / 2;
        const prevRow = Math.floor(d.y);
        d.y += d.v;
        const row = Math.floor(d.y);
        if (row !== prevRow) {
          // το προηγούμενο "κεφάλι" γίνεται πράσινο, το νέο είναι λευκό
          ctx.fillStyle = l.color;
          ctx.fillText(d.last, x, prevRow * l.size);
          d.last = glyph();
          ctx.fillStyle = l.head;
          ctx.fillText(d.last, x, row * l.size);
        }
        if (row > l.rows && Math.random() > 0.975) {
          d.y = rand(-25, 0);
          d.v = rand(l.speed[0], l.speed[1]);
          d.on = Math.random() < l.fill + 0.1;
        }
      }
      // Τυχαία ψηφία μέσα στις ουρές αλλάζουν τιμή (0 <-> 1)
      const flips = Math.ceil(l.drops.length / 6);
      for (let k = 0; k < flips; k++) {
        const i = (Math.random() * l.drops.length) | 0;
        const d = l.drops[i];
        if (!d.on) continue;
        const row = Math.floor(d.y) - 1 - ((Math.random() * 14) | 0);
        if (row < 0) continue;
        ctx.fillStyle = '#000';
        ctx.fillRect(i * l.size, row * l.size, l.size, l.size);
        ctx.fillStyle = l.color;
        ctx.globalAlpha = 0.75;
        ctx.fillText(glyph(), i * l.size + l.size / 2, row * l.size);
        ctx.globalAlpha = 1;
      }
    }
  };
}



const Backdrop = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined; // η βροχή υπάρχει μόνο στο θέμα Matrix
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const input = { mx: 0, my: 0, scroll: window.scrollY };
    let draw = null;
    let raf = 0;
    let last = performance.now();
    let W = 0;
    let H = 0;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw = createMatrix(ctx, W, H);
      if (reduced) {
        // Στατικό καρέ: προχωράμε τη σκηνή λίγο ώστε να μην είναι άδεια
        for (let i = 0; i < 90; i++) draw(i * 34, 34, input);
      }
    };

    const loop = (now) => {
      const dt = Math.min(now - last, 100);
      last = now;
      draw(now, dt, input);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduced || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e) => {
      input.mx = e.clientX / W - 0.5;
      input.my = e.clientY / H - 0.5;
    };
    const onScroll = () => { input.scroll = window.scrollY; };
    const onVisibility = () => (document.hidden ? stop() : start());
    let resizeTimer;
    const onResize = () => {
      // Στα κινητά το ύψος αλλάζει συνέχεια (address bar) - αγνοούμε μικρές αλλαγές ύψους
      if (window.innerWidth === W && Math.abs(window.innerHeight - H) < 140) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 180);
    };

    setup();
    start();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [theme]);

  if (theme !== 'matrix') return null;

  return (
    <div className="backdrop" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Backdrop;
