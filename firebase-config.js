import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendEmailVerification,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB6To1A-e7hknxX2ENReHEZN7dIqNYHYXs",
    authDomain: "tweettimely.firebaseapp.com",
    projectId: "tweettimely",
    storageBucket: "tweettimely.firebasestorage.app",
    messagingSenderId: "439865564201",
    appId: "1:439865564201:web:43dd6aa9b3484059d25038"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
    auth, 
    googleProvider, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup,
    sendEmailVerification,
    updateProfile 
}; 