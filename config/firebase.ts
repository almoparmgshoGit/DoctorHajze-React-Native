import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCfvxJwH3wLALxXctYnTGSoB-lRfilBxfI",
    authDomain: "doctorapp-9d8eb.firebaseapp.com",
    projectId: "doctorapp-9d8eb",
    storageBucket: "doctorapp-9d8eb.firebasestorage.app",
    messagingSenderId: "797494353895",
    appId: "1:797494353895:web:1a8b1963bb26ddd6646742",
    measurementId: "G-96VKDBYEJY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;