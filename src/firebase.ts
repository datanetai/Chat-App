// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { connectAuthEmulator } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

console.log("NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    connectAuthEmulator(auth, 'http://localhost:9099');
}
export { app, auth, createUserWithEmailAndPassword };