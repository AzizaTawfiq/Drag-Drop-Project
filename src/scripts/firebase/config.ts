import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKprA8V_NWi_lkNo24xIYqLH8KdF8o5rI",
  authDomain: "drag-drop-app-581c2.firebaseapp.com",
  projectId: "drag-drop-app-581c2",
  storageBucket: "drag-drop-app-581c2.firebasestorage.app",
  messagingSenderId: "575616961488",
  appId: "1:575616961488:web:9fecdab62695ac8a5887d5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
