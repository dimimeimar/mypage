export const strings = {
  el: {
    nav: {
      home: 'Αρχικη',
      services: 'Υπηρεσιες',
      subjects: 'Μαθηματα',
      schools: 'Σχολες',
      consulting: 'Συμβουλευτικη',
      repairs: 'Επισκευες',
      about: 'Σχετικα',
      contact: 'Επικοινωνια',
      schedule: 'Προγραμμα',
      calendar: 'Ημερολογιο',
      more: 'Περισσοτερα',
      work: 'Τα Εργα μου',
      exercises: 'Ασκησεις',
      play: 'Παιχνιδια'
    },
    search: {
      placeholder: 'Αναζητήστε μάθημα...',
      noResults: 'Δεν βρέθηκαν αποτελέσματα'
    },
    common: {
      loading: 'Φόρτωση...'
    }
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      subjects: 'Subjects',
      schools: 'Schools',
      consulting: 'Consulting',
      repairs: 'Repairs',
      about: 'About',
      contact: 'Contact',
      schedule: 'Schedule',
      calendar: 'Calendar',
      more: 'More',
      work: 'My Work',
      exercises: 'Exercises',
      play: 'Play'
    },
    search: {
      placeholder: 'Search for a subject...',
      noResults: 'No results found'
    },
    common: {
      loading: 'Loading...'
    }
  }
};

export const getString = (key, language = 'el') => {
  const keys = key.split('.');
  let result = strings[language];

  for (const k of keys) {
    result = result?.[k];
    if (!result) {
      // Fallback στα Ελληνικά αν λείπει η μετάφραση
      result = strings.el;
      for (const fallbackKey of keys) {
        result = result?.[fallbackKey];
        if (!result) return key;
      }
      break;
    }
  }

  return result || key;
};
