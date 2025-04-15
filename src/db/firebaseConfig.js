import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc, query, where, onSnapshot } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmQ1FGyixowsu1_1f73wDAlBbFTswf6Oc",
  authDomain: "meu-site-dashhub.firebaseapp.com",
  projectId: "meu-site-dashhub",
  storageBucket: "meu-site-dashhub.firebasestorage.app",
  messagingSenderId: "331881254986",
  appId: "1:331881254986:web:be7523f6a36448e54b56b3",
  measurementId: "G-FFSDH58N48"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  db,
  auth,
  collection,
  addDoc,
  getDocs,
  getDoc, 
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
};
