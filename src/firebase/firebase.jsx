// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBrObSCadlk_p2c1mVdEruCdin4IbIf0FQ",
  authDomain: "https://console.firebase.google.com/project/battlefield-mac22/database/battlefield-mac22-default-rtdb/data/~2F?fb_gclid=Cj0KCQjwqv2_BhC0ARIsAFb5Ac-DqLoDFqsEy6S3eJNct5T_S4cQVKBG24uX3ljdMaU7P29gVMvfI_oaAna8EALw_wcB",
  projectId: "battlefield-mac22",
  storageBucket: "battlefield-mac22.firebasestorage.app",
  messagingSenderId: "276023740336",
  appId: "1:276023740336:web:59c52f62eb3ea1efebf875",
  measurementId: "G-7QV433VTVD"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push };
