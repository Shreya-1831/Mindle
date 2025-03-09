// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1L-AiOhusfQmezqO5ZvwK2qPNd2gIOVo",
  authDomain: "mindle-dbf3a.firebaseapp.com",
  projectId: "mindle-dbf3a",
  storageBucket: "mindle-dbf3a.firebasestorage.app",
  messagingSenderId: "59071781496",
  appId: "1:59071781496:web:5bea5f50f7a70a0d7fab8d",
  measurementId: "G-MGF43S0HN9",
  databaseURL: "https://mindle-dbf3a-default-rtdb.firebaseio.com" // Add this line for Realtime Database
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Export Firebase services for use in other modules
export { app, database, ref, set, onValue, remove };