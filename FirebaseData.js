import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage utilities
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider } from 'firebase/auth'; // Import auth utilities
import { getFirestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyDtEajVaMtE6C3W_T__rdWI_xS0ROKne1o",
    authDomain: "travel-8c27f.firebaseapp.com",
    databaseURL: "https://travel-8c27f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "travel-8c27f",
    storageBucket: "travel-8c27f.appspot.com",
    messagingSenderId: "198325803533",
    appId: "1:198325803533:web:4eb0a041edc8618f8f1344"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const database = getDatabase(app);
const storage = getStorage(app); // Initialize Firebase Storage
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { 
    database, 
    storage, 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    updateProfile, 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    googleProvider 
};
