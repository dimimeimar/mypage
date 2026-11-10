// Κείμενο της σελίδας Συμβουλευτική, οργανωμένο ανά γλώσσα.
import { Compass, Building2, Code2, MonitorSmartphone } from 'lucide-react';

export const consultingData = {
  el: {
    hero: {
      eyebrow: 'Υπηρεσιες · Συμβουλευτικη',
      title: 'Συμβουλευτική & Εκπαίδευση Ενηλίκων',
      subtitle: 'Πρακτική καθοδήγηση για ανθρώπους και επιχειρήσεις που θέλουν να μάθουν, να αλλάξουν κατεύθυνση ή να αναβαθμίσουν τις ψηφιακές τους δεξιότητες.'
    },
    intro: 'Πέρα από τα παραδοσιακά μαθήματα, προσφέρω πιο εξατομικευμένη συμβουλευτική υποστήριξη σε ενήλικες και επιχειρήσεις - με βάση την ίδια φιλοσοφία που ακολουθώ σε όλη τη διδασκαλία μου: η πραγματική μάθηση συμβαίνει όταν φτιάχνεις κάτι, όχι όταν απλά το διαβάζεις.',
    sections: [
      {
        key: 'career-change',
        icon: Compass,
        title: 'Αλλαγή Καριέρας',
        body: 'Για όσους σκέφτονται να στραφούν προς την πληροφορική - από το μηδέν ή έχοντας ήδη κάποια βάση. Φτιάχνουμε μαζί ένα ρεαλιστικό πλάνο μάθησης, βήμα-βήμα, με πραγματικά projects αντί για αποσπασματική θεωρία, και προετοιμασία για τεχνικές συνεντεύξεις όταν φτάσει η ώρα.',
        tags: ['Προγραμματισμός από το μηδέν', 'Web Development', 'Python', 'Δομές Δεδομένων & Αλγόριθμοι', 'Προετοιμασία Τεχνικών Συνεντεύξεων']
      },
      {
        key: 'corporate',
        icon: Building2,
        title: 'Εκπαίδευση Επιχειρήσεων',
        body: 'Σεμινάρια και εργαστήρια, online ή δια ζώσης, προσαρμοσμένα στις πραγματικές ανάγκες της ομάδας σας - είτε θέλετε να εισάγετε το προσωπικό σας στον προγραμματισμό, είτε να αναβαθμίσετε συγκεκριμένες τεχνικές δεξιότητες.',
        tags: ['Εισαγωγή στον Προγραμματισμό', 'Python για Αυτοματοποίηση', 'Web Development Βασικά', 'Εργαλεία Τεχνητής Νοημοσύνης']
      },
      {
        key: 'mentorship',
        icon: Code2,
        title: 'Προσωπικά Projects & Mentorship',
        body: 'Για όσους ήδη δουλεύουν πάνω σε κάτι δικό τους - εφαρμογή, ιστοσελίδα ή παιχνίδι - και θέλουν έναν έμπειρο συνομιλητή για code review, αρχιτεκτονική και τεχνικές αποφάσεις, χωρίς να χρειάζεται να ακολουθήσουν ένα πλήρες πρόγραμμα μαθημάτων.',
        tags: ['Code Review', 'Αρχιτεκτονική Εφαρμογών', 'Unity & Game Development', 'Web Hosting & Firebase']
      },
      {
        key: 'digital-skills',
        icon: MonitorSmartphone,
        title: 'Βασικές Ψηφιακές Δεξιότητες',
        body: 'Για ενήλικες που θέλουν απλά να νιώσουν πιο άνετα με την τεχνολογία στην καθημερινότητα ή τη δουλειά τους - χωρίς στόχο αλλαγή καριέρας, απλά πρακτική γνώση.',
        tags: ['Βασικές Δεξιότητες Η/Υ', 'Ασφάλεια στο Διαδίκτυο', 'Cloud & Email']
      }
    ],
    process: {
      title: 'Πώς Δουλεύουμε',
      steps: [
        { title: 'Αρχική Συζήτηση', body: 'Μια σύντομη, δωρεάν κουβέντα για να καταλάβω τους στόχους και το σημείο εκκίνησής σας.' },
        { title: 'Εξατομικευμένο Πλάνο', body: 'Φτιάχνω ένα πλάνο μάθησης προσαρμοσμένο στο ρυθμό και τους στόχους σας, όχι κάτι έτοιμο.' },
        { title: 'Πρακτική Υλοποίηση', body: 'Μαθήματα ή εργαστήρια με έμφαση σε πραγματικά projects, όχι μόνο θεωρία.' },
        { title: 'Συνεχής Παρακολούθηση', body: 'Τακτικό feedback και προσαρμογή του πλάνου όσο προχωράτε.' }
      ]
    },
    openNote: {
      title: 'Δεν βλέπετε ακριβώς αυτό που ψάχνετε;',
      body: 'Η συμβουλευτική είναι εξ ορισμού εξατομικευμένη - αν έχετε κάτι διαφορετικό στο μυαλό σας, ας το συζητήσουμε.'
    },
    cta: {
      title: 'Ενδιαφέρεστε για συμβουλευτική υποστήριξη;',
      button: 'Επικοινωνια'
    }
  },

  en: {
    hero: {
      eyebrow: 'Services · Consulting',
      title: 'Consulting & Adult Education',
      subtitle: 'Practical guidance for individuals and businesses looking to learn something new, change direction, or upgrade their digital skills.'
    },
    intro: "Beyond traditional tutoring, I offer more tailored consulting support for adults and businesses - built on the same philosophy behind all my teaching: real learning happens when you build something, not just read about it.",
    sections: [
      {
        key: 'career-change',
        icon: Compass,
        title: 'Career Change',
        body: "For anyone considering a move into tech - whether starting from scratch or building on an existing foundation. Together we put together a realistic, step-by-step learning plan built around real projects rather than scattered theory, with technical interview preparation when the time comes.",
        tags: ['Programming from Scratch', 'Web Development', 'Python', 'Data Structures & Algorithms', 'Technical Interview Prep']
      },
      {
        key: 'corporate',
        icon: Building2,
        title: 'Corporate Training',
        body: "Workshops and seminars, online or in-person, tailored to your team's actual needs - whether you want to introduce staff to programming or upgrade specific technical skills.",
        tags: ['Intro to Programming', 'Python for Automation', 'Web Development Basics', 'AI Tools']
      },
      {
        key: 'mentorship',
        icon: Code2,
        title: 'Personal Projects & Mentorship',
        body: "For anyone already working on something of their own - an app, a website, or a game - who wants an experienced sounding board for code review, architecture, and technical decisions, without committing to a full course.",
        tags: ['Code Review', 'Application Architecture', 'Unity & Game Development', 'Web Hosting & Firebase']
      },
      {
        key: 'digital-skills',
        icon: MonitorSmartphone,
        title: 'Everyday Digital Skills',
        body: "For adults who simply want to feel more comfortable with technology in daily life or at work - no career change involved, just practical know-how.",
        tags: ['Basic Computer Skills', 'Online Safety', 'Cloud & Email']
      }
    ],
    process: {
      title: 'How We Work',
      steps: [
        { title: 'Initial Conversation', body: "A short, free chat to understand your goals and where you're starting from." },
        { title: 'Personalized Plan', body: "I put together a learning plan tailored to your pace and goals - never off-the-shelf." },
        { title: 'Hands-On Work', body: "Lessons or workshops focused on real projects, not just theory." },
        { title: 'Ongoing Follow-Up', body: "Regular feedback and adjustments to the plan as you progress." }
      ]
    },
    openNote: {
      title: "Not sure this covers what you need?",
      body: "Consulting is inherently personalized - if you have something different in mind, let's talk about it."
    },
    cta: {
      title: 'Interested in consulting support?',
      button: 'Contact Now'
    }
  }
};