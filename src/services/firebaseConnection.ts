// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnVOT1LnP3rDCIBjFpHALGjNTdAEbay3U",
  authDomain: "g3-tarefas-puls.firebaseapp.com",
  projectId: "g3-tarefas-puls",
  storageBucket: "g3-tarefas-puls.firebasestorage.app",
  messagingSenderId: "511670674586",
  appId: "1:511670674586:web:a27fa69a1df6b6fb39eb23",
  measurementId: "G-85WQSFYBHF"
};

const firebaeApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaeApp);

export { db };