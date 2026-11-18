// Title / meta description ανά σελίδα, οργανωμένα ανά γλώσσα.
// Χρησιμοποιείται από το <SEO /> component σε κάθε page component.
export const seoData = {
  privacy: {
    path: '/privacy',
    el: {
      title: 'Πολιτική Απορρήτου | Δημήτρης Μεϊμαρίδης',
      description: 'Ποια στοιχεία συλλέγονται από το site, γιατί και πώς μπορείτε να ζητήσετε διόρθωση ή διαγραφή τους.'
    },
    en: {
      title: 'Privacy Policy | Dimitris Meimaridis',
      description: 'What data this site collects, why, and how to ask for it to be corrected or deleted.'
    }
  },
  home: {
    path: '/',
    el: {
      title: 'Ιδιαίτερα Μαθήματα Πληροφορικής, Μαθηματικών, Φυσικής | Θεσσαλονίκη & Online',
      description: 'Έμπειρος ιδιωτικός καθηγητής με 12+ χρόνια εμπειρίας. Μαθήματα Πληροφορικής, Μαθηματικών, Φυσικής και Game Development, δια ζώσης στη Θεσσαλονίκη ή online.'
    },
    en: {
      title: 'Private Tutoring in Computer Science, Math & Physics | Thessaloniki & Online',
      description: 'Expert private tutor with 12+ years of experience. Computer Science, Mathematics, Physics and Game Development lessons, in Thessaloniki or online worldwide.'
    }
  },
  services: {
    path: '/services',
    el: {
      title: 'Υπηρεσίες | Μαθήματα, Σχολές, Συμβουλευτική, Επισκευές',
      description: 'Ιδιαίτερα μαθήματα, υποστήριξη σχολών, συμβουλευτική για ενήλικες και επισκευή υπολογιστών στη Θεσσαλονίκη και online.'
    },
    en: {
      title: 'Services | Tutoring, Schools, Consulting, Repairs',
      description: 'Private tutoring, school support, adult consulting and computer repair services in Thessaloniki and online.'
    }
  },
  subjects: {
    path: '/services/subjects',
    el: {
      title: 'Μαθήματα Πληροφορικής, Μαθηματικών, Φυσικής & Game Development',
      description: 'Ιδιαίτερα μαθήματα σε Πληροφορική, Μαθηματικά, Φυσική και Game Development, από σχολείο μέχρι πανεπιστήμιο και επαγγελματική εξειδίκευση.'
    },
    en: {
      title: 'Computer Science, Math, Physics & Game Development Tutoring',
      description: 'Private lessons in Computer Science, Mathematics, Physics and Game Development, from school level to university and beyond.'
    }
  },
  schools: {
    path: '/services/schools',
    el: {
      title: 'Σχολές - Πανεπιστήμια, Λύκειο, ΕΠΑΛ, Ιδιωτικά Κολλέγια',
      description: 'Υποστήριξη φοιτητών σε ΑΠΘ, ΕΚΠΑ, ΕΜΠ και άλλα δημόσια πανεπιστήμια, Λύκειο, ΕΠΑΛ και ιδιωτικά κολλέγια στη Θεσσαλονίκη.'
    },
    en: {
      title: 'Schools - International Students & Exam Preparation (SAT, ACT, BMAT)',
      description: 'Support for international students preparing for SAT, ACT, BMAT, UCAT, IMAT, IB and A-Levels, online or in Thessaloniki.'
    }
  },
  consulting: {
    path: '/services/consulting',
    el: {
      title: 'Συμβουλευτική & Εκπαίδευση Ενηλίκων | Αλλαγή Καριέρας',
      description: 'Συμβουλευτική υποστήριξη για αλλαγή καριέρας στην πληροφορική, εκπαίδευση προσωπικού επιχειρήσεων και mentorship σε προσωπικά projects.'
    },
    en: {
      title: 'Consulting & Adult Education | Career Change in Tech',
      description: 'Consulting for career changers moving into tech, corporate training for teams, and mentorship for personal projects.'
    }
  },
  repairs: {
    path: '/services/repairs',
    el: {
      title: 'Επισκευή Υπολογιστών & Laptop Θεσσαλονίκη',
      description: 'Επισκευή υπολογιστών και laptop, αφαίρεση ιών, αναβαθμίσεις RAM/SSD, ρύθμιση δικτύου και website hosting στη Θεσσαλονίκη.'
    },
    en: {
      title: 'Computer & Laptop Repair Thessaloniki',
      description: 'Computer and laptop repair, virus removal, RAM/SSD upgrades, network setup and website hosting in Thessaloniki.'
    }
  },
  about: {
    path: '/about',
    el: {
      title: 'Σχετικά Με Εμένα | Δημήτρης Μειμαρίδης',
      description: 'Γνωρίστε τον Δημήτρη Μειμαρίδη, ιδιωτικό καθηγητή Πληροφορικής, Μαθηματικών και Φυσικής με 12+ χρόνια εμπειρίας στη Θεσσαλονίκη.'
    },
    en: {
      title: 'About Me | Dimitris Meimaridis',
      description: 'Meet Dimitris Meimaridis, private tutor in Computer Science, Mathematics and Physics with 12+ years of experience in Thessaloniki.'
    }
  },
  contact: {
    path: '/contact',
    el: {
      title: 'Επικοινωνία',
      description: 'Επικοινωνήστε για ιδιαίτερα μαθήματα, συμβουλευτική ή επισκευή υπολογιστή στη Θεσσαλονίκη και online.'
    },
    en: {
      title: 'Contact',
      description: 'Get in touch for private tutoring, consulting or computer repair in Thessaloniki and online.'
    }
  },
  calendar: {
    path: '/calendar',
    el: {
      title: 'Κράτηση Μαθήματος - Ημερολόγιο',
      description: 'Κλείστε το μάθημά σας online και δείτε διαθέσιμες ώρες σε πραγματικό χρόνο.'
    },
    en: {
      title: 'Book a Lesson - Calendar',
      description: 'Book your lesson online and see real-time availability.'
    }
  },
  work: {
    path: '/work',
    el: {
      title: 'Τα Έργα μου | Ιστοσελίδες και Εφαρμογές - Δημήτρης Μεϊμαρίδης',
      description: 'Ιστοσελίδες, εφαρμογές και παιχνίδια που έχω χτίσει παράλληλα με τη διδασκαλία.'
    },
    en: {
      title: 'My Work | Websites and Applications - Dimitris Meimaridis',
      description: 'Websites, applications and games I have built alongside teaching.'
    }
  },
  exercises: {
    path: '/exercises',
    el: {
      title: 'Διαδραστικές Ασκήσεις Προγραμματισμού | Πίνακας Τιμών, Δυαδικό Σύστημα',
      description: 'Δωρεάν διαδραστικές ασκήσεις: προβλέψτε τι τυπώνει ένα πρόγραμμα και δείτε την εκτέλεση βήμα προς βήμα με πίνακα τιμών. Εξάσκηση στο δυαδικό σύστημα.'
    },
    en: {
      title: 'Interactive Programming Exercises | Trace Tables, Binary Numbers',
      description: 'Free interactive exercises: predict what a program prints and watch it run step by step with a trace table. Binary number practice.'
    }
  },
  play: {
    path: '/play',
    el: {
      title: 'Παιχνίδια Μάθησης | Έρχεται Σύντομα',
      description: 'Μικρά παιχνίδια για αλγοριθμική σκέψη, μαθηματικά και φυσική. Έρχεται σύντομα.'
    },
    en: {
      title: 'Learning Games | Coming Soon',
      description: 'Small games for algorithmic thinking, mathematics and physics. Coming soon.'
    }
  }
};
