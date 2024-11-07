import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_5-ogPFHsCquvYeX2pXwPhb3eHgdKUnw",
  authDomain: "ticketapp-7a763.firebaseapp.com",
  projectId: "ticketapp-7a763",
  storageBucket: "ticketapp-7a763.firebasestorage.app",
  messagingSenderId: "308825757174",
  appId: "1:308825757174:web:ebf81fa7a2261ce58223d7"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);