import { lazy, Suspense, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ROUTES } from '../../constants/routes';
import { assistantData } from '../../data/assistant_data';
import '../../styles/assistant.css';

// Το πάνελ (συνομιλία) φορτώνει μόνο όταν το ανοίξει ο επισκέπτης· εδώ μένει μόνο το μικρό κουμπί.
const loadPanel = () => import('./AssistantPanel.jsx');
const AssistantPanel = lazy(loadPanel);

const HIDDEN_ON = [ROUTES.ADMIN, ROUTES.LOGIN];
const enabled = Boolean(import.meta.env.VITE_SUPABASE_URL);

const AssistantLauncher = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const d = assistantData[language === 'en' ? 'en' : 'el'];

  if (!enabled || HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const show = () => { setMounted(true); setOpen(true); };

  return (
    <>
      {!open && (
        <button type="button" className="assistant-launcher" onClick={show} onMouseEnter={loadPanel} onFocus={loadPanel} aria-label={d.open}>
          <Sparkles size={18} aria-hidden="true" />
          <span>{d.open}</span>
        </button>
      )}
      {mounted && (
        <Suspense fallback={null}>
          <AssistantPanel open={open} onClose={() => setOpen(false)} lang={language === 'en' ? 'en' : 'el'} />
        </Suspense>
      )}
    </>
  );
};

export default AssistantLauncher;
