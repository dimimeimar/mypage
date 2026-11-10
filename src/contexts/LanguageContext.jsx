import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default to English
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectLanguage = async () => {
      // 1. Check localStorage first (user's previous choice)
      const saved = localStorage.getItem('preferred-language');
      if (saved) {
        setLanguage(saved);
        setIsLoading(false);
        return;
      }

      let detectedLang = 'en'; // Default to English for international users

      try {
        // 2. Try IP-based detection first (most reliable for location)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch('https://ipapi.co/country_code/', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const countryCode = await response.text();

        if (countryCode.trim() === 'GR') {
          detectedLang = 'el';
        }

      } catch (error) {
        console.log('IP detection failed, falling back to browser language');

        // 3. Fallback to browser language only if IP detection fails
        const browserLang = navigator.language || navigator.languages?.[0] || 'en';
        if (browserLang.startsWith('el')) {
          detectedLang = 'el';
        }
        // If not Greek browser, stays 'en'
      }

      setLanguage(detectedLang);
      localStorage.setItem('preferred-language', detectedLang);
      setIsLoading(false);
    };

    detectLanguage();
  }, []);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('preferred-language', newLang);
  };

  const isGreek = language === 'el';
  const isEnglish = language === 'en';

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      isGreek,
      isEnglish
    }}>
      {children}
    </LanguageContext.Provider>
  );
};