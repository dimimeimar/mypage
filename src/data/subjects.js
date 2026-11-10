// Κατάλογος μαθημάτων, οργανωμένος ανά γλώσσα.
// Σημείωση: το περιεχόμενο ΔΕΝ είναι 1-προς-1 μετάφραση ανάμεσα σε el/en -
// οι ενότητες "school" διαφέρουν σκόπιμα (ελληνικό λύκειο vs IB/IGCSE/SAT/AP
// για διεθνείς μαθητές), οπότε κρατιούνται ξεχωριστές δομές.
export const subjectsData = {
  el: {
    university: {
      title: 'Πανεπιστημιακά Μαθήματα',
      icon: 'University',
      color: 'bg-purple-500',
      categories: [
        {
          id: 'mathematics',
          name: 'Μαθηματικά',
          color: 'bg-purple-100 text-purple-800',
          subjects: [
            'Ανάλυση',
            'Στατιστική',
            'Γεωμετρία',
            'Άλγεβρα',
            'Γραμμική Άλγεβρα',
            'Γραμμική Άλγεβρα Ι',
            'Γραμμική Άλγεβρα ΙΙ',
            'Διαφορικές Εξισώσεις',
            'Απειροστικός Λογισμός',
            'Πραγματική Ανάλυση',
            'Διακριτά Μαθηματικά',
            'Μιγαδικοί Αριθμοί',
            'Μαθηματική Λογική',
            'Πιθανότητες',
            'Αριθμητικές Μέθοδοι'
          ]
        },
        {
          id: 'physics-engineering',
          name: 'Φυσική & Μηχανική',
          color: 'bg-indigo-100 text-indigo-800',
          subjects: [
            'Φυσική',
            'Θερμοδυναμική'
          ]
        },
        {
          id: 'electronics',
          name: 'Μηχανική & Ηλεκτρονική',
          color: 'bg-yellow-100 text-yellow-800',
          subjects: [
            'Σήματα και Συστήματα',
            'Ηλεκτρικά Κυκλώματα',
            'Ψηφιακά Κυκλώματα',
            'Ηλεκτρονική',
            'Ψηφιακή Σχεδίαση',
            'Ψηφιακή Επεξεργασία Σήματος',
            'Ψηφιακή Επεξεργασία Εικόνας'
          ]
        },
        {
          id: 'computer-science',
          name: 'Πληροφορική',
          color: 'bg-red-100 text-red-800',
          subjects: [
            'Δομές Δεδομένων',
            'Αλγόριθμοι και Δομές Δεδομένων',
            'Λειτουργικά Συστήματα',
            'Τεχνητή Νοημοσύνη',
            'Machine Learning'
          ]
        }
      ]
    },
    programming: {
      title: 'Γλώσσες Προγραμματισμού',
      icon: 'Code',
      color: 'bg-emerald-500',
      categories: [
        {
          id: 'core-languages',
          name: 'Core Programming Languages',
          color: 'bg-emerald-100 text-emerald-800',
          subjects: [
            'C',
            'C++',
            'C#',
            'Java',
            'Python',
            'JavaScript',
            'TypeScript',
            'PHP',
            'Visual Basic',
            'Fortran'
          ]
        },
        {
          id: 'web-development',
          name: 'Web Development',
          color: 'bg-orange-100 text-orange-800',
          subjects: [
            'HTML',
            'CSS',
            'JavaScript',
            'React JS',
            'Node.js',
            'jQuery',
            'AJAX',
            'JSON',
            'Bootstrap',
            'Web Design'
          ]
        },
        {
          id: 'mobile-development',
          name: 'Mobile Development',
          color: 'bg-pink-100 text-pink-800',
          subjects: [
            'Android Development (Kotlin, Java, Android Studio)',
            'Flutter (Dart, Kotlin)',
            'Kotlin',
            'Dart'
          ]
        },
        {
          id: 'database-technologies',
          name: 'Database Technologies',
          color: 'bg-cyan-100 text-cyan-800',
          subjects: [
            'Βάσεις Δεδομένων (Databases)',
            'SQL',
            'MySQL',
            'PostgreSQL',
            'MongoDB',
            'Oracle SQL',
            'PL/SQL'
          ]
        },
        {
          id: 'tools-technologies',
          name: 'Specialized Tools & Technologies',
          color: 'bg-gray-100 text-gray-800',
          subjects: [
            'Arduino',
            'Raspberry Pi',
            'Matlab',
            'Scratch',
            'Unity',
            'Blender',
            'Cloud Computing (Firebase, Azure)',
            'ChatGPT'
          ]
        }
      ]
    },
    school: {
      title: 'Σχολικά Μαθήματα',
      icon: 'GraduationCap',
      color: 'bg-blue-500',
      categories: [
        {
          id: 'computer-tech',
          name: 'Πληροφορική & Τεχνολογία',
          color: 'bg-blue-100 text-blue-800',
          subjects: [
            'Ανάπτυξη Εφαρμογών (ΑΕΠΠ)',
            'Προγραμματισμός (ΕΠΑΛ)',
            'Δίκτυα Υπολογιστών(ΕΠΑΛ)',
            'Προγραμματισμός Υπολογιστών(ΕΠΑΛ)'
          ]
        },
        {
          id: 'sciences',
          name: 'Θετικές Επιστήμες',
          color: 'bg-green-100 text-green-800',
          subjects: [
            'Φυσική Α,Β,Γ λυκείου κατεύθυνσης και γενικής',
            'Μαθηματικά Α,Β,Γ λυκείου κατεύθυνσης και γενικής'
          ]
        },
        {
          id: 'generic school',
          name: 'Γενικά πληροφορική',
          color: 'bg-green-100 text-green-800',
          subjects: [
            'Αλγόριθμοι',
            'Τεχνολογία και πληροφορική',
            'Μαθήματα ρομποτικής',
            'Μαθήματα χρήσης Η/Υ και νέων τεχνολογιών'
          ]
        }
      ]
    },
    office: {
      title: 'Microsoft Office & Applications',
      icon: 'FileText',
      color: 'bg-blue-600',
      categories: [
        {
          id: 'office-suite',
          name: 'Microsoft Office Suite',
          color: 'bg-blue-100 text-blue-800',
          subjects: [
            'Microsoft Word (ECDL, ECDL Advanced)',
            'Microsoft Excel (ECDL, ECDL Advanced)',
            'Microsoft Access (ECDL, ECDL Advanced)',
            'Windows',
            'Βασικές Γνώσεις Η/Υ (ECDL)'
          ]
        }
      ]
    }
  },

  en: {
    university: {
      title: 'University Subjects',
      icon: 'University',
      color: 'bg-purple-500',
      categories: [
        {
          id: 'mathematics',
          name: 'Mathematics',
          color: 'bg-purple-100 text-purple-800',
          subjects: [
            'Calculus I, II, III',
            'Statistics',
            'Geometry',
            'Algebra',
            'Linear Algebra',
            'Differential Equations',
            'Real Analysis',
            'Discrete Mathematics',
            'Complex Analysis',
            'Mathematical Logic',
            'Probability Theory',
            'Numerical Methods'
          ]
        },
        {
          id: 'physics-engineering',
          name: 'Physics & Engineering',
          color: 'bg-indigo-100 text-indigo-800',
          subjects: [
            'General Physics',
            'Thermodynamics and Statistical Mechanics'
          ]
        },
        {
          id: 'electronics',
          name: 'Engineering & Electronics',
          color: 'bg-yellow-100 text-yellow-800',
          subjects: [
            'Signals and Systems',
            'Circuit Analysis',
            'Digital Circuits',
            'Electronics and Semiconductors',
            'Digital Logic Design',
            'Digital Signal Processing',
            'Digital Image Processing'
          ]
        },
        {
          id: 'computer-science',
          name: 'Computer Science',
          color: 'bg-red-100 text-red-800',
          subjects: [
            'Data Structures and Algorithms',
            'Operating Systems',
            'Artificial Intelligence',
            'Machine Learning'
          ]
        }
      ]
    },
    programming: {
      title: 'Programming Languages',
      icon: 'Code',
      color: 'bg-emerald-500',
      categories: [
        {
          id: 'core-languages',
          name: 'Core Programming Languages',
          color: 'bg-emerald-100 text-emerald-800',
          subjects: [
            'C Programming',
            'C++ Programming',
            'C# and .NET Development',
            'Java Programming',
            'Python Programming',
            'JavaScript',
            'TypeScript',
            'PHP Web Development',
            'Visual Basic',
            'Fortran'
          ]
        },
        {
          id: 'web-development',
          name: 'Web Development',
          color: 'bg-orange-100 text-orange-800',
          subjects: [
            'HTML5 & CSS3',
            'Modern JavaScript (ES6+)',
            'React.js Development',
            'Node.js Backend Development',
            'jQuery and AJAX',
            'JSON and APIs',
            'Bootstrap Framework',
            'Responsive Web Design'
          ]
        },
        {
          id: 'mobile-development',
          name: 'Mobile Development',
          color: 'bg-pink-100 text-pink-800',
          subjects: [
            'Android Development (Java/Kotlin)',
            'Flutter Cross-Platform Development',
            'Kotlin Programming',
            'Dart Programming'
          ]
        },
        {
          id: 'database-technologies',
          name: 'Database Technologies',
          color: 'bg-cyan-100 text-cyan-800',
          subjects: [
            'Database Design and Management',
            'SQL Programming',
            'MySQL Administration',
            'PostgreSQL',
            'MongoDB (NoSQL)',
            'Oracle Database',
            'Advanced SQL and PL/SQL'
          ]
        },
        {
          id: 'tools-technologies',
          name: 'Specialized Tools & Technologies',
          color: 'bg-gray-100 text-gray-800',
          subjects: [
            'Arduino Programming',
            'Raspberry Pi Projects',
            'MATLAB Scientific Computing',
            'Scratch Visual Programming',
            'Unity Game Development',
            'Blender 3D Modeling',
            'Cloud Computing (Firebase, Azure)',
            'AI Tools and ChatGPT Integration'
          ]
        }
      ]
    },
    school: {
      title: 'Academic Preparation',
      icon: 'GraduationCap',
      color: 'bg-blue-500',
      categories: [
        {
          id: 'international-curricula',
          name: 'International Curricula',
          color: 'bg-blue-100 text-blue-800',
          subjects: [
            'IB Mathematics (SL/HL)',
            'IB Physics (SL/HL)',
            'IGCSE Mathematics',
            'IGCSE Physics',
            'A-Level Mathematics',
            'A-Level Physics',
            'SAT Math Preparation',
            'AP Calculus AB/BC',
            'AP Physics 1, 2, C'
          ]
        },
        {
          id: 'computer-programming',
          name: 'Programming & Computer Science',
          color: 'bg-green-100 text-green-800',
          subjects: [
            'Introduction to Programming',
            'Computer Science Fundamentals',
            'Algorithm Design and Analysis',
            'Object-Oriented Programming',
            'Web Development Basics',
            'Mobile App Development',
            'Robotics and Arduino Programming'
          ]
        },
        {
          id: 'exam-preparation',
          name: 'Test Preparation',
          color: 'bg-purple-100 text-purple-800',
          subjects: [
            'BMAT Preparation',
            'IMAT Preparation', 
            'UCAT Preparation',
            'GMAT Quantitative Section',
            'University Entrance Exams'
          ]
        }
      ]
    },
    office: {
      title: 'Microsoft Office & Digital Skills',
      icon: 'FileText',
      color: 'bg-blue-600',
      categories: [
        {
          id: 'office-suite',
          name: 'Microsoft Office Suite',
          color: 'bg-blue-100 text-blue-800',
          subjects: [
            'Microsoft Word (Basic to Advanced)',
            'Microsoft Excel (Basic to Advanced)',
            'Microsoft Access Database Management',
            'Microsoft PowerPoint',
            'Windows Operating System',
            'Digital Literacy and Computer Skills'
          ]
        }
      ]
    }
  }
};

// Κείμενο interface της σελίδας Subjects (τίτλοι, φίλτρα, CTA).
export const subjectsPageText = {
  el: {
    hero: {
      title: 'Όλα τα Μαθήματα',
      subtitle: 'Από αρχάριο έως προχωρημένο - Πληροφορική, Μαθηματικά, Φυσική και Game Development.'
    },
    allLabel: 'Ολα',
    unitLabel: 'θέματα',
    cta: {
      title: 'Σε ενδιαφέρει κάποιο μάθημα;',
      subtitle: 'Στείλε μου μήνυμα και κανονίζουμε ένα δωρεάν πρώτο μάθημα.',
      button: 'Επικοινωνια'
    }
  },
  en: {
    hero: {
      title: 'All Subjects',
      subtitle: 'From beginner to advanced - Computer Science, Mathematics, Physics, and Game Development.'
    },
    allLabel: 'All',
    unitLabel: 'subjects',
    cta: {
      title: 'Interested in a subject?',
      subtitle: "Send me a message and we'll arrange a free first session.",
      button: 'Contact Me'
    }
  }
};

// Επιστρέφει τον κατάλογο μαθημάτων για τη ζητούμενη γλώσσα
export const getSubjectsByLanguage = (language = 'el') => {
  return subjectsData[language] || subjectsData.el;
};

// Αναζήτηση μαθημάτων με βάση τη γλώσσα
export const searchSubjectsWithLanguage = (searchTerm, language = 'el') => {
  if (!searchTerm || searchTerm.length < 2) return [];

  const data = getSubjectsByLanguage(language);
  const allSubjects = [];

  Object.entries(data).forEach(([sectionKey, section]) => {
    section.categories.forEach(category => {
      category.subjects.forEach(subject => {
        allSubjects.push({
          subject,
          category: category.name,
          section: section.title,
          categoryId: category.id,
          sectionKey
        });
      });
    });
  });

  const term = searchTerm.toLowerCase();

  return allSubjects.filter(item =>
    item.subject.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term)
  );
};