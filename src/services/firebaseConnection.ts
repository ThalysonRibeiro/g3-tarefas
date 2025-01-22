// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyConpSFthSOW5ZXv_En3C7EpmnWHdb22M8",
  authDomain: "taskhub-fd6c3.firebaseapp.com",
  projectId: "taskhub-fd6c3",
  storageBucket: "taskhub-fd6c3.firebasestorage.app",
  messagingSenderId: "1056197952125",
  appId: "1:1056197952125:web:ebccae2bb65640d6a26714",
  measurementId: "G-K1FK24NLY9"
};

const firebaeApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaeApp);

export { db };