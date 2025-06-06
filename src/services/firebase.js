import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1FSMjRU8TvOZUXKXUMHUvmJjiVNGcMOg",
  authDomain: "boom-2f993.firebaseapp.com",
  projectId: "boom-2f993",
  storageBucket: "boom-2f993.firebasestorage.app",
  messagingSenderId: "201296566493",
  appId: "1:201296566493:web:d32a55b6b6a4564d356334",
  measurementId: "G-NB10Q878F2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
