// Πολιτική απορρήτου, ανά γλώσσα. Κάθε ενότητα: { title, body: [παράγραφοι] ή items: [λίστα] }.
// Έλεγχος από τον ιδιοκτήτη πριν τη δημοσίευση: το κείμενο περιγράφει πώς λειτουργεί σήμερα το site.

export const privacyData = {
  el: {
    title: 'Πολιτική Απορρήτου',
    subtitle: 'Ποια στοιχεία συλλέγονται, γιατί και πώς μπορείτε να ζητήσετε διαγραφή τους.',
    updated: 'Τελευταία ενημέρωση: Νοέμβριος 2026',
    sections: [
      {
        title: 'Ποιος είμαι',
        body: ['Υπεύθυνος για τα στοιχεία είναι ο Δημήτρης Μεϊμαρίδης, ιδιωτικός καθηγητής Πληροφορικής, Μαθηματικών και Φυσικής στη Θεσσαλονίκη (meimaridistutor.com).'],
      },
      {
        title: 'Ποια στοιχεία συλλέγονται',
        items: [
          'Φόρμα κράτησης: όνομα ή τίτλος κράτησης, email, σημειώσεις και η ώρα του μαθήματος που ζητάτε.',
          'Φόρμα επικοινωνίας: τα στοιχεία που συμπληρώνετε στο μήνυμά σας.',
          'Σύνδεση με Google (προαιρετική, μόνο για μαθητές με άμεση κράτηση): το email και το όνομα του λογαριασμού σας Google. Ο κωδικός σας δεν φτάνει ποτέ σε εμένα.',
          'Στατιστικά επισκεψιμότητας (Google Analytics μέσω Firebase): ανώνυμα στοιχεία χρήσης της σελίδας.',
        ],
      },
      {
        title: 'Γιατί τα χρησιμοποιώ',
        items: [
          'Για να οργανώσω και να επιβεβαιώσω τα μαθήματα, και να επικοινωνήσω μαζί σας γι' + "' " + 'αυτά.',
          'Για να τηρώ πρόγραμμα και απλά στατιστικά για τη δουλειά μου (π.χ. πόσες ώρες μαθημάτων ανά μήνα).',
          'Για να βελτιώνω το site με βάση τη συνολική επισκεψιμότητα.',
        ],
      },
      {
        title: 'Με ποιες υπηρεσίες επεξεργάζονται',
        items: [
          'Supabase: βάση δεδομένων και σύνδεση χρηστών, όπου αποθηκεύονται οι κρατήσεις.',
          'Google Calendar: τα εγκεκριμένα μαθήματα περνούν στο ημερολόγιό μου.',
          'EmailJS: αποστολή ειδοποίησης προς εμένα όταν υποβάλλεται αίτημα ή μήνυμα.',
          'Google (Firebase Hosting και Analytics, Google Fonts) και YouTube (ενσωματωμένο βίντεο): φιλοξενία, στατιστικά και γραμματοσειρές.',
        ],
        note: 'Δεν πουλάω και δεν μοιράζομαι τα στοιχεία σας με τρίτους για διαφήμιση.',
      },
      {
        title: 'Πόσο καιρό τα κρατώ',
        body: ['Τα στοιχεία των μαθημάτων κρατούνται όσο χρειάζονται για την οργάνωση της συνεργασίας και τα στατιστικά μου. Μπορείτε να ζητήσετε διαγραφή ή διόρθωση οποιαδήποτε στιγμή.'],
      },
      {
        title: 'Τα δικαιώματά σας',
        body: ['Έχετε δικαίωμα πρόσβασης, διόρθωσης, διαγραφής και περιορισμού της επεξεργασίας των στοιχείων σας (GDPR). Για οποιοδήποτε αίτημα επικοινωνήστε μαζί μου στο email παρακάτω. Έχετε επίσης δικαίωμα καταγγελίας στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (dpa.gr).'],
      },
    ],
    contactTitle: 'Επικοινωνία',
    contactLead: 'Για ερωτήσεις ή αιτήματα σχετικά με τα στοιχεία σας:',
  },
  en: {
    title: 'Privacy Policy',
    subtitle: 'What data is collected, why, and how to ask for it to be deleted.',
    updated: 'Last updated: November 2026',
    sections: [
      {
        title: 'Who I am',
        body: ['The data controller is Dimitris Meimaridis, a private tutor in Computer Science, Mathematics and Physics in Thessaloniki, Greece (meimaridistutor.com).'],
      },
      {
        title: 'What data is collected',
        items: [
          'Booking form: your name or booking title, email, notes, and the lesson time you request.',
          'Contact form: whatever you write in your message.',
          'Sign in with Google (optional, only for students with direct booking): the email and name of your Google account. I never receive your password.',
          'Visit statistics (Google Analytics through Firebase): anonymous usage data about the pages.',
        ],
      },
      {
        title: 'Why I use it',
        items: [
          'To organise and confirm lessons, and to contact you about them.',
          'To keep a schedule and simple statistics about my work (for example, lesson hours per month).',
          'To improve the site based on overall traffic.',
        ],
      },
      {
        title: 'Services that process it',
        items: [
          'Supabase: the database and user sign-in, where bookings are stored.',
          'Google Calendar: accepted lessons are added to my calendar.',
          'EmailJS: sends me a notification when a request or message is submitted.',
          'Google (Firebase Hosting and Analytics, Google Fonts) and YouTube (embedded video): hosting, statistics and fonts.',
        ],
        note: 'I do not sell your data or share it with third parties for advertising.',
      },
      {
        title: 'How long I keep it',
        body: ['Lesson records are kept as long as needed to organise our work together and for my statistics. You can ask me to delete or correct them at any time.'],
      },
      {
        title: 'Your rights',
        body: ['You have the right to access, correct, delete and restrict the processing of your data (GDPR). To make a request, email me at the address below. You may also complain to the Hellenic Data Protection Authority (dpa.gr).'],
      },
    ],
    contactTitle: 'Contact',
    contactLead: 'For questions or requests about your data:',
  },
};
