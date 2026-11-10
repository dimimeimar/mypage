// Δεδομένα του χάρτη (OpenStreetMap), οργανωμένα ανά γλώσσα.
// Χρήση: const t = mapData[language] || mapData.el;

export const mapData = {
  el: {
    headerTitle: 'Περιοχές Διδασκαλίας - Θεσσαλονίκη',
    headerSubtitleLoaded: 'Κάντε κλικ σε μια περιοχή για περισσότερες πληροφορίες',
    headerSubtitleLoading: 'Φόρτωση χάρτη...',
    errorPrefix: 'Σφάλμα:',
    areas: [
      { name: 'Κέντρο Θεσσαλονίκης', coords: [40.6401, 22.9444], description: 'Δωρεάν μετακίνηση', details: 'Πλατεία Αριστοτέλους, Τσιμισκή, Εγνατία' },
      { name: 'Τούμπα', coords: [40.6137426328468, 22.969123263831477], description: 'Κανονική τιμή', details: 'Ολόκληρη η περιοχή της Τούμπας' },
      { name: 'Κορδελιό', coords: [40.67154273586551, 22.891582812367258], description: 'Κανονική τιμή', details: 'Κορδελιό και γύρω περιοχές' },
      { name: 'Σίνδος', coords: [40.6833, 22.8167], description: 'Προσαρμοσμένη τιμή', details: 'Σίνδος και Βιομηχανική Περιοχή' },
      { name: 'Σταυρούπολη', coords: [40.6667, 22.9333], description: 'Κανονική τιμή', details: 'Σταυρούπολη και περιοχή' },
      { name: 'Καλαμαριά', coords: [40.5833, 22.9500], description: 'Κανονική τιμή', details: 'Καλαμαριά και παραλιακή ζώνη' },
      { name: 'Πανόραμα', coords: [40.5667, 23.0333], description: 'Προσαρμοσμένη τιμή', details: 'Πανόραμα και ορεινές περιοχές' },
      { name: 'Πυλαία', coords: [40.6000, 23.0000], description: 'Κανονική τιμή', details: 'Πυλαία και Χορτιάτης' },
      { name: 'Αμπελόκηποι', coords: [40.65178090063084, 22.927539779552113], description: 'Κανονική τιμή', details: 'Αμπελόκηποι και Παναγία' },
      { name: 'Πεύκα', coords: [40.65874, 22.98834], description: 'Προσαρμοσμένη τιμή', details: 'Πεύκα και ανατολικές περιοχές' },
      { name: 'Ασβεστοχώρι', coords: [40.64118835710902, 23.02454182516564], description: 'Προσαρμοσμένη τιμή', details: 'Ασβεστοχώρι και βορειοδυτικές περιοχές' },
      { name: 'Πολίχνη', coords: [40.66282601260418, 22.94832471844676], description: 'Κανονική τιμή', details: 'Πολίχνη και ανατολικά προάστια' },
      { name: 'Νεάπολη', coords: [40.65340903604913, 22.94201027109772], description: 'Κανονική τιμή', details: 'Νεάπολη και κεντρικές περιοχές' }
    ]
  },
  en: {
    headerTitle: 'Teaching Areas - Thessaloniki',
    headerSubtitleLoaded: 'Click an area for more information',
    headerSubtitleLoading: 'Loading map...',
    errorPrefix: 'Error:',
    areas: [
      { name: 'Thessaloniki City Center', coords: [40.6401, 22.9444], description: 'Free transportation', details: 'Aristotelous Square, Tsimiski, Egnatia' },
      { name: 'Toumba', coords: [40.6137426328468, 22.969123263831477], description: 'Standard rate', details: 'The entire Toumba area' },
      { name: 'Kordelio', coords: [40.67154273586551, 22.891582812367258], description: 'Standard rate', details: 'Kordelio and surrounding areas' },
      { name: 'Sindos', coords: [40.6833, 22.8167], description: 'Adjusted rate', details: 'Sindos and the Industrial Area' },
      { name: 'Stavroupoli', coords: [40.6667, 22.9333], description: 'Standard rate', details: 'Stavroupoli and surrounding area' },
      { name: 'Kalamaria', coords: [40.5833, 22.9500], description: 'Standard rate', details: 'Kalamaria and the coastal zone' },
      { name: 'Panorama', coords: [40.5667, 23.0333], description: 'Adjusted rate', details: 'Panorama and the hillside areas' },
      { name: 'Pylaia', coords: [40.6000, 23.0000], description: 'Standard rate', details: 'Pylaia and Chortiatis' },
      { name: 'Ampelokipoi', coords: [40.65178090063084, 22.927539779552113], description: 'Standard rate', details: 'Ampelokipoi and Panagia' },
      { name: 'Pefka', coords: [40.65874, 22.98834], description: 'Adjusted rate', details: 'Pefka and the eastern areas' },
      { name: 'Asvestochori', coords: [40.64118835710902, 23.02454182516564], description: 'Adjusted rate', details: 'Asvestochori and the north-western areas' },
      { name: 'Polichni', coords: [40.66282601260418, 22.94832471844676], description: 'Standard rate', details: 'Polichni and the eastern suburbs' },
      { name: 'Neapoli', coords: [40.65340903604913, 22.94201027109772], description: 'Standard rate', details: 'Neapoli and central areas' }
    ]
  }
};
