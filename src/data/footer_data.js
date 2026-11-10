// Όλο το κείμενο του Footer, οργανωμένο ανά γλώσσα.
// Χρήση στο component: const d = footerData[language]; π.χ. d.tagline

export const footerData = {
  el: {
    tagline: 'Ιδιαίτερα μαθήματα σε Πληροφορική, Μαθηματικά & Φυσική.',
    navTitle: 'Πλοήγηση',
    platformsTitle: 'Βρείτε με',
    contactTitle: 'Επικοινωνία',
    navLinks: [
      { labelKey: 'home', path: '/' },
      { labelKey: 'services', path: '/services' },
      { labelKey: 'about', path: '/about' },
      { labelKey: 'calendar', path: '/calendar' },
      { labelKey: 'contact', path: '/contact' }
    ],
    rightsReserved: 'Με επιφύλαξη παντός δικαιώματος.',
    locationLine: 'Θεσσαλονίκη, Ελλάδα'
  },
  en: {
    tagline: 'Private tutoring in Computer Science, Mathematics & Physics.',
    navTitle: 'Navigation',
    platformsTitle: 'Find Me On',
    contactTitle: 'Contact',
    navLinks: [
      { labelKey: 'home', path: '/' },
      { labelKey: 'services', path: '/services' },
      { labelKey: 'about', path: '/about' },
      { labelKey: 'calendar', path: '/calendar' },
      { labelKey: 'contact', path: '/contact' }
    ],
    rightsReserved: 'All rights reserved.',
    locationLine: 'Thessaloniki, Greece'
  }
};

// Πλατφόρμες εύρεσης καθηγητών - ίδιες και στις δύο γλώσσες (ονόματα brand),
// κρατιούνται εδώ ώστε το component να μην έχει hardcoded array.
export const footerPlatforms = [
  { label: 'Superprof', key: 'SUPERPROF' },
  { label: 'InstaTeacher', key: 'INSTATEACHER' },
  { label: 'TeacherFinder', key: 'TEACHERFINDER' },
  { label: 'Teacher4U', key: 'TEACHER4U' }
];
