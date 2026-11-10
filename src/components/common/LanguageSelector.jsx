import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

// Το prop "dark" κρατιέται για συμβατότητα - τα χρώματα πλέον έρχονται από το θέμα.
// eslint-disable-next-line no-unused-vars
const LanguageSelector = ({ dark = false }) => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button className="nav__link" onClick={() => setIsOpen(!isOpen)} aria-label="Select language" aria-expanded={isOpen}>
        <Globe size={15} />
        <span>{language.toUpperCase()}</span>
        <ChevronDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
          <div className="menu-pop menu-pop--right" style={{ minWidth: '11rem' }}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`menu-pop__item${language === lang.code ? ' is-active' : ''}`}
                onClick={() => { changeLanguage(lang.code); setIsOpen(false); }}
              >
                <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
                <span style={{ flex: 1 }}>{lang.name}</span>
                {language === lang.code && <Check size={15} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
