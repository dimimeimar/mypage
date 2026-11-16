/* Γραμμικό σχέδιο φόντου για τα hero των εσωτερικών σελίδων.
   Σκέτο SVG που "σχεδιάζεται" μία φορά με CSS (stroke-dashoffset): καθόλου JavaScript
   σε κάθε καρέ, καθόλου βιβλιοθήκες, άρα πρακτικά μηδενικό βάρος.
   Το σχέδιο μένει στα πλάγια ώστε ο τίτλος στο κέντρο να διαβάζεται καθαρά, και τεντώνει
   για να καλύψει όλο το hero (preserveAspectRatio="none", με πάχος γραμμής που δεν αλλάζει).

   Κάθε παραλλαγή επιστρέφει { lines: [σημεία...], dots: [[x, y]...], accent: δείκτης γραμμής }.
   Ο καμβάς είναι 1200 x 400. */

const W = 1200;
const H = 400;

const plot = (fn, x0, x1, cy, amp, steps = 60) =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return [x0 + (x1 - x0) * t, cy - fn(t * 2 - 1) * amp];
  });

const VARIANTS = {
  // Μαθήματα: δύο γραφικές παραστάσεις με άξονες
  plot: () => {
    const axes = (cx, cy, w, h) => [[[cx - w, cy], [cx + w, cy]], [[cx, cy + h], [cx, cy - h]]];
    return {
      lines: [
        ...axes(165, 230, 145, 120),
        plot((x) => Math.sin(x * Math.PI * 1.5), 30, 300, 230, 85),
        ...axes(1035, 230, 145, 120),
        plot((x) => 1.25 * Math.exp(-5 * x * x) - 0.2, 900, 1170, 230, 85),
      ],
      dots: [[165, 230], [1035, 230]],
      accent: [2, 5],
    };
  },
  // Σχολές: σκαλοπάτια που ανεβαίνουν (βαθμίδες εκπαίδευσης)
  steps: () => {
    const stair = (x, y, dx, dy, n) => {
      const pts = [[x, y]];
      for (let i = 0; i < n; i++) { pts.push([x + dx * (i + 1), y - dy * i], [x + dx * (i + 1), y - dy * (i + 1)]); }
      return pts;
    };
    const left = stair(0, 350, 58, 44, 5);
    const right = stair(880, 350, 58, 50, 5);
    return {
      lines: [left, right, [[0, 372], [320, 372]], [[880, 372], [1200, 372]]],
      dots: [left[left.length - 1], right[right.length - 1], [58, 350], [938, 350]],
      accent: [1],
    };
  },
  // Συμβουλευτική: διαδρομές που διακλαδίζονται, μία οδηγεί στον στόχο
  path: () => {
    const curve = (x0, y0, x1, y1) => Array.from({ length: 25 }, (_, i) => {
      const t = i / 24;
      const e = t * t * (3 - 2 * t); // ομαλή καμπύλη S
      return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * e];
    });
    return {
      lines: [
        curve(0, 290, 110, 290), curve(110, 290, 240, 200), curve(110, 290, 240, 350), curve(240, 200, 320, 130),
        curve(1200, 140, 1090, 140), curve(1090, 140, 960, 230), curve(1090, 140, 960, 80), curve(960, 230, 880, 300),
      ],
      dots: [[110, 290], [240, 200], [240, 350], [320, 130], [1090, 140], [960, 230], [960, 80], [880, 300]],
      accent: [1, 3, 5, 7],
    };
  },
  // Επισκευές: αγωγοί πλακέτας με επαφές
  circuit: () => ({
    lines: [
      [[0, 120], [90, 120], [120, 160], [230, 160]],
      [[0, 220], [60, 220], [100, 270], [200, 270], [230, 310], [310, 310]],
      [[50, 400], [50, 340], [160, 340]],
      [[1200, 300], [1110, 300], [1080, 260], [970, 260]],
      [[1200, 190], [1140, 190], [1100, 140], [1000, 140], [970, 100], [890, 100]],
      [[1150, 0], [1150, 70], [1040, 70]],
    ],
    dots: [[230, 160], [310, 310], [160, 340], [970, 260], [890, 100], [1040, 70], [100, 270], [1100, 140]],
    accent: [1, 4],
  }),
  // Υπηρεσίες / γενικό: κόμβοι που συνδέονται
  network: () => {
    const L = [[30, 300], [120, 190], [220, 320], [290, 150], [100, 70]];
    const R = L.map(([x, y]) => [W - x, H - y + 20]);
    const edges = (p) => [[p[0], p[1]], [p[1], p[2]], [p[1], p[3]], [p[1], p[4]], [p[2], p[3]]];
    return { lines: [...edges(L), ...edges(R)], dots: [...L, ...R], accent: [2, 7] };
  },
};

const toPath = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

const HeroArt = ({ variant = 'network' }) => {
  const { lines, dots, accent } = (VARIANTS[variant] || VARIANTS.network)();
  return (
    <svg className="hero-art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      {lines.map((pts, i) => (
        <path
          key={i}
          d={toPath(pts)}
          pathLength="1"
          className={accent.includes(i) ? 'is-accent' : ''}
          style={{ animationDelay: `${0.15 + i * 0.12}s` }}
        />
      ))}
      {dots.map(([x, y], i) => (
        // "τελεία" = γραμμή μηδενικού μήκους με στρογγυλά άκρα: μένει τέλειος κύκλος ακόμα κι όταν το SVG τεντώνει
        <path key={`d${i}`} className="is-dot" d={`M${x} ${y}h0`} style={{ animationDelay: `${0.6 + i * 0.1}s` }} />
      ))}
    </svg>
  );
};

export default HeroArt;
