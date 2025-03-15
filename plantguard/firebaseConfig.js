// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzQbrRDXh__CXUBngrDODv2GLIpxKToHs",
  authDomain: "plantguard-fyp.firebaseapp.com",
  projectId: "plantguard-fyp",
  storageBucket: "plantguard-fyp.firebasestorage.app",
  messagingSenderId: "50479591984",
  appId: "1:50479591984:web:d35b6c2e50249830f7b3f5",
  measurementId: "G-BHXP04YFG9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth };
