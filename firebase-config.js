import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendEmailVerification,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

export const firebaseConfig = {
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

const actionCodeSettings = {
    url: window.location.hostname === 'localhost' 
        ? `http://localhost:${window.location.port}/dashboard.html`
        : 'https://tweettimely.vercel.app/dashboard.html',
    handleCodeInApp: true
};

export { 
    auth, 
    onAuthStateChanged,
    googleProvider, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup,
    sendEmailVerification,
    updateProfile,
    signOut,
    actionCodeSettings
}; 