import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout.jsx';
import HomePage from './components/pages/HomePage.jsx';
import ServicesPage from './components/pages/ServicesPage.jsx';
import SubjectsPage from './components/pages/SubjectsPage.jsx';
import SchoolsPage from './components/pages/SchoolsPage.jsx';
import ConsultingPage from './components/pages/ConsultingPage.jsx';
import RepairsPage from './components/pages/RepairsPage.jsx';
import AboutPage from './components/pages/AboutPage.jsx';
import ContactPage from './components/pages/ContactPage.jsx';
import CalendarPage from './components/pages/CalendarPage.jsx';
import { LanguageProvider } from './contexts/LanguageContext';
import { useEffect } from 'react';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

import { ROUTES } from './constants/routes';

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
          </Layout>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;