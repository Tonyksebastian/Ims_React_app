// Import the necessary Firebase modules from the SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection, // Ensure this is imported only once
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyBj39nL-QHbPbFdFmTpm8jo5kAf6USdCd0",
    authDomain: "ims-connect-9a5ad.firebaseapp.com",
    projectId: "ims-connect-9a5ad",
    storageBucket: "ims-connect-9a5ad.firebasestorage.app",
    messagingSenderId: "533091819799",
    appId: "1:533091819799:web:bd2931f5c58d8c96b35752",
    measurementId: "G-C7X0TWWWXG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase services and utilities
export {  auth,  db,  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where,};