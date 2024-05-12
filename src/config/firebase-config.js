
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from '@firebase/firestore'
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-7N5ZJbdROfJV14oO_W9vXkqkS8iBgMw",
  authDomain: "my-mink.firebaseapp.com",
  projectId: "my-mink",
  storageBucket: "my-mink.appspot.com",
  messagingSenderId: "88795297710",
  appId: "1:88795297710:web:ec4236af7148d9f1053a3f",
  measurementId: "G-G84EFYPSDB"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth()
const storage = getStorage(app)
const functions = getFunctions(app)
export {db,auth,storage,functions}
const analytics = getAnalytics(app);