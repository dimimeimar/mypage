import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const THEME_INFO = {
  default: {
    swatch: '#2d7a7a',
    label: { el: 'Κλασικό Σκούρο', en: 'Dark' }
  },
  classic: {
    swatch: '#e8763a',
    label: { el: 'Ζεστό', en: 'Warm' }
  },
  matrix: {
    swatch: '#00ff41',
    label: { el: 'Matrix', en: 'Matrix' }
  }
};

const ThemeSwitcher = () => {
  const { theme, changeTheme, themes } = useTheme();
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 150 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
        style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--color-teal)',
        }}
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: -1 }} />
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 0.75rem)',
              right: 0,
              minWidth: '190px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
              overflow: 'hidden',
            }}
          >
            {themes.map((t) => {
              const info = THEME_INFO[t];
              const active = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => { changeTheme(t); setIsOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    background: active ? 'var(--color-teal-pale)' : 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'var(--color-bg)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span
                    style={{
                      width: '1.1rem',
                      height: '1.1rem',
                      borderRadius: '50%',
                      backgroundColor: info.swatch,
                      flexShrink: 0,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />
                  <span style={{ flex: 1, textAlign: 'left' }}>{info.label[language] || info.label.el}</span>
                  {active && <Check size={15} style={{ color: 'var(--color-teal)' }} />}
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