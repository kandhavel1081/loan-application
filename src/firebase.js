import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDicsMG3ziTIVuzk2ZVCCsJKLBlQ6JYONI",
  authDomain: "loan-application-f68fe.firebaseapp.com",
  projectId: "loan-application-f68fe",
  storageBucket: "loan-application-f68fe.firebasestorage.app",
  messagingSenderId: "361747165845",
  appId: "1:361747165845:web:6e2d5638d3245bc716619c",
  measurementId: "G-66M8HXHF2L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);