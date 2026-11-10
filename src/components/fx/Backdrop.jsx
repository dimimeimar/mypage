import { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/* ════════════════════════════════════════════════════════════════════
   Κινούμενο φόντο ολόκληρου του site. Ένα canvas, τρεις "σκηνές":
     default -> αστρικό πεδίο με βάθος (parallax σε scroll + ποντίκι)
     classic -> γραφικές παραστάσεις που σχεδιάζονται σε τετραγωνισμένο χαρτί
     matrix  -> ψηφιακή βροχή με 0/1 όπως στην ταινία
   Κάθε σκηνή είναι ένα factory που επιστρέφει draw(t, dt, input).
   ════════════════════════════════════════════════════════════════════ */

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

/* ── COSMOS: αστρικό πεδίο ── */
function createCosmos(ctx, W, H) {
  const count = Math.min(520, Math.round((W * H) / 4200));
  const tints = ['255,255,255', '255,255,255', '255,255,255', '138,244,230', '255,200,140', '170,180,255'];
  const stars = Array.from({ length: count }, () => {
    const z = Math.pow(Math.random(), 1.8) * 0.9 + 0.1; // οι περισσότεροι μακριά
    return { x: Math.random() * W, y: Math.random() * H, z, r: 0.4 + z * 1.5, ph: Math.random() * 6.28, tint: tints[(Math.random() * tints.length) | 0] };
  });
  let shoot = null;
  let nextShoot = 2500;
  let mx = 0;
  let my = 0;

  return (t, dt, input) => {
    ctx.clearRect(0, 0, W, H);
    mx += (input.mx - mx) * 0.04;
    my += (input.my - my) * 0.04;

    for (const s of stars) {
      const x = (((s.x - mx * s.z * 40) % W) + W) % W;
      const y = (((s.y - input.scroll * s.z * 0.22 - my * s.z * 40) % H) + H) % H;
      const a = (0.35 + 0.65 * s.z) * (0.65 + 0.35 * Math.sin(t * 0.0015 + s.ph));
      ctx.fillStyle = `rgba(${s.tint},${a})`;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, 6.2832);
      ctx.fill();
    }

    // Πεφταστέρι κάθε λίγα δευτερόλεπτα
    nextShoot -= dt;
    if (!shoot && nextShoot <= 0) {
      shoot = { x: rand(W * 0.2, W), y: rand(0, H * 0.4), life: 0 };
      nextShoot = rand(4000, 9000);
    }
    if (shoot) {
      shoot.life += dt / 900;
      const px = shoot.x - shoot.life * 420;
      const py = shoot.y + shoot.life * 190;
      const g = ctx.createLinearGradient(px, py, px + 150, py - 68);
      const a = Math.sin(Math.min(shoot.life, 1) * Math.PI);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(1, 'rgba(138,244,230,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 150, py - 68);
      ctx.stroke();
      if (shoot.life >= 1) shoot = null;
    }
  };
}

/* ── NOTEBOOK: γραφικές παραστάσεις που "γράφονται" με στυλό ── */
function createNotebook(ctx, W, H) {
  const FUNCS = [
    (x) => 0.62 * Math.sin(3 * Math.PI * x),
    (x) => 1.3 * x * x - 0.65,
    (x) => 0.85 * Math.exp(-1.6 * (x + 1)) * Math.cos(5 * Math.PI * x),
    (x) => 2.4 * (x * x * x - 0.55 * x),
    (x) => 1.2 * Math.exp(-7 * x * x) - 0.55,
    (x) => 0.6 * Math.tanh(4 * x),
    (x) => 0.5 * Math.sin(2 * Math.PI * x) + 0.25 * Math.sin(6 * Math.PI * x),
  ];
  const INK = ['36, 86, 230', '240, 78, 22'];
  const DRAW = 4200;
  const HOLD = 3800;
  const FADE = 1600;

  const spawn = (delay = 0) => {
    const w = rand(220, Math.min(420, W * 0.6));
    return {
      f: FUNCS[(Math.random() * FUNCS.length) | 0],
      ink: INK[Math.random() < 0.7 ? 0 : 1],
      cx: rand(w / 2 + 10, W - w / 2 - 10),
      cy: rand(H * 0.15, H * 0.85),
      w,
      h: w * 0.42,
      age: -delay,
    };
  };
  const n = W < 700 ? 2 : 4;
  let plots = Array.from({ length: n }, (_, i) => spawn(i * 1500));

  return (t, dt) => {
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    plots = plots.map((p) => {
      p.age += dt;
      if (p.age < 0) return p;
      if (p.age > DRAW + HOLD + FADE) return spawn();

      const prog = Math.min(p.age / DRAW, 1);
      const fade = p.age > DRAW + HOLD ? 1 - (p.age - DRAW - HOLD) / FADE : 1;
      const hw = p.w / 2;

      // άξονες
      const ax = Math.min(prog * 4, 1);
      ctx.strokeStyle = `rgba(20, 33, 61, ${0.2 * fade})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.cx - hw * ax, p.cy);
      ctx.lineTo(p.cx + hw * ax, p.cy);
      ctx.moveTo(p.cx, p.cy + p.h * ax);
      ctx.lineTo(p.cx, p.cy - p.h * ax);
      ctx.stroke();
      if (ax === 1) {
        ctx.beginPath();
        ctx.moveTo(p.cx + hw - 6, p.cy - 4);
        ctx.lineTo(p.cx + hw, p.cy);
        ctx.lineTo(p.cx + hw - 6, p.cy + 4);
        ctx.moveTo(p.cx - 4, p.cy - p.h + 6);
        ctx.lineTo(p.cx, p.cy - p.h);
        ctx.lineTo(p.cx + 4, p.cy - p.h + 6);
        ctx.stroke();
      }

      // καμπύλη
      const steps = Math.floor(120 * prog);
      ctx.strokeStyle = `rgba(${p.ink}, ${0.36 * fade})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const x = -1 + (2 * i) / 120;
        const px = p.cx + x * hw * 0.92;
        const py = p.cy - p.f(x) * p.h * 0.9;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // η "μύτη του στυλό"
      if (prog < 1 && steps > 0) {
        const x = -1 + (2 * steps) / 120;
        ctx.fillStyle = `rgba(${p.ink}, 0.9)`;
        ctx.beginPath();
        ctx.arc(p.cx + x * hw * 0.92, p.cy - p.f(x) * p.h * 0.9, 3.2, 0, 6.2832);
        ctx.fill();
      }
      return p;
    });
  };
}

const SCENES = { default: createCosmos, classic: createNotebook, matrix: createMatrix };

const Backdrop = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const input = { mx: 0, my: 0, scroll: window.scrollY };
    let draw = null;
    let raf = 0;
    let last = performance.now();
    let W = 0;
    let H = 0;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, theme === 'matrix' ? 1.5 : 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw = SCENES[theme](ctx, W, H);
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

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__aurora" />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Backdrop;
