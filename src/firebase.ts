// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

import { getAuth, connectAuthEmulator, signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXuP3Hy0JBMFfRkn477U2Gy_mb9WmKifU",
    authDomain: "chatapp-24285.firebaseapp.com",
    projectId: "chatapp-24285",
    storageBucket: "chatapp-24285.appspot.com",
    messagingSenderId: "1044541888156",
    appId: "1:1044541888156:web:b0f701d23602ea8e803f59"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);

}
export { app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db };