import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

import { collection, getDocs } from "firebase/firestore";
import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  MEASUREMENT_ID,
  MESSAGING_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
  FRIENDS_COLLECTION,
  NO_FRIENDS_COLLECTION,
  USERS_COLLECTION,
  DATABASE_URL,
} from "./contants";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  databaseURL: DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const dbrt = getDatabase(app);

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

export async function getUser() {
  try {
    const friendsRef = collection(db, USERS_COLLECTION);
    const docSnap = await getDocs(userssRef);
    const friends = [];
    docSnap.forEach((doc) => {
      friends.push({ id: doc.id, ...doc.data() });
    });
    return friends;
  } catch (error) {
    console.error(error);
  }
}

export async function getNoFriends() {
  try {
    const noFriendsRef = collection(db, NO_FRIENDS_COLLECTION);
    const docSnap = await getDocs(noFriendsRef);
    const noFriends = [];
    docSnap.forEach((doc) => {
      noFriends.push({ id: doc.id, ...doc.data() });
    });
    return noFriends;
  } catch (error) {
    console.error(error);
  }
}
