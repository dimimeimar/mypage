import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSelector = ({ dark = false }) => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);
  const textColor = dark ? 'rgba(255,255,255,0.85)' : 'var(--color-text)';

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectLanguage = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={toggleDropdown}
        aria-label="Select language"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 0.6rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: textColor,
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          fontWeight: 500,
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = dark ? '#ffffff' : 'var(--color-teal)')}
        onMouseLeave={e => (e.currentTarget.style.color = textColor)}
      >
        <Globe size={15} />
        <span>{currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}</span>
        <ChevronDown
          size={12}
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
        />
      </button>

      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
          <div
            style={{
              position: 'absolute',
              right: 0,
              marginTop: '0.5rem',
              width: '10rem',
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden',
              zIndex: 20,
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: language === lang.code ? 'var(--color-teal-pale)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: language === lang.code ? 'var(--color-teal)' : 'var(--color-text)',
                }}
                onMouseEnter={e => { if (language !== lang.code) e.currentTarget.style.backgroundColor = 'var(--color-bg)'; }}
                onMouseLeave={e => { if (language !== lang.code) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && <span style={{ marginLeft: 'auto' }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;