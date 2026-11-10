import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout.jsx';
import HomePage from './components/pages/HomePage.jsx';
import { LanguageProvider } from './contexts/LanguageContext';
import { lazy, Suspense, useEffect } from 'react';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

import { ROUTES } from './constants/routes';

// Οι εσωτερικές σελίδες φορτώνονται μόνο όταν τις επισκεφθεί κάποιος (code splitting),
// ώστε η Αρχική να ανοίγει γρήγορα χωρίς το βάρος του ημερολογίου, του χάρτη κλπ.
const ServicesPage = lazy(() => import('./components/pages/ServicesPage.jsx'));
const SubjectsPage = lazy(() => import('./components/pages/SubjectsPage.jsx'));
const SchoolsPage = lazy(() => import('./components/pages/SchoolsPage.jsx'));
const ConsultingPage = lazy(() => import('./components/pages/ConsultingPage.jsx'));
const RepairsPage = lazy(() => import('./components/pages/RepairsPage.jsx'));
const AboutPage = lazy(() => import('./components/pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./components/pages/ContactPage.jsx'));
const CalendarPage = lazy(() => import('./components/pages/CalendarPage.jsx'));

function App() {

  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_title: document.title,
      page_location: window.location.href
    });
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Layout>
            <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <Routes>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
              <Route path={ROUTES.SERVICES_SUBJECTS} element={<SubjectsPage />} />
              <Route path={ROUTES.SERVICES_SCHOOLS} element={<SchoolsPage />} />
              <Route path={ROUTES.SERVICES_CONSULTING} element={<ConsultingPage />} />
              <Route path={ROUTES.SERVICES_REPAIRS} element={<RepairsPage />} />
              {/* Παλιό route - redirect ώστε να μη χαλάσουν παλιά bookmarks/backlinks */}
              <Route path={ROUTES.SUBJECTS} element={<Navigate to={ROUTES.SERVICES_SUBJECTS} replace />} />
              <Route path={ROUTES.ABOUT} element={<AboutPage />} />
              <Route path={ROUTES.CONTACT} element={<ContactPage />} />
              <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
            </Suspense>
          </Layout>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;