import { useLanguage } from '../contexts/LanguageContext';
import { getString } from '../data/strings';

export const useTranslation = () => {
  const { language, changeLanguage, isGreek, isEnglish } = useLanguage();

  const t = (key, fallback = '') => {
    return getString(key, language) || fallback;
  };

  return { 
    t, 
    language, 
    changeLanguage, 
    isGreek, 
    isEnglish 
  };
};