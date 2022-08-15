import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD6TNqicFTJSbeWjNqU8H4R5D4mY5ypGn0",
  authDomain: "talkkr-72656.firebaseapp.com",
  projectId: "talkkr-72656",
  storageBucket: "talkkr-72656.appspot.com",
  messagingSenderId: "203678796109",
  appId: "1:203678796109:web:47aef3013dedc74616cf04",
  measurementId: "G-46H6YW1ZS3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);