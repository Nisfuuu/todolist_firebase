// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔥 Ganti isi firebaseConfig ini pakai konfigurasi dari Firebase Console kamu
const firebaseConfig = {
  apiKey: "AIzaSyDYn9t7i9_01Bs5eOvsEdK_wY7Z-DN0bH4",
  authDomain: "todolist-c7673.firebaseapp.com",
  projectId: "todolist-c7673",
  storageBucket: "todolist-c7673.firebasestorage.app",
  messagingSenderId: "286148309843",
  appId: "1:286148309843:web:dc1e3d9d985a2fe1b167a6",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
