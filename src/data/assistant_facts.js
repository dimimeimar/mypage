// Βασικές πληροφορίες για την Ψηφιακή Γραμματεία (βάση γνώσης RAG).
// Γράφονται με λίγα, καθαρά, επαληθευμένα γεγονότα. Ό,τι δεν υπάρχει εδώ ή στα υπόλοιπα data files,
// το bot δεν το ξέρει και παραπέμπει στην επικοινωνία, γι' αυτό ΜΗΝ προσθέτεις τιμές ή υποσχέσεις που δεν ισχύουν.
// Μετά από αλλαγή: node scripts/build-kb.mjs
import { CONTACT_INFO, STATS } from '../constants/routes';

export const assistantFacts = {
  el: {
    who: [
      'Ο Δημήτρης Μεϊμαρίδης είναι ιδιωτικός καθηγητής Πληροφορικής, Μαθηματικών και Φυσικής στη Θεσσαλονίκη. Διδάσκει και Game Development.',
      `Έχει ${STATS.YEARS} χρόνια εμπειρίας, ${STATS.STUDENTS} μαθητές και πάνω από ${STATS.SUBJECTS} θεματικές ενότητες.`,
      'Τα μαθήματα γίνονται δια ζώσης στη Θεσσαλονίκη ή online με video call, για μαθητές από όλη την Ελλάδα και το εξωτερικό.',
    ],
    contact: [
      `Επικοινωνία με τον Δημήτρη: email ${CONTACT_INFO.EMAIL}, τηλέφωνο, WhatsApp και Viber ${CONTACT_INFO.PHONE}, ή η φόρμα στη σελίδα Επικοινωνία (/contact). Για γρήγορη απάντηση προτείνεται WhatsApp ή Viber.`,
      'Ώρες επικοινωνίας: Δευτέρα έως Κυριακή 9:00 έως 21:00. Η απάντηση έρχεται συνήθως εντός 2 έως 4 ωρών.',
    ],
    pricing: [
      'Οι τιμές δεν δημοσιεύονται στο site. Διαφέρουν ανάλογα με το μάθημα και το επίπεδο, και ο Δημήτρης δίνει προσωπική προσφορά όταν επικοινωνήσετε μαζί του (σελίδα /contact).',
    ],
    booking: [
      'Στη σελίδα Ημερολόγιο (/calendar) φαίνονται οι ώρες που είναι ήδη κλεισμένες. Μια κενή ώρα μπορεί να ζητηθεί με το κουμπί Νέα κράτηση και ο Δημήτρης επιβεβαιώνει το αίτημα.',
      'Η Ψηφιακή Γραμματεία δεν βλέπει το ημερολόγιο και δεν κλείνει μαθήματα. Για διαθεσιμότητα, το ημερολόγιο (/calendar) ή η επικοινωνία με τον Δημήτρη είναι ο σωστός δρόμος.',
      'Μαθητές που έχουν συμφωνήσει με τον Δημήτρη μπορούν να συνδεθούν στο site και να κλείνουν απευθείας μαθήματα.',
    ],
    pages: [
      'Σελίδες του site: Αρχική (/), Υπηρεσίες (/services), Μαθήματα (/services/subjects), Σχολές (/services/schools), Συμβουλευτική (/services/consulting), Επισκευές (/services/repairs), Σχετικά με εμένα (/about), Επικοινωνία (/contact), Ημερολόγιο (/calendar), Έργα (/work), Ασκήσεις (/exercises).',
    ],
    assistant: [
      'Η Ψηφιακή Γραμματεία είναι βοηθός με τεχνητή νοημοσύνη. Απαντά μόνο με βάση τις πληροφορίες του site και μπορεί να κάνει λάθη, οπότε για κάτι σημαντικό είναι καλό να επιβεβαιώνεται με τον Δημήτρη.',
    ],
  },
  en: {
    who: [
      'Dimitris Meimaridis is a private tutor in Computer Science, Mathematics and Physics in Thessaloniki, Greece. He also teaches Game Development.',
      `He has ${STATS.YEARS} years of experience, ${STATS.STUDENTS} students and more than ${STATS.SUBJECTS} subject areas.`,
      'Lessons take place in person in Thessaloniki or online by video call, for students from all over Greece and abroad.',
    ],
    contact: [
      `Contact Dimitris: email ${CONTACT_INFO.EMAIL}, phone, WhatsApp and Viber ${CONTACT_INFO.PHONE}, or the form on the Contact page (/contact). For a quick answer, WhatsApp or Viber is recommended.`,
      'Contact hours: Monday to Sunday, 9:00 to 21:00 (Greece time). A reply usually comes within 2 to 4 hours.',
    ],
    pricing: [
      'Prices are not published on the site. They depend on the subject and level, and Dimitris gives a personal quote when you contact him (page /contact).',
    ],
    booking: [
      'The Calendar page (/calendar) shows the times that are already taken. An empty slot can be requested with the New booking button, and Dimitris confirms the request.',
      'The Digital Assistant cannot see the calendar and does not book lessons. For availability, the calendar (/calendar) or contacting Dimitris is the right way.',
      'Students who have agreed with Dimitris can sign in to the site and book lessons directly.',
    ],
    pages: [
      'Site pages: Home (/), Services (/services), Lessons (/services/subjects), Schools (/services/schools), Consulting (/services/consulting), Repairs (/services/repairs), About (/about), Contact (/contact), Calendar (/calendar), Work (/work), Exercises (/exercises).',
    ],
    assistant: [
      'The Digital Assistant is an AI helper. It answers only from the information on this site and can make mistakes, so anything important is worth confirming with Dimitris.',
    ],
  },
};
