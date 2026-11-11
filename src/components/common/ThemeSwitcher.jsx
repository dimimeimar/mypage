import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';
import { stripTonos } from '../../utils/text';

const THEME_INFO = {
  default: {
    swatch: 'linear-gradient(135deg, #0f0f0f 50%, #2d7a7a 50%)',
    label: { el: 'Κλασικό', en: 'Classic' },
    hint: { el: 'Το βασικό στυλ', en: 'The standard look' },
  },
  notebook: {
    swatch: 'linear-gradient(135deg, #ffffff 50%, #f04e16 50%)',
    label: { el: 'Τετράδιο', en: 'Notebook' },
    hint: { el: 'Φωτεινό, τετραγωνισμένο χαρτί', en: 'Light, squared paper' },
  },
  matrix: {
    swatch: 'repeating-linear-gradient(90deg, #00ff41 0 2px, #000 2px 5px)',
    label: { el: 'Matrix', en: 'Matrix' },
    hint: { el: 'Ψηφιακή βροχή 0/1', en: 'Digital rain of 0s and 1s' },
  },
};

const ThemeSwitcher = () => {
  const { theme, changeTheme, themes } = useTheme();
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const lang = language === 'en' ? 'en' : 'el';

  return (
    <div className="theme-switch no-print">
      <button
        className="theme-switch__btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={lang === 'el' ? 'Αλλαγή θέματος' : 'Change theme'}
        aria-expanded={isOpen}
      >
        <Palette size={18} />
        <span>{stripTonos(THEME_INFO[theme].label[lang])}</span>
      </button>

      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: -1 }} />
          <div className="menu-pop menu-pop--right menu-pop--up" role="menu">
            {themes.map((t) => {
              const info = THEME_INFO[t];
              const active = theme === t;
              return (
                <button
                  key={t}
                  role="menuitemradio"
                  aria-checked={active}
                  className={`menu-pop__item${active ? ' is-active' : ''}`}
                  onClick={(e) => {
                    // η κυκλική μετάβαση ξεκινάει από το σημείο του κλικ
                    changeTheme(t, { x: e.clientX, y: e.clientY });
                    setIsOpen(false);
                  }}
                >
                  <span className="theme-switch__swatch" style={{ background: info.swatch }} />
                  <span className="theme-switch__meta">
                    {info.label[lang]}
                    <small>{info.hint[lang]}</small>
                  </span>
                  {active && <Check size={15} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
