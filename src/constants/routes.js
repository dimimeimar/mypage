export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  SERVICES_SUBJECTS: '/services/subjects',
  SERVICES_SCHOOLS: '/services/schools',
  SERVICES_CONSULTING: '/services/consulting',
  SERVICES_REPAIRS: '/services/repairs',
  SUBJECTS: '/subjects', // παλιό route - διατηρείται μόνο για redirect (SEO/bookmarks)
  ABOUT: '/about',
  CONTACT: '/contact',
  CALENDAR: '/calendar',
  WORK: '/work',
  EXERCISES: '/exercises',
  PLAY: '/play',
  LOGIN: '/login',
  ADMIN: '/admin',
  PRIVACY: '/privacy',
};

// Navigation items - τα 'children' δημιουργούν αυτόματα dropdown στο Navigation.jsx
export const NAV_ITEMS = [
  { key: 'home', path: ROUTES.HOME, label: 'nav.home' },
  {
    key: 'services',
    path: ROUTES.SERVICES,
    label: 'nav.services',
    children: [
      { key: 'subjects', path: ROUTES.SERVICES_SUBJECTS, label: 'nav.subjects' },
      { key: 'schools', path: ROUTES.SERVICES_SCHOOLS, label: 'nav.schools' },
      { key: 'consulting', path: ROUTES.SERVICES_CONSULTING, label: 'nav.consulting' },
      { key: 'repairs', path: ROUTES.SERVICES_REPAIRS, label: 'nav.repairs' },
    ],
  },
  { key: 'about', path: ROUTES.ABOUT, label: 'nav.about' },
  { key: 'contact', path: ROUTES.CONTACT, label: 'nav.contact' },
  { key: 'calendar', path: ROUTES.CALENDAR, label: 'nav.calendar' },
  {
    // 'path: null' = ομάδα χωρίς δική της σελίδα (μόνο dropdown)
    key: 'more',
    path: null,
    label: 'nav.more',
    children: [
      { key: 'work', path: ROUTES.WORK, label: 'nav.work' },
      { key: 'exercises', path: ROUTES.EXERCISES, label: 'nav.exercises' },
      { key: 'play', path: ROUTES.PLAY, label: 'nav.play' },
    ],
  }
];

// External links
export const EXTERNAL_LINKS = {
  INSTATEACHER: 'https://www.instateacher.gr/teacher/5cf15be1905ae/Meimaridis-Dimitris',
  TEACHERFINDER: 'https://teacherfinder.gr/idiaitera-mathimata/dimitris-meimaridis/',
  TEACHER4U: 'https://www.teacher4u.gr/kathigites-idiaiteron/100/dimitris-meimaridis',
  SUPERPROF: 'https://www.superprof.com/mastering-code-advanced-development-programming-instruction-seasoned-engineer-available-online-for-university-and-professional.html',
  LINKEDIN: 'https://www.linkedin.com/in/meimaridis-dimitris-033b20255/',
  INSTAGRAM: 'https://www.instagram.com/meim_dimi',
  FACEBOOK: 'https://www.facebook.com/petit.agnan',
  GITHUB: 'https://github.com/dimimeimar'
};

export const CONTACT_INFO = {
  EMAIL: 'meimaridis.tutoring@gmail.com',
  PHONE: '+306982812466',
  LOCATION: 'Θεσσαλονίκη',
  WHATSAPP: '+306982812466',
  VIBER: '+306982812466',
  TEAMS: 'https://teams.live.com/l/invite/FEAXwSeDY_NMrhKnQ4'
};

export const STATS = {
  STUDENTS: '500+',
  YEARS: '12+',
  SUBJECTS: '50+'
};
