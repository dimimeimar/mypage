// Όλο το κείμενο της σελίδας About, οργανωμένο ανά γλώσσα.
// Χρήση στο component: const d = aboutData[language]; π.χ. d.intro.title

export const aboutData = {
  el: {
    hero: {
      title: 'Σχετικά με Μένα'
    },
    intro: {
      eyebrow: 'Λιγα Λογια',
      title: 'Ιδιαίτερα Μαθήματα\nΘεσσαλονίκη & Online',
      body1: 'Είμαι έμπειρος καθηγητής ιδιαίτερων μαθημάτων με πάνω από 12 χρόνια εμπειρίας στη διδασκαλία μαθητών λυκείου, φοιτητών πανεπιστημίων και ιδιωτικών σχολών, καθώς και στην εκπαίδευση επαγγελματιών. Αναλαμβάνω προετοιμασία για Πανελλήνιες εξετάσεις, εξεταστικές περιόδους και εργασίες εξαμήνου, με ιδιαίτερη εξειδίκευση σε Ψηφιακά Κυκλώματα, Σήματα & Συστήματα και Τεχνητή Νοημοσύνη - τομείς με ολοένα αυξανόμενη ζήτηση.',
      body2: 'Στα μαθήματά μου παρέχω δωρεάν σημειώσεις και όλα τα απαραίτητα βιβλία και βοηθήματα, καθώς και ολοκληρωμένη υποστήριξη σε φοιτητές Πληροφορικής. Έχω ιδιαίτερη εμπειρία στις εργασίες και στα μαθήματα πληροφορικής του ΕΑΠ, καθώς από εκεί ξεκίνησα.',
      quote: {
        text: 'Θεωρώ πως όποια αναφορά και αν πάρει κάποιος από άλλους πελάτες δεν θα μπορεί ποτέ να είναι σίγουρος, ο μόνος τρόπος είναι να δοκιμάσει.',
        author: 'Δημήτρης Μεϊμαρίδης'
      }
    },
    stats: {
      labels: ['Χρονια Διδασκαλιας', 'Μαθητες', 'Θεματικες', 'Εξατομικευμενα']
    },
    pillarsSection: {
      title: 'Μια Ιδιαίτερη Μέθοδος Διδασκαλίας',
      body: 'Κάθε έννοια αναλύεται μέχρι να γίνει πλήρως κατανοητή. Δεν προχωράω ποτέ μέχρι να έχεις καταλάβει πραγματικά - και χρησιμοποιώ πραγματικά projects, live coding και επίλυση προβλημάτων για να παραμένει η γνώση.'
    },
    pillars: [
      { n: '01', title: 'Εξατομικευμένο', body: 'Κάθε μάθημα ξεκινά από το δικό σου επίπεδο και κατευθύνεται στους στόχους σου. Δεν χάνεται χρόνος σε ό,τι ήδη ξέρεις.' },
      { n: '02', title: 'Project-Based', body: 'Οι έννοιες εισάγονται μέσα από τη δημιουργία πραγμάτων. Μαθαίνεις έναν αλγόριθμο ταξινόμησης υλοποιώντας τον, όχι απομνημονεύοντάς τον.' },
      { n: '03', title: 'Δίγλωσσο', body: 'Μαθήματα σε Ελληνικά και Αγγλικά. Ιδανικό για διεθνείς φοιτητές ή προετοιμασία για αγγλόφωνες εξετάσεις.' },
      { n: '04', title: 'Ευέλικτο', body: 'Δια ζώσης στη Θεσσαλονίκη ή online μέσω Google Meet και Microsoft Teams. Βραδινά και σαββατοκύριακα διαθέσιμα.' },
      { n: '05', title: 'Υπομονή', body: 'Η κατανόηση χρειάζεται χρόνο και επανάληψη. Δεν προχωράω σε νέα ύλη μέχρι να νιώσεις σιγουριά στην προηγούμενη.' },
      { n: '06', title: 'Συνεχής Εξέλιξη', body: 'Συνεχής ενημέρωση με τις τελευταίες εξελίξεις στην εκπαίδευση και την τεχνολογία, ώστε τα μαθήματα να μένουν πάντα επίκαιρα.' }
    ],
    journeySection: {
      title: 'Η Ακαδημαϊκή & Επαγγελματική μου Πορεία'
    },
    journey: [
      { period: '2008 – 2013', degree: 'Πτυχίο Μηχανικού Πληροφορικής', institution: 'ΤΕΙ Κεντρικής Μακεδονίας (πλέον ΔΙΠΑΕ)', desc: 'Τμήμα Πληροφορικής και Επικοινωνιών.' },
      { period: '2010 – Σήμερα', degree: 'Τεχνική Υποστήριξη', institution: 'Ανεξάρτητη Δραστηριότητα', desc: 'Επίλυση τεχνικών και λογισμικών προβλημάτων.' },
      { period: '2011 – Σήμερα', degree: 'Ιδιαίτερα Μαθήματα', institution: 'Ανεξάρτητη Δραστηριότητα', desc: 'Φοιτητές πληροφορικής εντός και εκτός Ελλάδος, μαθητές λυκείου/γυμνασίου και επαγγελματίες που θέλουν να αλλάξουν κατεύθυνση.' },
      { period: '2013 – 2016', degree: 'Τμήμα Φυσικής', institution: 'Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης', desc: 'Σπούδασα για 3 χρόνια, σταμάτησα στο 3ο έτος ώστε να αφοσιωθώ πλήρως στα ιδιαίτερα μαθήματα.' },
      { period: '2014 – 2015', degree: 'Προγραμματιστής', institution: 'Διαδικτυακές Εφαρμογές', desc: 'Full-stack development, σχεδιασμός βάσεων δεδομένων.' }
    ],
    certifications: {
      title: 'Πιστοποιησεις & Εξειδικευσεις',
      items: [
        'Πιστοποιημένος σε όλες τις γλώσσες προγραμματισμού',
        'Εξειδίκευση σε μαθήματα πληροφορικής ΕΑΠ',
        'Εμπειρία στην εκπαίδευση ενηλίκων-επαγγελματιών στις νέες τεχνολογίες',
        'Εμπειρία στην ανάπτυξη λογισμικού για προσωπικό ή επαγγελματικό σκοπό'
      ]
    },
    cta: {
      title: 'Ας Συνεργαστούμε',
      subtitle: 'Είμαι εδώ να σας βοηθήσω να πετύχετε τους στόχους σας. Επικοινωνήστε μαζί μου για να συζητήσουμε πώς μπορώ να σας υποστηρίξω.',
      button: 'Επικοινωνηστε Μαζι Μου'
    }
  },

  en: {
    hero: {
      title: 'About Me'
    },
    intro: {
      eyebrow: 'A Few Words',
      title: 'Private Tutoring\nThessaloniki & Online',
      body1: 'I am an experienced private tutor with over 12 years of experience teaching high school students, university and private college students, as well as training professionals. I undertake preparation for university entrance exams, examination periods and semester assignments, with particular specialization in Digital Circuits, Signals & Systems, and Artificial Intelligence - fields in increasingly high demand.',
      body2: 'In my lessons I provide free notes and all necessary books and learning materials, along with comprehensive support for Computer Science students. I have special experience with Hellenic Open University (EAP) computer science courses and assignments, as that\'s where I started.',
      quote: {
        text: 'I believe that any reference someone might get from other clients can never make them certain - the only way is to try.',
        author: 'Dimitris Meimaridis'
      }
    },
    stats: {
      labels: ['Years Teaching', 'Students', 'Subjects', 'Tailored Sessions']
    },
    pillarsSection: {
      title: 'A Teaching Practice Like No Other',
      body: 'Every concept is broken down until it becomes completely clear. I never move on until you genuinely understand - and I use real projects, live coding, and problem-solving to make learning stick.'
    },
    pillars: [
      { n: '01', title: 'Personalised', body: 'Each session begins from your level and heads toward your specific goals. No wasted time on material you already know.' },
      { n: '02', title: 'Project-Based', body: 'Concepts are introduced through building real things. You learn a sorting algorithm by implementing it, not memorising it.' },
      { n: '03', title: 'Bilingual', body: 'Sessions available in Greek and English. Ideal for international students or those preparing for English-language exams.' },
      { n: '04', title: 'Flexible', body: 'In-person in Thessaloniki or online via Google Meet and Microsoft Teams. Evening and weekend slots available.' },
      { n: '05', title: 'Patience', body: 'Understanding takes time and repetition. I don\'t move to new material until you feel confident with the previous one.' },
      { n: '06', title: 'Continuous Growth', body: 'Continuous update with the latest developments in education and technology, so lessons always stay current.' }
    ],
    journeySection: {
      title: 'My Academic & Professional Journey'
    },
    journey: [
      { period: '2008 – 2013', degree: 'Computer Engineering Degree', institution: 'Central Macedonia TEI (now DIPAE)', desc: 'Department of Informatics and Communications.' },
      { period: '2010 – Present', degree: 'Technical Support', institution: 'Independent Practice', desc: 'Resolving technical and software problems.' },
      { period: '2011 – Present', degree: 'Private Tutoring', institution: 'Independent Practice', desc: 'Computer science students in and outside Greece, high school/middle school students, and professionals changing careers.' },
      { period: '2013 – 2016', degree: 'Department of Physics', institution: 'Aristotle University of Thessaloniki', desc: 'Studied for 3 years, stopped in the 3rd year to focus fully on private tutoring.' },
      { period: '2014 – 2015', degree: 'Developer', institution: 'Web Applications', desc: 'Full-stack development, database design.' }
    ],
    certifications: {
      title: 'Certifications & Specializations',
      items: [
        'Certified in all major programming languages',
        'Specialization in EAP (Hellenic Open University) computer science courses',
        'Experience training adults and professionals in new technologies',
        'Experience developing software for personal or professional purposes'
      ]
    },
    cta: {
      title: 'Let\'s Work Together',
      subtitle: 'I\'m here to help you achieve your goals. Contact me to discuss how I can support you.',
      button: 'Contact Me'
    }
  }
};