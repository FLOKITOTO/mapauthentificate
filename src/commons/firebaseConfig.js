import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { USERS_COLLECTION } from "../commons/contants";

const firebaseConfig = {
  apiKey: "AIzaSyAvU-VfngeIE_j1dmGxKJBnDZOo_eOd5-E",
  authDomain: "mapauth-37afa.firebaseapp.com",
  projectId: "mapauth-37afa",
  storageBucket: "mapauth-37afa.appspot.com",
  messagingSenderId: "799196939798",
  appId: "1:799196939798:web:330f03355b4a10e474d737",
  measurementId: "G-QSCBYQ8TQ6",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

export async function addUser(user) {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const userRef = await addDoc(usersRef, user);
    console.log("User is added, id :", userRef.id);
  } catch (error) {
    console.error(error);
  }
}
