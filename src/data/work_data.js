// Περιεχόμενο της σελίδας "Τα Έργα μου" (/work).
// Για νέο έργο: πρόσθεσε ένα αντικείμενο στο projects με ΙΔΙΑ δομή σε el και en.
//   status: 'live' | 'wip'      url: προαιρετικό (αν λείπει, η κάρτα δεν έχει σύνδεσμο)
// ΣΗΜΕΙΩΣΗ: οι περιγραφές των mypms.gr και alogdianakisorl.gr είναι σκόπιμα σύντομες -
// συμπλήρωσέ τες με ό,τι θέλεις να φαίνεται δημόσια για κάθε πελάτη.

const projects = [
  {
    key: 'tutor',
    group: 'web',
    status: 'live',
    name: 'meimaridistutor.com',
    url: 'https://meimaridistutor.com',
    tech: ['React', 'Vite', 'Firebase', 'three.js'],
    el: 'Η ιστοσελίδα που βλέπετε. Δίγλωσση, με ημερολόγιο κρατήσεων συγχρονισμένο με το Google Calendar, τρία θέματα εμφάνισης και διαδραστικές ασκήσεις.',
    en: 'The site you are looking at. Bilingual, with a booking calendar synced to Google Calendar, three visual themes and interactive exercises.',
  },
  {
    key: 'mypms',
    group: 'web',
    status: 'live',
    name: 'mypms.gr',
    url: 'https://mypms.gr',
    tech: [],
    el: 'Ιστοσελίδα για πελάτη, σε λειτουργία.',
    en: 'Client website, live.',
  },
  {
    key: 'orl',
    group: 'web',
    status: 'live',
    name: 'alogdianakisorl.gr',
    url: 'https://alogdianakisorl.gr/',
    tech: [],
    el: 'Ιστοσελίδα για τον Ευάγγελο Αλογδιανάκη.',
    en: 'Website for Evangelos Alogdianakis.',
  },
  {
    key: 'stathisart',
    group: 'web',
    status: 'live',
    name: 'stathisart.com',
    url: 'https://stathisart.com/',
    tech: [],
    el: 'Ιστοσελίδα του ζωγράφου Στάθη Κουμιώτη από τη Σκιάθο, με ελαιογραφίες εμπνευσμένες από τα ελληνικά νησιά και τη θάλασσα.',
    en: 'Website of the painter Stathis Koumiotis from Skiathos, with oil paintings inspired by the Greek islands and the sea.',
  },
  {
    key: 'menelaos',
    group: 'other',
    status: 'wip',
    name: 'Menelaos',
    tech: ['Unity', 'C#'],
    el: 'Δικό μου 2D παιχνίδι side-scroller με πρωταγωνιστή έναν Σπαρτιάτη στρατιώτη, τον Μενέλαο.',
    en: 'My own 2D side-scroller game starring a Spartan soldier, Menelaos.',
  },
  {
    key: 'admin',
    group: 'other',
    status: 'live',
    name: 'Booking Admin',
    tech: ['Python', 'CustomTkinter', 'Firebase'],
    el: 'Εφαρμογή desktop με την οποία εγκρίνω ή απορρίπτω τα αιτήματα κράτησης αυτής της ιστοσελίδας και διαχειρίζομαι τους επιβεβαιωμένους μαθητές.',
    en: 'Desktop app I use to approve or reject booking requests from this site and manage verified students.',
  },
];

export const workData = {
  projects,
  el: {
    hero: {
      eyebrow: 'Τα Εργα μου',
      title: 'Πράγματα που έχω χτίσει',
      subtitle: 'Εκτός από τη διδασκαλία, φτιάχνω ιστοσελίδες και εφαρμογές. Ό,τι διδάσκω, το χρησιμοποιώ και στην πράξη.',
    },
    groups: { web: 'Ιστοσελίδες', other: 'Παιχνίδια και εργαλεία' },
    status: { live: 'Σε λειτουργία', wip: 'Σε εξέλιξη' },
    visit: 'Άνοιγμα',
    cta: { title: 'Χρειάζεστε ιστοσελίδα ή εφαρμογή;', button: 'Επικοινωνια' },
  },
  en: {
    hero: {
      eyebrow: 'My Work',
      title: 'Things I have built',
      subtitle: 'Besides teaching, I build websites and applications. What I teach, I also use in practice.',
    },
    groups: { web: 'Websites', other: 'Games and tools' },
    status: { live: 'Live', wip: 'In progress' },
    visit: 'Visit',
    cta: { title: 'Need a website or an app?', button: 'Contact' },
  },
};
