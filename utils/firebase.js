// const { initializeApp } = require('firebase/app');
// const { getStorage } = require('firebase/storage');

// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE,
//     appId: process.env.FIREBASE_API_ID,
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const storage = getStorage(firebaseApp);

// module.exports = { storage };


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    // apiKey: "AIzaSyD_dM8xrhgn4R_XcjVh1lNfZBBRbvNWyDM",
    // projectId: "ecommercenodejs-dfe87",
    // storageBucket: "ecommercenodejs-dfe87.appspot.com",
    // appId: "1:143158314299:web:1ea5f5c9f908e29e90e31e"
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE,
    appId: process.env.FIREBASE_API_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);