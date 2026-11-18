// Κείμενο της σελίδας Calendar, οργανωμένο ανά γλώσσα.
// Χρήση: const t = calendarData[language] || calendarData.el;

export const calendarData = {
  el: {
    loading: 'Φόρτωση ημερολογίου...',
    hero: {
      title: 'Πρόγραμμα & Κράτηση',
      subtitle: 'Επιλέξτε μια κενή ώρα στο ημερολόγιο για να κλείσετε μάθημα'
    },
    cardHeader: {
      title: 'Επιλέξτε Ημερομηνία & Ώρα',
      timezone: 'Ώρα Ελλάδας (EET)'
    },
    calendarMessages: {
      next: 'Επόμενο',
      previous: 'Προηγούμενο',
      today: 'Σήμερα',
      month: 'Μήνας',
      week: 'Εβδομάδα',
      day: 'Ημέρα',
      agenda: 'Ατζέντα',
      date: 'Ημερομηνία',
      time: 'Ώρα',
      event: 'Μάθημα',
      noEventsInRange: 'Δεν υπάρχουν μαθήματα σε αυτό το διάστημα',
      showMore: (total) => `+${total} ακόμα`
    },
    legend: [
      { key: 'admin', label: 'Κλεισμένο (Εγώ)' },
      { key: 'verified_user', label: 'Κλεισμένο (Μαθητής)' },
      { key: 'pending_request', label: 'Σε Αναμονή' },
      { key: 'available', label: 'Διαθέσιμο' }
    ],
    infoBox: {
      title: 'Πώς λειτουργεί;',
      items: [
        'Κάντε κλικ σε μια κενή θέση για να ξεκινήσετε κράτηση',
        'Κάντε κλικ σε υπάρχον μάθημα για λεπτομέρειες',
        'Οι ακυρώσεις επιτρέπονται μέχρι 24 ώρες πριν'
      ]
    },
    alerts: {
      overlapSelect: 'Αυτή η ώρα είναι ήδη κλεισμένη. Παρακαλώ επιλέξτε άλλη.',
      overlapSubmit: 'Αυτή η ώρα έχει ήδη κλειστεί. Παρακαλώ επιλέξτε άλλη.',
      pastTime: 'Αυτή η ώρα έχει ήδη περάσει. Παρακαλώ επιλέξτε μελλοντική ώρα.',
      genericError: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.'
    },
    sync: {
      loading: 'Φόρτωση προγράμματος...',
      retrying: 'Το πρόγραμμα δεν φόρτωσε πλήρως. Γίνεται νέα προσπάθεια...',
      retryButton: 'Δοκιμή τώρα',
      blocked: 'Το πρόγραμμα φορτώνει ακόμα. Δοκιμάστε ξανά σε λίγα δευτερόλεπτα.'
    },
    bookButton: 'Νέα κράτηση',
    eventLabels: { busy: 'Κλεισμένο', pending: 'Σε αναμονή' },
    emailNotesFallback: 'Καμία',
    booking: {
      dateLocale: 'el-GR',
      title: 'Κλείσιμο Μαθήματος',
      verifiedBadge: 'Επιβεβαιωμένος Μαθητής - Άμεση Κράτηση',
      titleLabel: 'Τίτλος Κράτησης *',
      titlePlaceholder: "π.χ. Γιώργης - Φυσική Β' Λυκείου",
      emailLabel: 'Email *',
      emailHint: 'Το email χρησιμοποιείται για την επιβεβαίωση της κράτησης',
      timeSectionTitle: 'Ώρες Μαθήματος',
      startLabel: 'Έναρξη',
      endLabel: 'Λήξη',
      durationLabel: 'Διάρκεια:',
      hourUnit: 'ώρα',
      hoursUnit: 'ώρες',
      minutesUnit: 'λεπτά',
      notesLabel: 'Σημειώσεις (προαιρετικό)',
      notesPlaceholder: 'Επιπλέον πληροφορίες...',
      cancelButton: 'Ακύρωση',
      submitButton: 'Κλείσιμο Μαθήματος',
      submitPendingButton: 'Αποστολή Αίτησης',
      submittingButton: 'Υποβολή...',
      infoNote: 'Η αίτησή σας θα εξεταστεί και θα λάβετε επιβεβαίωση σύντομα',
      validation: {
        emailRequired: 'Το email είναι υποχρεωτικό',
        emailInvalid: 'Μη έγκυρο email',
        titleRequired: 'Ο τίτλος είναι υποχρεωτικός',
        timeRequired: 'Επιλέξτε ώρες έναρξης και λήξης',
        timeOrder: 'Η ώρα λήξης πρέπει να είναι μετά την έναρξη',
        minDuration: 'Το μάθημα πρέπει να διαρκεί τουλάχιστον 30 λεπτά',
        maxDuration: 'Το μάθημα δεν μπορεί να διαρκεί περισσότερο από 4 ώρες',
        submitError: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.'
      }
    }
  },

  en: {
    loading: 'Loading calendar...',
    hero: {
      title: 'Schedule & Booking',
      subtitle: 'Select an available time slot on the calendar to book a lesson'
    },
    cardHeader: {
      title: 'Select Date & Time',
      timezone: 'Greece Time (EET)'
    },
    calendarMessages: {
      next: 'Next',
      previous: 'Previous',
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      agenda: 'Agenda',
      date: 'Date',
      time: 'Time',
      event: 'Lesson',
      noEventsInRange: 'There are no lessons in this range',
      showMore: (total) => `+${total} more`
    },
    legend: [
      { key: 'admin', label: 'Booked (Me)' },
      { key: 'verified_user', label: 'Booked (Student)' },
      { key: 'pending_request', label: 'Pending' },
      { key: 'available', label: 'Available' }
    ],
    infoBox: {
      title: 'How it works',
      items: [
        'Click an empty slot to start a booking',
        'Click an existing lesson for details',
        'Cancellations are allowed up to 24 hours before'
      ]
    },
    alerts: {
      overlapSelect: 'This time slot is already booked. Please choose another.',
      overlapSubmit: 'This time slot has already been booked. Please choose another.',
      pastTime: 'That time has already passed. Please choose a future time.',
      genericError: 'Something went wrong. Please try again.'
    },
    sync: {
      loading: 'Loading schedule...',
      retrying: 'The schedule did not load fully. Trying again...',
      retryButton: 'Retry now',
      blocked: 'The schedule is still loading. Please try again in a few seconds.'
    },
    bookButton: 'New booking',
    eventLabels: { busy: 'Booked', pending: 'Pending' },
    emailNotesFallback: 'None',
    booking: {
      dateLocale: 'en-US',
      title: 'Book a Lesson',
      verifiedBadge: 'Verified Student - Instant Booking',
      titleLabel: 'Booking Title *',
      titlePlaceholder: 'e.g. George - Physics Grade 11',
      emailLabel: 'Email *',
      emailHint: 'Your email is used to confirm the booking',
      timeSectionTitle: 'Lesson Time',
      startLabel: 'Start',
      endLabel: 'End',
      durationLabel: 'Duration:',
      hourUnit: 'hour',
      hoursUnit: 'hours',
      minutesUnit: 'minutes',
      notesLabel: 'Notes (optional)',
      notesPlaceholder: 'Additional information...',
      cancelButton: 'Cancel',
      submitButton: 'Book Lesson',
      submitPendingButton: 'Send Request',
      submittingButton: 'Submitting...',
      infoNote: "Your request will be reviewed and you'll receive a confirmation shortly",
      validation: {
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email',
        titleRequired: 'Title is required',
        timeRequired: 'Select start and end times',
        timeOrder: 'End time must be after start time',
        minDuration: 'The lesson must last at least 30 minutes',
        maxDuration: 'The lesson cannot last more than 4 hours',
        submitError: 'Something went wrong. Please try again.'
      }
    }
  }
};

// Χρώματα ανά status - ίδια keys με το legend, χρησιμοποιούνται και στο eventStyleGetter
export const STATUS_COLORS = {
  admin: '#1a1a1a',
  verified_user: '#2d7a7a',
  pending_request: '#d4a853',
  available: '#5a8a72'
};