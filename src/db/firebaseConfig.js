import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAp2UzvVrcdArwT3Wosh9b209XCAMGPqA",
  authDomain: "projetos-pessoais-3eb8f.firebaseapp.com",
  projectId: "projetos-pessoais-3eb8f",
  storageBucket: "projetos-pessoais-3eb8f.firebasestorage.app",
  messagingSenderId: "778695472327",
  appId: "1:778695472327:web:80b0cea28b4ed725bdfae2",
  measurementId: "G-EY9JFHQV3G"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, addDoc, getDocs, query, where, createUserWithEmailAndPassword, signInWithEmailAndPassword };
