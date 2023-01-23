import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  where,
  query,
  Timestamp,
} from "firebase/firestore";
import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  MEASUREMENT_ID,
  MESSAGING_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
  FRIENDS_COLLECTION,
} from "./contants";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};
// const firebaseConfig = {
//   apiKey: "AIzaSyAvU-VfngeIE_j1dmGxKJBnDZOo_eOd5-E",
//   authDomain: "mapauth-37afa.firebaseapp.com",
//   projectId: "mapauth-37afa",
//   storageBucket: "mapauth-37afa.appspot.com",
//   messagingSenderId: "799196939798",
//   appId: "1:799196939798:web:330f03355b4a10e474d737",
//   measurementId: "G-QSCBYQ8TQ6",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// export async function addUser(user) {
//   try {
//     const usersRef = collection(db, FIRENDS_COLLECTION);
//     const userRef = await addDoc(usersRef, user);
//     console.log("User is added, id :", userRef.id);
//   } catch (error) {
//     console.error(error);
//   }
// }

export async function getFriends() {
  try {
    const friendsRef = collection(db, FRIENDS_COLLECTION);
    const docSnap = await getDocs(friendsRef);
    const friends = [];
    docSnap.forEach((doc) => {
      friends.push({ id: doc.id, ...doc.data() });
    });
    return friends;
  } catch (error) {
    console.error(error);
  }
}
