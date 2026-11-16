// firebase.js (στο root του project)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDpdzEeQ2FGat93Mh3CJP1sH16k_fFuS0c",
  authDomain: "meimaridis-tutor.firebaseapp.com",
  projectId: "meimaridis-tutor",
  storageBucket: "meimaridis-tutor.firebasestorage.app",
  messagingSenderId: "174219472621",
  appId: "1:174219472621:web:d7337a14a65db7e53ee6e4",
  measurementId: "G-H67GR5FP7M"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Η βάση (Firestore) ορίζεται στο firestore.js, ώστε να φορτώνει μόνο στις σελίδες
// που τη χρειάζονται (ημερολόγιο) και να μη βαραίνει την Αρχική.
export { app, analytics };