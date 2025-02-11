import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1WAzPDPL2wA2tYSQIYFoL04JHiz8gNo8",
  authDomain: "learnlingo-96439.firebaseapp.com",
  projectId: "learnlingo-96439",
  storageBucket: "learnlingo-96439.firebasestorage.app",
  messagingSenderId: "84162327431",
  appId: "1:84162327431:web:6a00f7793424706656d922",
  measurementId: "G-N03N4JFLGG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
