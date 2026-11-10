// Όλο το κείμενο της Αρχικής σελίδας, οργανωμένο ανά γλώσσα.
// Χρήση στο component: const d = homeData[language]; π.χ. d.hero.title
import { Users, BookOpen, Award, GraduationCap, Star } from 'lucide-react';

export const homeData = {
  el: {
    hero: {
      eyebrow: 'Ιδιαιτερα Μαθηματα',
      title: 'Πληροφορική, Μαθηματικά & Φυσική',
      subtitle: 'Δια ζώσης στη Θεσσαλονίκη ή online, οπουδήποτε στον κόσμο.',
      ctaPrimary: 'Επικοινωνηστε',
      ctaSecondary: 'Δειτε Μαθηματα',
      name: 'Δημήτρης Μεϊμαρίδης',
      // Λεζάντες του 3D σχήματος στο hero - ένα για κάθε πρόγραμμα (ίδια σειρά με τα programs)
      shapes: ['Δυαδικο δεντρο', 'Κομβος τορου', 'Ατομο', 'Low-poly mesh'],
      dragHint: 'Συρε για περιστροφη'
    },
    search: {
      placeholder: 'Αναζητήστε μάθημα...'
    },
    introVideo: {
      eyebrow: 'Γνωριστε Με',
      title: 'Λίγα Λόγια Από Εμένα',
      subtitle: 'Ένα σύντομο βίντεο για να με γνωρίσετε πριν το πρώτο μας μάθημα.',
      youtubeId: 'iT-iDFw4knY'
    },
    philosophy: {
      eyebrow: 'Φιλοσοφια',
      quote: 'Στόχος δεν είναι να γεμίσεις τους μαθητές με πληροφορίες, αλλά να τους κινήσεις την περιέργεια που τους κάνει να θέλουν να αναζητήσουν.'
    },
    codeDemo: {
      eyebrow: 'Γλωσσες Προγραμματισμου',
      title: 'Μία ιδέα, πέντε γλώσσες',
      body: 'Η αναδρομή είναι η ίδια είτε γράφεις Python είτε C++. Στο μάθημα χτίζουμε πρώτα τη λογική, και μετά η σύνταξη κάθε γλώσσας έρχεται εύκολα.',
      outputLabel: 'Έξοδος',
      cta: 'Ολα τα Μαθηματα'
    },
    programsSection: {
      eyebrow: 'Τι Διδασκω',
      title: 'Μαθήματα για Κάθε Επίπεδο',
      allButton: 'Ολα τα Μαθηματα',
      inquireLabel: 'Επικοινωνια'
    },
    programs: [
      { number: '01', title: 'Πληροφορική', desc: 'Αλγόριθμοι, δομές δεδομένων, OOP, βάσεις δεδομένων - από πανεπιστημιακό επίπεδο έως επαγγελματική ανάπτυξη.', details: 'Ψηφιακά Κυκλώματα, Σήματα & Συστήματα, Ψηφιακή Επεξεργασία Σήματος/Εικόνας, Τεχνητή Νοημοσύνη & Machine Learning, Λειτουργικά Συστήματα, Δίκτυα.', tag: 'Προγραμματισμος' },
      { number: '02', title: 'Μαθηματικά', desc: 'Ανάλυση, γραμμική άλγεβρα, διακριτά μαθηματικά, στατιστική. Πλήρης προετοιμασία για πανεπιστημιακές εξετάσεις.', details: 'Πιθανότητες, Μιγαδικοί Αριθμοί, Διαφορικές Εξισώσεις, Αριθμητικές Μέθοδοι, Μαθηματική Λογική.', tag: 'Πανεπιστημιο' },
      { number: '03', title: 'Φυσική', desc: 'Μηχανική, ηλεκτρομαγνητισμός, οπτική. Δομημένα μαθήματα που συνδυάζουν θεωρία και επίλυση ασκήσεων.', details: 'Θερμοδυναμική, προετοιμασία για Πανελλήνιες και πανεπιστημιακές εξετάσεις φυσικής.', tag: 'Πανεπιστημιο' },
      { number: '04', title: 'Game Development', desc: 'Unity, C# scripting, 2D/3D game mechanics. Από το μηδέν έως ένα ολοκληρωμένο παιχνίδι.', details: 'Blender για 3D μοντελοποίηση, σχεδιασμός game mechanics, ολοκλήρωση πτυχιακών εργασιών σε Unity.', tag: 'Creative Tech' }
    ],
    features: [
      { icon: Users, title: 'Εξατομικευμένη Διδασκαλία', description: 'Κάθε μάθημα προσαρμόζεται στις ανάγκες και το επίπεδο του μαθητή' },
      { icon: BookOpen, title: 'Δωρεάν Υλικό', description: 'Παρέχω δωρεάν σημειώσεις, βιβλία και βοηθήματα' },
      { icon: Award, title: 'Ολοκληρωμένη Υποστήριξη', description: 'Υποστήριξη φοιτητών και βοήθεια σε εργασίες εξαμήνου' }
    ],
    achievementsSection: {
      eyebrow: 'Επιτευγματα & Εξειδικευση',
      title: 'Πάνω από μια Δεκαετία Εμπειρίας στην Εκπαίδευση'
    },
    achievements: [
      { icon: GraduationCap, title: 'Πανελλήνιες Εξετάσεις', description: 'Επιτυχής προετοιμασία μαθητών για εισαγωγή σε ανώτατα εκπαιδευτικά ιδρύματα' },
      { icon: Award, title: 'Διεθνής Εμπειρία', description: 'Εμπειρία με εκπαίδευση μαθητών από διάφορες χώρες του εξωτερικού' },
      { icon: Users, title: 'Φοιτητική Υποστήριξη', description: 'Ολοκληρωμένη βοήθεια σε εργασίες εξαμήνου και προετοιμασία εξετάσεων' },
      { icon: Star, title: 'Υποστήριξη Επαγγελματιών', description: 'Εκπαίδευση ενηλίκων στη χρήση νέων τεχνολογιών' },
      { icon: Star, title: 'Ανάπτυξη Λογισμικού & AI', description: 'Ανάπτυξη λογισμικού Desktop, Android, web, καθώς και εφαρμογών Τεχνητής Νοημοσύνης και Machine Learning' }
    ],
    aboutSection: {
      eyebrow: 'Σχετικα με Μενα',
      title: 'Διδάσκω με Πάθος, Δημιουργώ με Κώδικα.',
      body: 'Πάνω από 12 χρόνια διδακτικής εμπειρίας σε συνδυασμό με ενεργή ανάπτυξη λογισμικού. Βοηθώ φοιτητές πανεπιστημίου, επαγγελματίες που αλλάζουν κατεύθυνση και κάθε άνθρωπο που θέλει να μάθει. Κάθε μάθημα είναι προσαρμοσμένο - χωρίς πρότυπα, χωρίς γενικές σημειώσεις.',
      availability: 'Διαθέσιμος online μέσω Google Meet ή Microsoft Teams. Δίγλωσσα μαθήματα - Ελληνικά & Αγγλικά.',
      cta: 'Η Ιστορια μου',
      quoteOverlay: {
        quote: '"Η αληθινή μάθηση ξεκινάει όταν φτιάχνεις κάτι."',
        name: 'Dimitris Meimaridis',
        role: 'Καθηγητής Πληροφορικής, μαθηματικών & Φυσικής'
      }
    },
    stats: {
      labels: ['Χρονια Εμπειριας', 'Μαθητες', 'Θεματικες Ενοτητες']
    },
    testimonialsSection: {
      eyebrow: 'Κριτικες Μαθητων',
      title: 'Τι Λένε οι Μαθητές'
    },
    testimonials: [
      { name: 'Παύλος Θεογιάννης', subject: 'Πανεπιστημιακό Μάθημα', text: 'Εξαιρετικός καθηγητής και άνθρωπος! Προσιτός και πολύ επεξηγηματικός. Ο τρόπος διδασκαλίας του προσαρμόζεται στις ανάγκες του κάθε μαθητή. Προσωπικά με βοήθησε να γράψω άριστα σε μάθημα πανεπιστημίου. Θα τον συνιστούσα ανεπιφύλακτα!', rating: 5 },
      { name: 'Συμεών Παντελής', subject: 'Γεωπληροφορική - Μεταπτυχιακό', text: 'Ο Δημήτρης είναι πραγματικά από τους ανθρώπους που κάνουν τη διαφορά στη διδασκαλία. Με απλότητα, υπομονή και εξαιρετική μεταδοτικότητα με βοήθησε να μάθω προγραμματισμό ουσιαστικά από το μηδέν και να περάσω το τελευταίο μάθημα Γεωπληροφορική 1 του master μου (Τοπογράφος Μηχανικός ΑΠΘ), μάλιστα με βαθμό 10. Τον συστήνω ανεπιφύλακτα σε όποιον θέλει πραγματική εκπαιδευτική υποστήριξη!!', rating: 5 },
      { name: 'Κωνσταντίνα Τσεκούρα', subject: 'Πτυχιακή - Unity', text: 'Άψογος καθηγητής και πολύ καλός στη δουλειά! Με βοήθησε να ολοκληρώσω τη πτυχιακή μου με θέμα δημιουργία παιχνιδιού στη πλατφόρμα του Unity, ενώ είχε ελάχιστο χρόνο. Σίγουρα πρέπει να τον επιλέξετε!', rating: 5 },
      { name: 'Styliana Filaretou', subject: 'MatLab', text: 'Πολύ καλός δάσκαλος, βοηθάει στην κατανόηση του μαθήματος. Με βοήθησε πολύ σε μία δύσκολη εξέταση. Δίνει κατανοητά παραδείγματα και υλικό για να δουλέψεις. Η επικοινωνία μαζί του είναι άριστη. Μάθημα: MatLab.', rating: 5 },
      { name: 'Αμαλία Ζαράρη', subject: 'ΕΑΠ', text: 'Εξαιρετικός καθηγητής! Με βοήθησε στα μαθήματα του ΕΑΠ.', rating: 5 },
    ],
    ctaBanner: {
      title: 'Έτοιμος να ξεκινήσεις;',
      subtitle: 'Στείλε μήνυμα και κανονίζουμε ένα δωρεάν πρώτο μάθημα.',
      button: 'Επικοινωνια'
    }
  },

  en: {
    hero: {
      eyebrow: 'Private Tutoring · Thessaloniki & Online',
      title: 'Private Tutoring in Computer Science, Mathematics & Physics',
      subtitle: 'In-person in Thessaloniki or online, anywhere in the world. Also offering Game Development lessons.',
      ctaPrimary: 'Get in Touch',
      ctaSecondary: 'View Programs',
      name: 'Dimitris Meimaridis',
      shapes: ['Binary tree', 'Torus knot', 'Atom', 'Low-poly mesh'],
      dragHint: 'Drag to rotate'
    },
    search: {
      placeholder: 'Search for a subject...'
    },
    introVideo: {
      eyebrow: 'Meet Me',
      title: 'A Quick Word From Me',
      subtitle: "A short video to get to know me before our first lesson.",
      youtubeId: 'lV28z1RRVrM'
    },
    philosophy: {
      eyebrow: 'Philosophy',
      quote: '"The goal is not to fill students with information, but to ignite the curiosity that makes them want to seek it themselves."'
    },
    codeDemo: {
      eyebrow: 'Programming Languages',
      title: 'One idea, five languages',
      body: 'Recursion is the same whether you write Python or C++. In our lessons we build the logic first, and after that the syntax of each language comes easily.',
      outputLabel: 'Output',
      cta: 'All Subjects'
    },
    programsSection: {
      eyebrow: 'What I Teach',
      title: 'Lessons For Every Level',
      allButton: 'All Subjects',
      inquireLabel: 'Inquire'
    },
    programs: [
      { number: '01', title: 'Computer Science', desc: 'Algorithms, data structures, OOP, databases, networks - from university level to professional development.', details: 'Digital Circuits, Signals & Systems, Digital Signal/Image Processing, Artificial Intelligence & Machine Learning, Operating Systems.', tag: 'Programming' },
      { number: '02', title: 'Mathematics', desc: 'Calculus, linear algebra, discrete mathematics, statistics. Thorough preparation for university exams.', details: 'Probability Theory, Complex Analysis, Differential Equations, Numerical Methods, Mathematical Logic.', tag: 'University' },
      { number: '03', title: 'Physics', desc: 'Mechanics, electromagnetism, optics. Structured lessons combining theory with problem solving.', details: 'Thermodynamics, exam preparation for IB/A-Level/AP and university physics courses.', tag: 'University' },
      { number: '04', title: 'Game Development', desc: 'Unity, C# scripting, 2D/3D game mechanics. From zero to a complete playable project.', details: 'Blender for 3D modeling, game mechanics design, thesis and capstone project support in Unity.', tag: 'Creative Tech' }
    ],
    featuresSection: {
      eyebrow: 'Why Choose Me',
      title: 'Discover the reasons that make me the ideal teacher for you'
    },
    features: [
      { icon: Users, title: 'Personalized Teaching', description: "Every lesson is adapted to the student's needs and level" },
      { icon: BookOpen, title: 'Free Materials', description: 'I provide free notes, books and learning materials' },
      { icon: Award, title: 'Complete Support', description: 'Student support and assistance with semester projects' }
    ],
    achievementsSection: {
      eyebrow: 'Achievements & Expertise',
      title: 'Over a Decade of Experience in Education'
    },
    achievements: [
      { icon: GraduationCap, title: 'University Entrance Exams', description: 'Successful preparation of students for admission to higher education institutions' },
      { icon: Award, title: 'International Experience', description: 'Experience with educating students from various countries abroad' },
      { icon: Users, title: 'Student Support', description: 'Comprehensive help with semester projects and exam preparation' },
      { icon: Star, title: 'Professional Support', description: 'Adult education in the use of new technologies' },
      { icon: Star, title: 'Software Development & AI', description: 'Development of Desktop, Android, and web software, as well as Artificial Intelligence and Machine Learning applications' }
    ],
    aboutSection: {
      eyebrow: 'About Me',
      title: 'Teaching With Passion, Building With Code.',
      body: 'Over 12 years of teaching experience combined with active software development. I help students at universities, professionals changing careers, and curious minds at any stage of learning. Every session is tailored - no templates, no generic notes.',
      availability: 'Available online via Google Meet or Microsoft Teams',
      cta: 'My Story',
      quoteOverlay: {
        quote: '"Real learning happens when you build something."',
        name: 'Dimitris Meimaridis',
        role: 'CS & Physics Tutor'
      }
    },
    stats: {
      labels: ['Years of Experience', 'Students Taught', 'Subjects Covered']
    },
    testimonialsSection: {
      eyebrow: 'Student Reviews',
      title: 'What Students Say About Us'
    },
    testimonials: [
      { name: 'Παύλος Θεογιάννης', subject: 'University Course', text: 'Excellent teacher and person! Approachable and very clear in his explanations. His teaching style adapts to each student\'s needs. He personally helped me get an excellent grade in a university course. I would recommend him without hesitation!', rating: 5 },
      { name: 'Συμεών Παντελής', subject: 'Geoinformatics - Master\'s Degree', text: "Dimitris is truly one of those people who make a difference in teaching. With simplicity, patience, and excellent communication skills, he helped me learn programming essentially from scratch and pass the final course of my master's, Geoinformatics 1 (Surveying Engineer, AUTH) - with a grade of 10. I recommend him without hesitation to anyone who wants real educational support!!", rating: 5 },
      { name: 'Κωνσταντίνα Τσεκούρα', subject: 'Thesis - Unity', text: "An excellent teacher and very good at what he does! He helped me complete my thesis on creating a game in Unity, even though he had very little time. You should definitely choose him!", rating: 5 },
      { name: 'Styliana Filaretou', subject: 'MatLab', text: 'A very good teacher, he helps you understand the material. He helped me a lot in a difficult exam. He gives clear examples and material to work with. Communication with him is excellent. Subject: MatLab.', rating: 5 },
      { name: 'Αμαλία Ζαράρη', subject: 'Computer Science - Open University', text: 'Excellent teacher! He helped me with my computer science courses at the Hellenic Open University.', rating: 5 },
    ],
    ctaBanner: {
      title: 'Ready to start learning?',
      subtitle: "Send a message and we'll arrange a free first session.",
      button: 'Contact Now'
    }
  }
};