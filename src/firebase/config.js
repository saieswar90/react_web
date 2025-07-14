// firebase/config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_zKYRQN7MtNhVr-S_3l1lPi0TpzGRfMw",
  authDomain: "sai-project-3c364.firebaseapp.com",
  projectId: "sai-project-3c364",
  storageBucket: "sai-project-3c364.appspot.com",
  messagingSenderId: "730539847180",
  appId: "1:730539847180:web:414037964280ea1a93c829",
  measurementId: "G-H1GYFC2WHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
