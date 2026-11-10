import { useEffect, useRef } from 'react';
import {
  WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute,
  ShaderMaterial, Points, Color, CanvasTexture, AdditiveBlending, NormalBlending, LinearFilter,
} from 'three';

/* ════════════════════════════════════════════════════════════════════
   3D σκηνή του hero: χιλιάδες σωματίδια που μεταμορφώνονται ανάμεσα
   σε τέσσερα σχήματα, ένα για κάθε αντικείμενο που διδάσκω:
     0 Πληροφορική  -> δυαδικό δέντρο (δομή δεδομένων)
     1 Μαθηματικά   -> κόμβος τόρου (2,3)
     2 Φυσική       -> άτομο με τρεις τροχιές
     3 Game Dev     -> low-poly εικοσάεδρο (3D mesh)
   Στο θέμα Matrix τα σωματίδια ζωγραφίζονται ως ψηφία 0 και 1.
   Φορτώνεται lazy (ξεχωριστό chunk) για να μη βαραίνει το πρώτο paint.
   ════════════════════════════════════════════════════════════════════ */

const TAU = Math.PI * 2;
const rnd = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const inSphere = (r) => {
  // ομοιόμορφο σημείο μέσα σε σφαίρα
  const u = Math.random();
  const v = Math.random();
  const th = TAU * u;
  const ph = Math.acos(2 * v - 1);
  const rr = r * Math.cbrt(Math.random());
  return [rr * Math.sin(ph) * Math.cos(th), rr * Math.sin(ph) * Math.sin(th), rr * Math.cos(ph)];
};

function shapeTree(n) {
  const nodes = [];
  const edges = [];
  const grow = (p, depth, spread) => {
    nodes.push({ p, r: 0.035 + depth * 0.014 });
    if (depth === 0) return;
    const alongX = depth % 2 === 1;
    for (const s of [-1, 1]) {
      // κάθε επίπεδο ανοίγει και στους δύο άξονες, εναλλάξ περισσότερο στον X ή στον Z
      const c = [p[0] + s * spread * (alongX ? 1 : 0.35), p[1] - 0.5, p[2] + s * spread * (alongX ? 0.35 : 1)];
      edges.push([p, c]);
      grow(c, depth - 1, spread * 0.58);
    }
  };
  grow([0, 1.0, 0], 4, 0.78);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let x, y, z;
    if (Math.random() < 0.42) {
      const nd = nodes[(Math.random() * nodes.length) | 0];
      const o = inSphere(nd.r);
      [x, y, z] = [nd.p[0] + o[0], nd.p[1] + o[1], nd.p[2] + o[2]];
    } else {
      const [a, b] = edges[(Math.random() * edges.length) | 0];
      const t = Math.random();
      x = a[0] + (b[0] - a[0]) * t + rnd(-0.006, 0.006);
      y = a[1] + (b[1] - a[1]) * t + rnd(-0.006, 0.006);
      z = a[2] + (b[2] - a[2]) * t + rnd(-0.006, 0.006);
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function shapeKnot(n) {
  const S = 0.4;
  const c = (t) => [(2 + Math.cos(3 * t)) * Math.cos(2 * t) * S, (2 + Math.cos(3 * t)) * Math.sin(2 * t) * S, Math.sin(3 * t) * S * 1.25];
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = Math.random() * TAU;
    const p = c(t);
    const q = c(t + 0.01);
    let T = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
    const tl = Math.hypot(...T);
    T = T.map((v) => v / tl);
    // N = T x Z, B = T x N
    let N = [T[1], -T[0], 0];
    const nl = Math.hypot(...N) || 1;
    N = N.map((v) => v / nl);
    const B = [T[1] * N[2] - T[2] * N[1], T[2] * N[0] - T[0] * N[2], T[0] * N[1] - T[1] * N[0]];
    const a = Math.random() * TAU;
    const r = 0.13;
    out.set([
      p[0] + r * (Math.cos(a) * N[0] + Math.sin(a) * B[0]),
      p[1] + r * (Math.cos(a) * N[1] + Math.sin(a) * B[1]),
      p[2] + r * (Math.cos(a) * N[2] + Math.sin(a) * B[2]),
    ], i * 3);
  }
  return out;
}

function shapeAtom(n) {
  const out = new Float32Array(n * 3);
  const R = 1.22;
  const tilts = [0, Math.PI / 3, -Math.PI / 3];
  const electrons = tilts.map(() => Math.random() * TAU);
  for (let i = 0; i < n; i++) {
    const k = Math.random();
    let p;
    if (k < 0.16) {
      p = inSphere(0.2); // πυρήνας
    } else {
      const o = (Math.random() * 3) | 0;
      const onElectron = k > 0.88;
      const a = onElectron ? electrons[o] : Math.random() * TAU;
      const j = onElectron ? inSphere(0.07) : [rnd(-0.012, 0.012), rnd(-0.012, 0.012), rnd(-0.012, 0.012)];
      // κύκλος στο επίπεδο XZ, γερμένος γύρω από τον άξονα Z (0, 60, 120 μοίρες)
      const ex = Math.cos(a) * R + j[0];
      const ey = j[1];
      const ez = Math.sin(a) * R + j[2];
      const ct = Math.cos(tilts[o] + Math.PI / 2);
      const st = Math.sin(tilts[o] + Math.PI / 2);
      p = [ex * ct - ey * st, ex * st + ey * ct, ez];
    }
    out.set(p, i * 3);
  }
  return out;
}

function shapeIcosa(n) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const raw = [];
  for (const a of [-1, 1]) for (const b of [-phi, phi]) raw.push([0, a, b], [a, b, 0], [b, 0, a]);
  const R = 1.2;
  const verts = raw.map((v) => { const l = Math.hypot(...v); return v.map((c) => (c / l) * R); });
  const edges = [];
  const edgeLen = (2 / Math.hypot(1, phi)) * R;
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) {
    if (Math.abs(Math.hypot(verts[i][0] - verts[j][0], verts[i][1] - verts[j][1], verts[i][2] - verts[j][2]) - edgeLen) < 0.01) edges.push([verts[i], verts[j]]);
  }
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const k = Math.random();
    let p;
    if (k < 0.62) {
      const [a, b] = edges[(Math.random() * edges.length) | 0];
      const t = Math.random();
      p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t].map((v) => v + rnd(-0.008, 0.008));
    } else if (k < 0.8) {
      const v = verts[(Math.random() * 12) | 0];
      const o = inSphere(0.06);
      p = [v[0] + o[0], v[1] + o[1], v[2] + o[2]];
    } else {
      // εσωτερικό, μικρότερο εικοσάεδρο (ακμές) - δίνει βάθος
      const [a, b] = edges[(Math.random() * edges.length) | 0];
      const t = Math.random();
      p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t].map((v) => v * 0.42);
    }
    out.set(p, i * 3);
  }
  return out;
}

const SHAPES = [shapeTree, shapeKnot, shapeAtom, shapeIcosa];

const LOOKS = {
  default: { a: '#35e0c8', b: '#ffb454', blending: AdditiveBlending, glyph: 0, size: 15, opacity: 0.85, share: 1 },
  classic: { a: '#2456e6', b: '#f04e16', blending: NormalBlending, glyph: 0, size: 13, opacity: 0.8, share: 1 },
  matrix: { a: '#00ff41', b: '#c8ffd6', blending: AdditiveBlending, glyph: 1, size: 54, opacity: 0.95, share: 0.38 },
};

const VERT = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec4 aRand;
  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vDepth;
  varying float vSeed;
  varying float vGlyph;
  void main() {
    // κάθε σωματίδιο ξεκινάει τη μετάβαση με τη δική του μικρή καθυστέρηση
    float m = clamp(uMix * 1.7 - aRand.x * 0.7, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(aFrom, aTo, m);
    // στη μέση της μεταμόρφωσης "σκάει" προς τα έξω
    float burst = sin(m * 3.14159);
    p += normalize(p + vec3(0.0001)) * burst * (0.15 + aRand.w * 0.55);
    p += 0.014 * vec3(
      sin(uTime * 0.9 + aRand.w * 40.0),
      cos(uTime * 0.7 + aRand.x * 40.0),
      sin(uTime * 0.8 + aRand.y * 40.0)
    );
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRand.y) / -mv.z;
    vDepth = -mv.z;
    vSeed = aRand.w;
    vGlyph = aRand.z;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uGlyph;
  uniform float uOpacity;
  uniform float uTime;
  uniform sampler2D uAtlas;
  varying float vDepth;
  varying float vSeed;
  varying float vGlyph;
  void main() {
    vec2 uv = gl_PointCoord;
    float a;
    if (uGlyph > 0.5) {
      // atlas με δύο ψηφία: "0" αριστερά, "1" δεξιά. Το ψηφίο αλλάζει κάθε τόσο.
      float which = step(0.5, fract(vGlyph + floor(uTime * 1.4 + vSeed * 9.0) * 0.37));
      a = texture2D(uAtlas, vec2((uv.x + which) * 0.5, 1.0 - uv.y)).a;
    } else {
      a = smoothstep(0.5, 0.08, length(uv - 0.5));
    }
    float near = smoothstep(6.2, 3.2, vDepth);
    vec3 col = mix(uColorA, uColorB, smoothstep(0.55, 1.0, vSeed));
    gl_FragColor = vec4(col, a * uOpacity * (0.3 + 0.7 * near));
  }
`;

function makeAtlas() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.font = '700 56px "JetBrains Mono", monospace';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('0', 32, 35);
  g.fillText('1', 96, 35);
  const tex = new CanvasTexture(c);
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

const HeroScene = ({ shape = 0, theme = 'default', onError }) => {
  const canvasRef = useRef(null);
  const api = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    } catch {
      onError?.();
      return undefined;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 900;
    const N = mobile ? 4200 : 9000;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    const scene = new Scene();
    const camera = new PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.z = 5.1;

    const targets = SHAPES.map((f) => f(N));
    const rands = new Float32Array(N * 4);
    for (let i = 0; i < N * 4; i++) rands[i] = Math.random();

    const geo = new BufferGeometry();
    const aFrom = new BufferAttribute(new Float32Array(N * 3), 3);
    const aTo = new BufferAttribute(new Float32Array(N * 3), 3);
    // Πρώτη εμφάνιση: τα σωματίδια ξεκινούν σκορπισμένα και "συναρμολογούνται"
    for (let i = 0; i < N; i++) aFrom.array.set(inSphere(3.2), i * 3);
    aTo.array.set(targets[shape]);
    geo.setAttribute('position', aTo);
    geo.setAttribute('aFrom', aFrom);
    geo.setAttribute('aTo', aTo);
    geo.setAttribute('aRand', new BufferAttribute(rands, 4));

    const atlas = makeAtlas();
    const uniforms = {
      uMix: { value: reduced ? 1 : 0 },
      uTime: { value: 0 },
      uSize: { value: 15 },
      uPixelRatio: { value: dpr },
      uColorA: { value: new Color() },
      uColorB: { value: new Color() },
      uGlyph: { value: 0 },
      uOpacity: { value: 1 },
      uAtlas: { value: atlas },
    };
    const mat = new ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthTest: false, depthWrite: false });
    const points = new Points(geo, mat);
    points.frustumCulled = false;
    scene.add(points);

    let current = shape;
    let mixStart = performance.now();
    let mixDur = 2200;

    const setTheme = (name) => {
      const look = LOOKS[name] || LOOKS.default;
      uniforms.uColorA.value.set(look.a);
      uniforms.uColorB.value.set(look.b);
      uniforms.uGlyph.value = look.glyph;
      uniforms.uSize.value = look.size * (mobile ? 0.8 : 1);
      uniforms.uOpacity.value = look.opacity;
      mat.blending = look.blending;
      mat.needsUpdate = true;
      geo.setDrawRange(0, Math.floor(N * look.share));
      if (reduced) renderOnce();
    };

    const setShape = (index) => {
      if (index === current) return;
      aFrom.array.set(targets[current]);
      aTo.array.set(targets[index]);
      aFrom.needsUpdate = true;
      aTo.needsUpdate = true;
      current = index;
      mixStart = performance.now();
      mixDur = 1700;
      uniforms.uMix.value = reduced ? 1 : 0;
      if (reduced) renderOnce();
    };

    // ── interaction: το σχήμα γέρνει προς το ποντίκι, σύρσιμο = περιστροφή ──
    let rotY = 0.4;
    let rotX = 0.12;
    let velY = 0.0022;
    let tiltX = 0;
    let tiltY = 0;
    let mx = 0;
    let my = 0;
    let drag = null;
    const onPointerMove = (e) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      if (drag) {
        velY = (e.clientX - drag.x) * 0.006;
        rotX = Math.max(-0.9, Math.min(0.9, rotX + (e.clientY - drag.y) * 0.004));
        drag = { x: e.clientX, y: e.clientY };
      }
    };
    const onDown = (e) => { drag = { x: e.clientX, y: e.clientY }; };
    const onUp = () => { drag = null; };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (reduced) renderOnce();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function renderOnce() {
      points.rotation.set(rotX, rotY, 0);
      renderer.render(scene, camera);
    }

    let raf = 0;
    let visible = true;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      uniforms.uTime.value = now / 1000;
      const k = Math.min((now - mixStart) / mixDur, 1);
      uniforms.uMix.value = k;
      // αδράνεια: η ταχύτητα επιστρέφει σιγά σιγά στην ήρεμη περιστροφή
      velY += (0.0022 - velY) * 0.03;
      rotY += velY;
      tiltX += (my * 0.35 - tiltX) * 0.05;
      tiltY += (mx * 0.5 - tiltY) * 0.05;
      points.rotation.set(rotX + tiltX, rotY + tiltY, 0);
      renderer.render(scene, camera);
    };
    const start = () => { if (!raf && !reduced && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    api.current = { setShape, setTheme };
    setTheme(theme);
    resize();
    if (reduced) renderOnce(); else start();
    // Όταν φορτώσει η γραμματοσειρά, ξαναφτιάχνουμε τα ψηφία 0/1 με αυτήν
    document.fonts?.ready.then(() => {
      if (!api.current) return;
      const fresh = makeAtlas();
      uniforms.uAtlas.value.dispose();
      uniforms.uAtlas.value = fresh;
    });

    return () => {
      api.current = null;
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      geo.dispose();
      mat.dispose();
      uniforms.uAtlas.value.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { api.current?.setShape(shape); }, [shape]);
  useEffect(() => { api.current?.setTheme(theme); }, [theme]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
};

export default HeroScene;
