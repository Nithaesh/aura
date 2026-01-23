import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Uncomment if you actually need analytics

const firebaseConfig = {
  apiKey: "AIzaSyAcfvK9qCb1waguYTSojIKdbBIyAiAz5O8",
  authDomain: "aura-254dc.firebaseapp.com",
  projectId: "aura-254dc",
  storageBucket: "aura-254dc.firebasestorage.app",
  messagingSenderId: "981446946198",
  appId: "1:981446946198:web:63f8ca28dc756e098a41b7"
};
// 1. Initialize App
const app = initializeApp(firebaseConfig);

// 2. Initialize Services
const auth = getAuth(app);
const db = getFirestore(app); // <--- This was likely missing or not exported

// 3. Export them so Dashboard.jsx can use them
export { auth, db };