import { useEffect, useMemo, useRef, useState } from 'react';

/* Ζωντανό "παράθυρο κώδικα": η ίδια αναδρομική συνάρτηση (παραγοντικό) γραμμένη
   στις γλώσσες που διδάσκω. Ο κώδικας πληκτρολογείται μόνος του, με χρωματισμό
   σύνταξης, και στο τέλος εμφανίζεται η έξοδος. Όλα τα snippets τρέχουν κανονικά. */

const SNIPPETS = [
  {
    lang: 'Python',
    file: 'factorial.py',
    code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,
  },
  {
    lang: 'Java',
    file: 'Main.java',
    code: `public class Main {
    static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,
  },
  {
    lang: 'C++',
    file: 'main.cpp',
    code: `#include <iostream>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    std::cout << factorial(5) << std::endl;
}`,
  },
  {
    lang: 'C#',
    file: 'Program.cs',
    code: `using System;

class Program {
    static int Factorial(int n) {
        if (n <= 1) return 1;
        return n * Factorial(n - 1);
    }

    static void Main() {
        Console.WriteLine(Factorial(5));
    }
}`,
  },
  {
    lang: 'JavaScript',
    file: 'factorial.js',
    code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5));`,
  },
];
const OUTPUT = '120';

const TOKEN = /(#include[^\n]*)|("(?:[^"\\\n]|\\.)*")|\b(\d+)\b|\b(def|if|return|public|class|static|int|void|function|using|String|new|else|while|for)\b|([A-Za-z_]\w*)(?=\()/g;

// Σπάει τον κώδικα σε κομμάτια { text, cls } για τον χρωματισμό
function tokenize(code) {
  const out = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) out.push({ text: code.slice(last, m.index), cls: '' });
    const cls = m[1] ? 'tk-c' : m[2] ? 'tk-s' : m[3] ? 'tk-n' : m[4] ? 'tk-k' : 'tk-f';
    out.push({ text: m[0], cls });
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push({ text: code.slice(last), cls: '' });
  return out;
}

const CodeDemo = ({ outputLabel = 'Output' }) => {
  const [active, setActive] = useState(0);
  const [chars, setChars] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  const snippet = SNIPPETS[active];
  const tokens = useMemo(() => tokenize(snippet.code), [snippet]);
  const done = chars >= snippet.code.length;

  // Ξεκινάει να γράφει μόνο όταν το παράθυρο μπει στην οθόνη
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;
    const total = snippet.code.length;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setChars(total);
      return undefined;
    }
    setChars(0);
    let n = 0;
    const step = Math.max(2, Math.round(total / 85));
    const id = setInterval(() => {
      n = Math.min(n + step, total);
      setChars(n);
      if (n >= total) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [active, started, snippet]);

  // Εμφάνιση μόνο των πρώτων `chars` χαρακτήρων, κρατώντας τον χρωματισμό
  let budget = chars;
  const visible = [];
  for (const tk of tokens) {
    if (budget <= 0) break;
    visible.push({ ...tk, text: tk.text.slice(0, budget) });
    budget -= tk.text.length;
  }

  return (
    <div className="code-win" ref={ref}>
      <div className="code-win__bar" role="tablist" aria-label="Programming language">
        <span className="code-win__dots" aria-hidden="true"><i /><i /><i /></span>
        {SNIPPETS.map((s, i) => (
          <button
            key={s.lang}
            role="tab"
            aria-selected={i === active}
            className={`code-win__tab${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            {s.lang}
          </button>
        ))}
      </div>
      <pre className="code-win__body" aria-label={`${snippet.file}: ${snippet.code}`}>
        {visible.map((tk, i) => (tk.cls ? <span key={i} className={tk.cls}>{tk.text}</span> : tk.text))}
        {!done && <span className="code-win__caret" />}
      </pre>
      <div className="code-win__out">
        <span>{outputLabel}:</span>
        {done && <b className="animate-fade-in">{OUTPUT}</b>}
      </div>
    </div>
  );
};

export default CodeDemo;
