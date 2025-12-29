import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔴 REPLACE THIS OBJECT WITH YOUR REAL KEYS FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "campus-lens.firebaseapp.com",
  projectId: "campus-lens",
  storageBucket: "campus-lens.firebasestorage.app",
  messagingSenderId: "12345...",
  appId: "1:12345..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);