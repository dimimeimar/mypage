// Κείμενο της σελίδας Σχολές, οργανωμένο ανά γλώσσα.
// ΣΗΜΑΝΤΙΚΟ: το el και en ΔΕΝ είναι μεταφράσεις το ένα του άλλου - έχουν σκόπιμα
// διαφορετικό περιεχόμενο/εστίαση ανά κοινό (ελληνικό vs διεθνές).
import { GraduationCap, School, Building2, Globe, FileCheck } from 'lucide-react';

export const schoolsData = {
  el: {
    hero: {
      eyebrow: 'Υπηρεσιες · Σχολες',
      title: 'Σχολές',
      subtitle: 'Από Λύκειο και ΕΠΑΛ μέχρι τα μεγαλύτερα δημόσια και ιδιωτικά ιδρύματα της χώρας - αν σπουδάζετε κάπου, πολύ πιθανό να έχω ήδη συνεργαστεί με φοιτητή από εκεί.'
    },
    intro: 'Τα τελευταία 12+ χρόνια έχω διδάξει μαθητές και φοιτητές από όλη την Ελλάδα, δια ζώσης στη Θεσσαλονίκη και online. Παρακάτω θα βρείτε ενδεικτικά ιδρύματα με τα οποία έχω ήδη συνεργαστεί - η λίστα δεν είναι εξαντλητική, οπότε αν δεν βλέπετε τη δική σας σχολή, σχεδόν σίγουρα μπορώ να βοηθήσω και εκεί.',
    sections: [
      {
        key: 'universities',
        icon: GraduationCap,
        title: 'Δημόσια Πανεπιστήμια',
        body: 'Υποστήριξη σε μαθήματα Πληροφορικής, Μαθηματικών και Φυσικής για φοιτητές σε δημόσια πανεπιστήμια σε όλη την Ελλάδα - με έμφαση σε τμήματα Πληροφορικής, Πολυτεχνικές και Θετικές σχολές.',
        tags: [
          'Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης (ΑΠΘ)',
          'Εθνικό & Καποδιστριακό Πανεπιστήμιο Αθηνών (ΕΚΠΑ)',
          'Εθνικό Μετσόβιο Πολυτεχνείο (ΕΜΠ)',
          'Οικονομικό Πανεπιστήμιο Αθηνών (ΟΠΑ)',
          'Πανεπιστήμιο Πειραιώς',
          'Πανεπιστήμιο Μακεδονίας',
          'Πανεπιστήμιο Πατρών',
          'Πανεπιστήμιο Κρήτης',
          'Διεθνές Πανεπιστήμιο Ελλάδος (ΔΙΠΑΕ)',
          'και πολλά ακόμα'
        ]
      },
      {
        key: 'highschool',
        icon: School,
        title: 'Λύκειο & ΕΠΑΛ',
        body: 'Τα πρώτα χρόνια της διδακτικής μου πορείας επικεντρώθηκαν κυρίως σε μαθητές Λυκείου και ΕΠΑΛ - εξακολουθώ να δέχομαι μαθητές σε αυτό το επίπεδο, με στήριξη στο καθημερινό μάθημα, στα Μαθηματικά και τη Φυσική Κατεύθυνσης, καθώς και προετοιμασία για τις Πανελλήνιες εξετάσεις.'
      },
      {
        key: 'private',
        icon: Building2,
        title: 'Ιδιωτικά Κολλέγια',
        body: 'Ιδιαίτερη εμπειρία σε συνεργασία με φοιτητές ιδιωτικών κολλεγίων, όπου η στήριξη σε συγκεκριμένα μαθήματα προγραμματισμού και θετικών επιστημών κάνει σημαντική διαφορά.',
        tags: [
          'Aegean College',
          'New York College',
          'Delta College',
          'Μητροπολιτικό Κολλέγιο',
          'και άλλα'
        ]
      }
    ],
    openNote: {
      title: 'Δεν βλέπετε τη σχολή σας εδώ;',
      body: 'Η λίστα παραπάνω είναι ενδεικτική, όχι εξαντλητική. Έχω συνεργαστεί με μαθητές από δεκάδες σχολές και τμήματα που δεν αναφέρονται εδώ - επικοινωνήστε μαζί μου και σίγουρα θα βρούμε τρόπο να βοηθήσω.'
    },
    cta: {
      title: 'Θέλετε να μάθετε αν μπορώ να βοηθήσω στη δική σας σχολή;',
      button: 'Επικοινωνια'
    }
  },

  en: {
    hero: {
      eyebrow: 'Services · Schools',
      title: 'Schools',
      subtitle: "I've worked with international students preparing for university admissions and standardized exams, both online and in-person in Thessaloniki."
    },
    intro: "Over the past 12+ years I've taught students from the UK, the US and beyond - online, and in-person for those visiting or based in Thessaloniki. Below is an overview of who I typically work with internationally. Don't see your exact exam or situation listed? Get in touch - chances are I can still help.",
    sections: [
      {
        key: 'international',
        icon: Globe,
        title: 'International Students',
        body: "I regularly work with students from the UK and the US - whether you're studying abroad, attending an international school in Greece, or preparing remotely from home. Lessons are available fully online, or in-person if you're visiting or living in Thessaloniki."
      },
      {
        key: 'examprep',
        icon: FileCheck,
        title: 'Exam Preparation',
        body: 'Focused preparation for the standardized tests and admissions exams most relevant to Computer Science, Mathematics and Physics-related degrees.',
        tags: ['SAT', 'ACT', 'BMAT', 'UCAT', 'IMAT', 'IB', 'A-Levels', 'GCSE']
      }
    ],
    openNote: {
      title: "Don't see your exam or program listed?",
      body: "This overview isn't exhaustive. If you're preparing for something not mentioned here, reach out - odds are I can still help."
    },
    cta: {
      title: 'Want to know if I can help with your exam or program?',
      button: 'Contact Now'
    }
  }
};