// Κείμενο της landing σελίδας Υπηρεσίες, οργανωμένο ανά γλώσσα.
// Χρήση: const d = servicesData[language] || servicesData.el;
import { BookOpen, GraduationCap, Briefcase, Wrench } from 'lucide-react';
import { ROUTES } from '../constants/routes';

export const servicesData = {
  el: {
    hero: {
      eyebrow: 'Οι Υπηρεσιες Μου',
      title: 'Υπηρεσίες',
      subtitle: 'Από ιδιαίτερα μαθήματα μέχρι συμβουλευτική και τεχνική υποστήριξη - όλα σε ένα μέρος.'
    },
    cards: [
      {
        key: 'subjects',
        icon: BookOpen,
        path: ROUTES.SERVICES_SUBJECTS,
        title: 'Μαθήματα',
        description: 'Ιδιαίτερα μαθήματα σε Πληροφορική, Μαθηματικά, Φυσική και Game Development - από σχολείο μέχρι πανεπιστήμιο και επαγγελματική εξειδίκευση.',
        cta: 'Δείτε τα Μαθήματα'
      },
      {
        key: 'schools',
        icon: GraduationCap,
        path: ROUTES.SERVICES_SCHOOLS,
        title: 'Σχολές',
        description: 'Προετοιμασία για Πανελλήνιες εξετάσεις, υποστήριξη φοιτητών σε δημόσια και ιδιωτικά πανεπιστήμια, ΕΠΑΛ και Λύκειο.',
        cta: 'Δείτε τις Σχολές'
      },
      {
        key: 'consulting',
        icon: Briefcase,
        path: ROUTES.SERVICES_CONSULTING,
        title: 'Συμβουλευτική',
        description: 'Συμβουλευτικές υπηρεσίες και εκπαίδευση ενηλίκων σε νέες τεχνολογίες, για επαγγελματίες που θέλουν να αναβαθμίσουν τις δεξιότητές τους.',
        cta: 'Μάθετε Περισσότερα'
      },
      {
        key: 'repairs',
        icon: Wrench,
        path: ROUTES.SERVICES_REPAIRS,
        title: 'Επισκευές',
        description: 'Επισκευή υπολογιστών και laptop, με πολυετή εμπειρία σε hardware, software και αντιμετώπιση τεχνικών προβλημάτων.',
        cta: 'Δείτε τις Επισκευές'
      }
    ],
    ctaBanner: {
      title: 'Δεν ξέρετε από πού να ξεκινήσετε;',
      subtitle: 'Επικοινωνήστε μαζί μου και θα βρούμε μαζί την υπηρεσία που ταιριάζει στις ανάγκες σας.',
      button: 'Επικοινωνια'
    }
  },

  en: {
    hero: {
      eyebrow: 'What I Offer',
      title: 'Services',
      subtitle: 'From private tutoring to consulting and technical support - all in one place.'
    },
    cards: [
      {
        key: 'subjects',
        icon: BookOpen,
        path: ROUTES.SERVICES_SUBJECTS,
        title: 'Lessons',
        description: 'Private tutoring in Computer Science, Mathematics, Physics and Game Development - from school level to university and professional specialization.',
        cta: 'View Lessons'
      },
      {
        key: 'schools',
        icon: GraduationCap,
        path: ROUTES.SERVICES_SCHOOLS,
        title: 'Schools',
        description: 'Preparation for Greek national exams, support for students at public and private universities, vocational (EPAL) and high school level.',
        cta: 'View Schools'
      },
      {
        key: 'consulting',
        icon: Briefcase,
        path: ROUTES.SERVICES_CONSULTING,
        title: 'Consulting',
        description: 'Consulting services and adult education in new technologies, for professionals who want to upgrade their skills.',
        cta: 'Learn More'
      },
      {
        key: 'repairs',
        icon: Wrench,
        path: ROUTES.SERVICES_REPAIRS,
        title: 'Repairs',
        description: 'Computer and laptop repair, with years of experience in hardware, software and technical troubleshooting.',
        cta: 'View Repairs'
      }
    ],
    ctaBanner: {
      title: "Not sure where to start?",
      subtitle: "Get in touch and we'll find the right service for your needs together.",
      button: 'Contact Now'
    }
  }
};
