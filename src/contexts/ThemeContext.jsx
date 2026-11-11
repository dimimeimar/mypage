import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';

//   default = Κλασικό (το αρχικό στυλ), notebook = Τετράδιο, matrix = Matrix (fan mode)
export const THEMES = ['default', 'notebook', 'matrix'];
const SCHEMES = { default: 'light', notebook: 'light', matrix: 'dark' };
const STORAGE_KEY = 'site-theme';

const ThemeContext = createContext();

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'default') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  root.setAttribute('data-scheme', SCHEMES[theme]);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'default';
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : 'default';
  });
  // Αυξάνεται κάθε φορά που ο χρήστης ΕΠΙΛΕΓΕΙ το Matrix -> παίζει το boot sequence
  const [matrixBoot, setMatrixBoot] = useState(0);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // origin: { x, y } σε pixels - από εκεί ξεκινάει η κυκλική αποκάλυψη του νέου θέματος
  const changeTheme = useCallback((next, origin) => {
    if (!THEMES.includes(next) || next === theme) return;

    const commit = () => {
      flushSync(() => {
        setTheme(next);
        if (next === 'matrix') setMatrixBoot((n) => n + 1);
      });
      applyTheme(next);
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduced) {
      commit();
      return;
    }

    const x = origin?.x ?? window.innerWidth - 48;
    const y = origin?.y ?? window.innerHeight - 48;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(commit);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      })
      .catch(() => {});
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, scheme: SCHEMES[theme], changeTheme, themes: THEMES, matrixBoot }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
