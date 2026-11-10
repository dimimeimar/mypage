// Όλο το κείμενο της σελίδας Contact, οργανωμένο ανά γλώσσα.
// Σημείωση: URLs (mailto/tel/wa.me/viber) χτίζονται στο component χρησιμοποιώντας
// CONTACT_INFO / EXTERNAL_LINKS από τα constants/routes - εδώ μπαίνει μόνο το κείμενο.

export const contactData = {
  el: {
    hero: {
      title: 'Επικοινωνήστε',
      subtitle: 'Έχετε ερώτηση ή θέλετε να κλείσετε ένα πρώτο μάθημα; Συμπληρώστε τη φόρμα ή επικοινωνήστε απευθείας.'
    },
    details: {
      eyebrow: 'Στοιχεια Επικοινωνιας',
      title: 'Ας μιλήσουμε.'
    },
    contactItems: {
      location: 'Τοποθεσια',
      locationValue: 'Θεσσαλονίκη, Ελλάδα',
      email: 'Email',
      phone: 'Τηλεφωνο / WhatsApp',
      teams: 'Microsoft Teams',
      teamsValue: 'Είσοδος μέσω Teams'
    },
    quickInfo: [
      { title: 'Ώρες Διαθεσιμότητας', value: 'Δευτέρα - Κυριακή: 9:00 - 21:00' },
      { title: 'Χρόνος Απάντησης', value: 'Συνήθως εντός 2-4 ωρών' }
    ],
    form: {
      eyebrow: 'Στειλτε Μηνυμα',
      emailSubjectPrefix: 'Μήνυμα Επικοινωνίας:',
      labels: {
        name: 'Ονοματεπωνυμο',
        email: 'Email',
        subject: 'Θεμα',
        message: 'Το Μηνυμα σας',
        submit: 'Αποστολη'
      },
      placeholders: {
        name: 'Ονοματεπώνυμο',
        email: 'email@example.com',
        subject: 'π.χ. Μαθήματα Python',
        message: 'Πείτε μου τι χρειάζεστε...'
      },
      status: {
        success: 'Το μήνυμα στάλθηκε! Θα σας απαντήσω σύντομα.',
        error: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά ή στείλτε email απευθείας.',
        sending: 'Αποστολή...'
      },
      validation: {
        required: 'Απαιτείται',
        emailInvalid: 'Απαιτείται έγκυρο email'
      }
    },
    quickContactSection: {
      eyebrow: 'Αμεση Επικοινωνια',
      title: 'Επικοινωνήστε Άμεσα',
      note: 'Για γρήγορη απάντηση, προτιμήστε WhatsApp ή Viber'
    },
    messagingApps: {
      whatsapp: { title: 'WhatsApp', description: 'Στείλτε άμεσο μήνυμα', action: 'Ανοιγμα WhatsApp', textParam: 'Γεια σας! Θα ήθελα να κλείσω μάθημα.' },
      viber: { title: 'Viber', description: 'Επικοινωνία μέσω Viber', action: 'Ανοιγμα Viber' },
      teams: { title: 'Microsoft Teams', description: 'Video call συνάντηση', action: 'Συμμετοχη στο Teams' }
    },
    faqSection: {
      eyebrow: 'Συχνες Ερωτησεις',
      title: 'Συχνές Ερωτήσεις'
    },
    faq: [
      { question: 'Πόσο κοστίζει ένα μάθημα;', answer: 'Οι τιμές διαφέρουν ανάλογα με το μάθημα και το επίπεδο. Επικοινωνήστε για προσωπική προσφορά.' },
      { question: 'Διδάσκετε online;', answer: 'Ναι, προσφέρω online μαθήματα μέσω video call για μαθητές από όλη την Ελλάδα και το εξωτερικό.' },
      { question: 'Πόσο διαρκεί ένα μάθημα;', answer: 'Συνήθως 1.5-2 ώρες, αλλά μπορεί να προσαρμοστεί στις ανάγκες του μαθητή.' }
    ],
    teachingAreasSection: {
      eyebrow: 'Περιοχη Διδασκαλιας',
      title: 'Περιοχές Διδασκαλίας',
      subtitle: 'Διδάσκω σε όλη τη Θεσσαλονίκη και online',
      infoTitle: 'Πληροφορίες Μετακίνησης'
    },
    teachingAreas: ['Κέντρο', 'Εύοσμος', 'Κορδελιό', 'Σίνδος', 'Σταυρούπολη', 'Καλαμαριά', 'Πανόραμα', 'Πυλαία', 'Αμπελόκηποι', 'Πεύκα', 'Ασβεστοχώρι', 'Πολίχνη', 'Νεάπολη', 'Online παντού'],
    teachingAreasInfo: [
      'Δωρεάν μετακίνηση στο κέντρο της Θεσσαλονίκης',
      'Προσαρμοσμένη τιμή για μακρινές περιοχές',
      'Online μαθήματα με πλήρη υποστήριξη',
      'Ευέλικτο ωράριο 7 ημέρες την εβδομάδα'
    ],
    onlinePresenceSection: {
      eyebrow: 'Βρειτε με Online',
      title: 'Βρείτε με online'
    },
    externalLinks: [
      { name: 'InstaTeacher', desc: 'Πλατφόρμα εύρεσης καθηγητών', key: 'INSTATEACHER' },
      { name: 'TeacherFinder', desc: 'Κατάλογος καθηγητών', key: 'TEACHERFINDER' },
      { name: 'Teacher4U', desc: 'Ιδιαίτερα μαθήματα', key: 'TEACHER4U' },
      { name: 'Superprof', desc: 'Διεθνής πλατφόρμα', key: 'SUPERPROF' },
      { name: 'LinkedIn', desc: 'Επαγγελματικό προφίλ', key: 'LINKEDIN' },
      { name: 'Instagram', desc: 'Social Media', key: 'INSTAGRAM' },
      { name: 'Facebook', desc: 'Social Media', key: 'FACEBOOK' },
      { name: 'GitHub', desc: 'Προγραμματιστικά έργα', key: 'GITHUB' }
    ]
  },

  en: {
    hero: {
      title: 'Get In Touch',
      subtitle: 'Have a question or want to book a first session? Fill in the form or reach out directly.'
    },
    details: {
      eyebrow: 'Contact Details',
      title: "Let's talk."
    },
    contactItems: {
      location: 'Location',
      locationValue: 'Thessaloniki, Greece',
      email: 'Email',
      phone: 'Phone / WhatsApp',
      teams: 'Microsoft Teams',
      teamsValue: 'Join via Teams link'
    },
    quickInfo: [
      { title: 'Availability Hours', value: 'Monday - Sunday: 9:00 - 21:00' },
      { title: 'Response Time', value: 'Usually within 2-4 hours' }
    ],
    form: {
      eyebrow: 'Send a Message',
      emailSubjectPrefix: 'Contact Message:',
      labels: {
        name: 'Full Name',
        email: 'Email Address',
        subject: 'Subject',
        message: 'Your Message',
        submit: 'Send Message'
      },
      placeholders: {
        name: 'Your Name',
        email: 'email@example.com',
        subject: 'e.g. Python tutoring',
        message: 'Tell me what you need...'
      },
      status: {
        success: "Message sent! I'll reply shortly.",
        error: 'Something went wrong. Please try again or email me directly.',
        sending: 'Sending...'
      },
      validation: {
        required: 'Required',
        emailInvalid: 'Valid email required'
      }
    },
    quickContactSection: {
      eyebrow: 'Quick Contact',
      title: 'Contact Me Directly',
      note: 'For a quick response, prefer WhatsApp or Viber'
    },
    messagingApps: {
      whatsapp: { title: 'WhatsApp', description: 'Send an instant message', action: 'Open WhatsApp', textParam: 'Hello! I would like to book a lesson.' },
      viber: { title: 'Viber', description: 'Contact via Viber', action: 'Open Viber' },
      teams: { title: 'Microsoft Teams', description: 'Video call meeting', action: 'Join Teams' }
    },
    faqSection: {
      eyebrow: 'FAQ',
      title: 'Frequently Asked Questions'
    },
    faq: [
      { question: 'How much does a lesson cost?', answer: 'Prices vary depending on the subject and level. Contact me for a personalized quote.' },
      { question: 'Do you teach online?', answer: 'Yes, I offer online lessons via video call for students from all over Greece and abroad.' },
      { question: 'How long does a lesson last?', answer: "Usually 1.5-2 hours, but can be adapted to the student's needs." }
    ],
    teachingAreasSection: {
      eyebrow: 'Teaching Area',
      title: 'Teaching Areas',
      subtitle: 'I teach throughout Thessaloniki and online',
      infoTitle: 'Transportation Information'
    },
    teachingAreas: ['City Center', 'Evosmos', 'Kordelio', 'Sindos', 'Stavroupoli', 'Kalamaria', 'Panorama', 'Pylaia', 'Ampelokipoi', 'Pefka', 'Asvestochori', 'Polichni', 'Neapoli', 'Online everywhere'],
    teachingAreasInfo: [
      'Free transportation in Thessaloniki city center',
      'Adjusted price for distant areas',
      'Online lessons with full support',
      'Flexible schedule 7 days a week'
    ],
    onlinePresenceSection: {
      eyebrow: 'Find Me Online',
      title: 'Find me online'
    },
    externalLinks: [
      { name: 'Superprof', desc: 'International tutoring platform', key: 'SUPERPROF' },
      { name: 'LinkedIn', desc: 'Professional profile', key: 'LINKEDIN' },
      { name: 'Instagram', desc: 'Social Media', key: 'INSTAGRAM' },
      { name: 'Facebook', desc: 'Social Media', key: 'FACEBOOK' },
      { name: 'GitHub', desc: 'Programming projects', key: 'GITHUB' }
    ]
  }
};