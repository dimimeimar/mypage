// Μικρό βοηθητικό: αφαιρεί τους τόνους από ελληνικό κείμενο.
// Χρήσιμο όταν το ίδιο string εμφανίζεται και σε κανονική μορφή (με τόνους)
// και σε text-transform: uppercase (όπου οι τόνοι φαίνονται περίεργα).
// Δεν πειράζει τα διαλυτικά (ϊ, ϋ) - μόνο τον οξεία τόνο.
export function stripTonos(str) {
  if (!str) return str;
  return str.normalize('NFD').replace(/\u0301/g, '').normalize('NFC');
}
