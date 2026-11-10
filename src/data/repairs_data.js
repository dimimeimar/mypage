// Κείμενο της σελίδας Επισκευές, οργανωμένο ανά γλώσσα.
import { Wrench, ShieldCheck, Layers } from 'lucide-react';

export const repairsData = {
  el: {
    hero: {
      eyebrow: 'Υπηρεσιες · Επισκευες',
      title: 'Επισκευή Υπολογιστών & Laptop',
      subtitle: 'Πολυετής εμπειρία σε τεχνικά προβλήματα hardware και software - δια ζώσης στη Θεσσαλονίκη ή εξ αποστάσεως όπου είναι δυνατόν.'
    },
    intro: 'Πέρα από τη διδασκαλία, ασχολούμαι εδώ και χρόνια με την επισκευή και συντήρηση υπολογιστών και laptop. Από αργές μηχανές μέχρι πιο σύνθετα τεχνικά προβλήματα, αναλαμβάνω τη διάγνωση και την επίλυση με πρακτικό, κατανοητό τρόπο - χωρίς περιττά τεχνικά ή άσκοπες αντικαταστάσεις εξαρτημάτων.',
    sections: [
      {
        key: 'repairs',
        icon: Wrench,
        title: 'Βασικές Επισκευές',
        body: 'Διάγνωση και επίλυση των πιο συνηθισμένων προβλημάτων σε desktop και laptop υπολογιστές, με έμφαση στην κατανόηση του πραγματικού αιτίου πριν από οποιαδήποτε αντικατάσταση εξαρτήματος.',
        tags: ['Αργή Λειτουργία', 'Αφαίρεση Ιών & Malware', 'Επανεγκατάσταση Λειτουργικού', 'Αναβάθμιση RAM / SSD', 'Διάγνωση Hardware']
      },
      {
        key: 'protection',
        icon: ShieldCheck,
        title: 'Ασφάλεια & Συντήρηση',
        body: 'Προληπτικός έλεγχος και ρυθμίσεις που βοηθούν τον υπολογιστή σας να παραμείνει γρήγορος και ασφαλής μακροπρόθεσμα, αντί να περιμένετε να χαλάσει κάτι.',
        tags: ['Backup & Ανάκτηση Δεδομένων', 'Ρυθμίσεις Ασφαλείας', 'Καθαρισμός & Βελτιστοποίηση Συστήματος']
      },
      {
        key: 'other',
        icon: Layers,
        title: 'Τι Άλλο Μπορώ Να Κάνω',
        body: 'Πέρα από τις κλασικές επισκευές, αναλαμβάνω και ένα ευρύτερο φάσμα τεχνικών εργασιών - χρήσιμο τόσο για ιδιώτες όσο και για μικρές επιχειρήσεις που δεν έχουν δικό τους IT τμήμα.',
        tags: ['Ρύθμιση Δικτύου / WiFi', 'Εγκατάσταση & Ρύθμιση Λογισμικού', 'Website & Hosting για Μικρές Επιχειρήσεις', 'Ρύθμιση Email & Cloud', 'Σύνδεση Περιφερειακών (εκτυπωτές κλπ.)']
      }
    ],
    process: {
      title: 'Πώς Δουλεύουμε',
      steps: [
        { title: 'Περιγραφή Προβλήματος', body: 'Μου λέτε τι παρατηρείτε - ακόμα κι αν δεν ξέρετε ακριβώς τι φταίει, αυτό είναι δική μου δουλειά να το βρω.' },
        { title: 'Διάγνωση', body: 'Εντοπίζω το πραγματικό αίτιο πριν προτείνω οποιαδήποτε λύση ή αντικατάσταση.' },
        { title: 'Επίλυση', body: 'Προχωράω στην επισκευή ή ρύθμιση, με σαφή εξήγηση τι έγινε και γιατί.' }
      ]
    },
    openNote: {
      title: 'Δεν είστε σίγουροι τι φταίει;',
      body: 'Δεν χρειάζεται να ξέρετε τεχνικούς όρους για να ζητήσετε βοήθεια - περιγράψτε απλά το πρόβλημα όπως το βλέπετε, και το αναλαμβάνω από εκεί.'
    },
    cta: {
      title: 'Έχετε πρόβλημα με τον υπολογιστή ή το laptop σας;',
      button: 'Επικοινωνια'
    }
  },

  en: {
    hero: {
      eyebrow: 'Services · Repairs',
      title: 'Computer & Laptop Repair',
      subtitle: "Years of experience with hardware and software issues - in-person in Thessaloniki, or remotely where possible."
    },
    intro: "Alongside tutoring, I've spent years repairing and maintaining computers and laptops. From slow machines to more complex technical issues, I handle diagnosis and repair in a practical, clear way - no unnecessary jargon and no unnecessary part replacements.",
    sections: [
      {
        key: 'repairs',
        icon: Wrench,
        title: 'Core Repairs',
        body: "Diagnosis and repair of the most common desktop and laptop issues, with a focus on understanding the actual cause before replacing any component.",
        tags: ['Slow Performance', 'Virus & Malware Removal', 'OS Reinstallation', 'RAM / SSD Upgrades', 'Hardware Diagnostics']
      },
      {
        key: 'protection',
        icon: ShieldCheck,
        title: 'Security & Maintenance',
        body: "Proactive checks and settings that help keep your computer fast and secure long-term, instead of waiting for something to break.",
        tags: ['Backup & Data Recovery', 'Security Settings', 'System Cleanup & Optimization']
      },
      {
        key: 'other',
        icon: Layers,
        title: 'What Else I Can Help With',
        body: "Beyond classic repairs, I also handle a broader range of technical tasks - useful for individuals and small businesses without their own IT support.",
        tags: ['Network / WiFi Setup', 'Software Installation & Setup', 'Website & Hosting for Small Businesses', 'Email & Cloud Setup', 'Peripheral Setup (printers, etc.)']
      }
    ],
    process: {
      title: 'How We Work',
      steps: [
        { title: 'Describe the Issue', body: "Tell me what you're noticing - even if you don't know exactly what's wrong, that's my job to figure out." },
        { title: 'Diagnosis', body: "I identify the actual cause before suggesting any fix or replacement." },
        { title: 'Resolution', body: "I carry out the repair or setup, with a clear explanation of what was done and why." }
      ]
    },
    openNote: {
      title: "Not sure what's wrong?",
      body: "You don't need to know technical terms to ask for help - just describe the problem as you see it, and I'll take it from there."
    },
    cta: {
      title: 'Having trouble with your computer or laptop?',
      button: 'Contact Now'
    }
  }
};