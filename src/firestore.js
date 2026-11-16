// Firestore: ξεχωριστό αρχείο από το firebase.js, για να μπαίνει μόνο στο chunk του ημερολογίου.
import { getFirestore } from 'firebase/firestore';
import { app } from './firebase';

export const db = getFirestore(app);
