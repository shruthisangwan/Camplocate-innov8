import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVh4uW16b6F4sYnAcusPi67UfN5u1xhIo",
  authDomain: "camplocate-94c95.firebaseapp.com",
  projectId: "camplocate-94c95",
  storageBucket: "camplocate-94c95.firebasestorage.app",
  messagingSenderId: "306045884018",
  appId: "1:306045884018:web:f7f10e0d79bd70feaa94eb",
  measurementId: "G-SYZ4LQLHJ1"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);