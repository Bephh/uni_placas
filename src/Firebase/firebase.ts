import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; 

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBse8CK1xsS6XlXii7Slt5xxk39NCAwLdg",
  authDomain: "uni-placas.firebaseapp.com",
  projectId: "uni-placas",
  storageBucket: "uni-placas.firebasestorage.app",
  messagingSenderId: "470571771206",
  appId: "1:470571771206:web:d07d7c104bdb7f0cf7b147",
  measurementId: "G-TT9BEDFWLH"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
// Se o Realtime Database foi criado fora da região padrão (EUA), adicione `databaseURL` ao firebaseConfig acima.
export const db = getDatabase(app);