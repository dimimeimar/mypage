import { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = ['default', 'classic', 'matrix'];
const STORAGE_KEY = 'site-theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'default';
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : 'default';
  });

  // Εφαρμόζει το data-theme attribute στο <html> - το global.css διαβάζει
  // από εκεί για να αποφασίσει ποιο σύνολο CSS variables θα χρησιμοποιήσει.
  useEffect(() => {
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const changeTheme = (next) => {
    if (THEMES.includes(next)) setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);