// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvOiTy3UHBaCQKz5dN4B27UesNa3lZ7Ng",
  authDomain: "focal-portal-7df0b.firebaseapp.com",
  projectId: "focal-portal-7df0b",
  storageBucket: "focal-portal-7df0b.firebasestorage.app",
  messagingSenderId: "530953644952",
  appId: "1:530953644952:web:a9b7d990ae86fe716499ed",
  measurementId: "G-DKMJPP83GV"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
