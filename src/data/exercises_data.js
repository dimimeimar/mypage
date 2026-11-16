// Διαδραστικές ασκήσεις (/exercises).
//
// Κάθε άσκηση "ίχνους" έχει:
//   code: οι γραμμές Python που βλέπει ο μαθητής
//   run:  generator σε JavaScript που εκτελεί ΤΗΝ ΙΔΙΑ λογική και, μετά από κάθε γραμμή,
//         κάνει yield [δείκτης γραμμής, τιμές μεταβλητών, (προαιρετικά) τι τυπώθηκε].
// Από το run παράγονται αυτόματα ο πίνακας τιμών και η σωστή απάντηση, οπότε δεν
// γράφεται τίποτα με το χέρι που θα μπορούσε να είναι λάθος.
// Για νέα άσκηση: πρόσθεσε ένα αντικείμενο με την ίδια δομή.

export const traceExercises = [
  {
    id: 'sum',
    title: { el: 'Άθροισμα με for', en: 'Sum with a for loop' },
    code: ['s = 0', 'for i in range(1, 5):', '    s = s + i', 'print(s)'],
    *run() {
      let s = 0;
      yield [0, { s }];
      for (let i = 1; i < 5; i++) {
        yield [1, { s, i }];
        s = s + i;
        yield [2, { s, i }];
      }
      yield [3, { s, i: 4 }, String(s)];
    },
  },
  {
    id: 'halve',
    title: { el: 'Διαιρέσεις με while', en: 'Halving with while' },
    code: ['n = 40', 'count = 0', 'while n > 1:', '    n = n // 2', '    count = count + 1', 'print(count)'],
    *run() {
      let n = 40;
      yield [0, { n }];
      let count = 0;
      yield [1, { n, count }];
      while (n > 1) {
        yield [2, { n, count }];
        n = Math.floor(n / 2);
        yield [3, { n, count }];
        count = count + 1;
        yield [4, { n, count }];
      }
      yield [2, { n, count }];
      yield [5, { n, count }, String(count)];
    },
  },
  {
    id: 'swap',
    title: { el: 'Αντιμετάθεση χωρίς τρίτη μεταβλητή', en: 'Swap without a third variable' },
    code: ['a = 3', 'b = 7', 'a = a + b', 'b = a - b', 'a = a - b', 'print(a, b)'],
    *run() {
      let a = 3;
      yield [0, { a }];
      let b = 7;
      yield [1, { a, b }];
      a = a + b;
      yield [2, { a, b }];
      b = a - b;
      yield [3, { a, b }];
      a = a - b;
      yield [4, { a, b }];
      yield [5, { a, b }, `${a} ${b}`];
    },
  },
  {
    id: 'nested',
    title: { el: 'Εμφωλευμένες επαναλήψεις', en: 'Nested loops' },
    code: ['c = 0', 'for i in range(4):', '    for j in range(i):', '        c = c + 1', 'print(c)'],
    *run() {
      let c = 0;
      yield [0, { c }];
      for (let i = 0; i < 4; i++) {
        yield [1, { c, i }];
        for (let j = 0; j < i; j++) {
          yield [2, { c, i, j }];
          c = c + 1;
          yield [3, { c, i, j }];
        }
      }
      yield [4, { c, i: 3 }, String(c)];
    },
  },
  {
    id: 'maxpos',
    title: { el: 'Θέση μεγίστου σε λίστα', en: 'Position of the maximum' },
    code: ['nums = [4, 9, 2, 9, 5]', 'best = 0', 'for i in range(1, 5):', '    if nums[i] > nums[best]:', '        best = i', 'print(best)'],
    *run() {
      const nums = [4, 9, 2, 9, 5];
      yield [0, {}];
      let best = 0;
      yield [1, { best }];
      for (let i = 1; i < 5; i++) {
        yield [2, { best, i }];
        yield [3, { best, i, 'nums[i]': nums[i], 'nums[best]': nums[best] }];
        if (nums[i] > nums[best]) {
          best = i;
          yield [4, { best, i }];
        }
      }
      yield [5, { best, i: 4 }, String(best)];
    },
  },
];

export const exercisesText = {
  el: {
    hero: {
      eyebrow: 'Ασκησεις',
      title: 'Εξάσκηση με το χέρι, όπως στις εξετάσεις',
      subtitle: 'Διαβάστε τον κώδικα, προβλέψτε το αποτέλεσμα και μετά δείτε την εκτέλεση βήμα προς βήμα.',
    },
    trace: {
      title: 'Τι θα τυπώσει το πρόγραμμα;',
      lead: 'Εκτελέστε το πρόγραμμα με το μυαλό σας, γραμμή προς γραμμή, και γράψτε τι τυπώνει στο τέλος.',
      exercise: 'Άσκηση',
      answerLabel: 'Η απάντησή σας',
      answerPlaceholder: 'π.χ. 12',
      check: 'Έλεγχος',
      correct: 'Σωστά.',
      wrong: 'Όχι ακριβώς. Δείτε την εκτέλεση βήμα προς βήμα και δοκιμάστε ξανά.',
      stepsLocked: 'Η εκτέλεση βήμα προς βήμα ανοίγει μετά την πρώτη σας απάντηση.',
      tableTitle: 'Πίνακας τιμών',
      step: 'Βήμα',
      line: 'Γραμμή',
      output: 'Έξοδος',
      prev: 'Προηγούμενο',
      next: 'Επόμενο',
      reset: 'Από την αρχή',
      of: 'από',
    },
    binary: {
      title: 'Δυαδικό σύστημα',
      lead: 'Μετατρέψτε τον αριθμό. Κάθε σωστή απάντηση φέρνει νέο αριθμό.',
      toBinary: (n) => `Γράψτε τον αριθμό ${n} στο δυαδικό σύστημα.`,
      toDecimal: (b) => `Ποιος δεκαδικός αριθμός είναι ο δυαδικός ${b};`,
      placeholder: 'Απάντηση',
      check: 'Έλεγχος',
      next: 'Άλλος αριθμός',
      correct: 'Σωστά.',
      wrong: 'Λάθος. Η ανάλυση σε δυνάμεις του 2:',
      streak: 'Σωστές στη σειρά',
    },
    cta: { title: 'Θέλετε ασκήσεις στα μέτρα σας;', subtitle: 'Στο μάθημα δουλεύουμε πάνω στα σημεία που σας δυσκολεύουν.', button: 'Επικοινωνια' },
  },
  en: {
    hero: {
      eyebrow: 'Exercises',
      title: 'Practice by hand, as in the exam',
      subtitle: 'Read the code, predict the result, then watch it run step by step.',
    },
    trace: {
      title: 'What does the program print?',
      lead: 'Run the program in your head, line by line, and write what it prints at the end.',
      exercise: 'Exercise',
      answerLabel: 'Your answer',
      answerPlaceholder: 'e.g. 12',
      check: 'Check',
      correct: 'Correct.',
      wrong: 'Not quite. Watch the step-by-step run and try again.',
      stepsLocked: 'The step-by-step run unlocks after your first answer.',
      tableTitle: 'Trace table',
      step: 'Step',
      line: 'Line',
      output: 'Output',
      prev: 'Previous',
      next: 'Next',
      reset: 'Start over',
      of: 'of',
    },
    binary: {
      title: 'Binary numbers',
      lead: 'Convert the number. Each correct answer brings a new one.',
      toBinary: (n) => `Write the number ${n} in binary.`,
      toDecimal: (b) => `Which decimal number is binary ${b}?`,
      placeholder: 'Answer',
      check: 'Check',
      next: 'Another number',
      correct: 'Correct.',
      wrong: 'Wrong. Broken down into powers of 2:',
      streak: 'Correct in a row',
    },
    cta: { title: 'Want exercises tailored to you?', subtitle: 'In our lessons we work on exactly the points you find hard.', button: 'Contact' },
  },
};

export const playText = {
  el: {
    hero: { eyebrow: 'Παιχνιδια', title: 'Μάθηση μέσα από παιχνίδι', subtitle: 'Μικρά παιχνίδια για αλγοριθμική σκέψη, μαθηματικά και φυσική.' },
    soon: 'Έρχεται σύντομα',
    body: 'Τα πρώτα παιχνίδια ετοιμάζονται. Μέχρι τότε, δοκιμάστε τις διαδραστικές ασκήσεις.',
    button: 'Στις Ασκησεις',
  },
  en: {
    hero: { eyebrow: 'Play', title: 'Learning through play', subtitle: 'Small games for algorithmic thinking, mathematics and physics.' },
    soon: 'Coming soon',
    body: 'The first games are in the works. Until then, try the interactive exercises.',
    button: 'Go to Exercises',
  },
};
