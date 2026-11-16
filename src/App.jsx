import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout.jsx';
import HomePage from './components/pages/HomePage.jsx';
import { LanguageProvider } from './contexts/LanguageContext';
import { lazy, Suspense, useEffect } from 'react';

import { ROUTES } from './constants/routes';

// Οι εσωτερικές σελίδες φορτώνονται σε ξεχωριστά αρχεία (code splitting), ώστε η Αρχική
// να ανοίγει γρήγορα χωρίς το βάρος του ημερολογίου, του χάρτη κλπ.
const PAGES = {
  services: () => import('./components/pages/ServicesPage.jsx'),
  subjects: () => import('./components/pages/SubjectsPage.jsx'),
  schools: () => import('./components/pages/SchoolsPage.jsx'),
  consulting: () => import('./components/pages/ConsultingPage.jsx'),
  repairs: () => import('./components/pages/RepairsPage.jsx'),
  about: () => import('./components/pages/AboutPage.jsx'),
  contact: () => import('./components/pages/ContactPage.jsx'),
  calendar: () => import('./components/pages/CalendarPage.jsx'),
  work: () => import('./components/pages/WorkPage.jsx'),
  exercises: () => import('./components/pages/ExercisesPage.jsx'),
  play: () => import('./components/pages/PlayPage.jsx'),
};
const ServicesPage = lazy(PAGES.services);
const SubjectsPage = lazy(PAGES.subjects);
const SchoolsPage = lazy(PAGES.schools);
const ConsultingPage = lazy(PAGES.consulting);
const RepairsPage = lazy(PAGES.repairs);
const AboutPage = lazy(PAGES.about);
const ContactPage = lazy(PAGES.contact);
const CalendarPage = lazy(PAGES.calendar);
const WorkPage = lazy(PAGES.work);
const ExercisesPage = lazy(PAGES.exercises);
const PlayPage = lazy(PAGES.play);

function App() {

  // Τα analytics φορτώνουν μετά την εμφάνιση της σελίδας, ώστε να μην καθυστερούν το πρώτο άνοιγμα
  useEffect(() => {
    Promise.all([import('./firebase'), import('firebase/analytics')])
      .then(([{ analytics }, { logEvent }]) => {
        logEvent(analytics, 'page_view', {
          page_title: document.title,
          page_location: window.location.href
        });
      })
      .catch(() => {});
  }, []);

  // Λίγο μετά το πρώτο φόρτωμα κατεβάζουμε στο παρασκήνιο και τις υπόλοιπες σελίδες,
  // ώστε η αλλαγή σελίδας να είναι άμεση (χωρίς κενή οθόνη ενδιάμεσα).
  useEffect(() => {
    if (navigator.connection?.saveData) return undefined;
    const id = setTimeout(() => Object.values(PAGES).forEach((load) => load().catch(() => {})), 2500);
    return () => clearTimeout(id);
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
              <Route path={ROUTES.WORK} element={<WorkPage />} />
              <Route path={ROUTES.EXERCISES} element={<ExercisesPage />} />
              <Route path={ROUTES.PLAY} element={<PlayPage />} />
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