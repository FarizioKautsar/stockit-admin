// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
import auth from "firebase/auth";
import "firebase/compat/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzAyeYoOMI361kc-OJq59_8yvsIHucfco",
  authDomain: "stockit-backend-54d3b.firebaseapp.com",
  projectId: "stockit-backend-54d3b",
  storageBucket: "stockit-backend-54d3b.appspot.com",
  messagingSenderId: "788716472817",
  appId: "1:788716472817:web:4e47c2a709e626eef15c50",
  measurementId: "G-P87CNBS6DS"
};

// Initialize Firebase
// const firebase = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
firebase.firestore()
// const analytics = getAnalytics(firebase);
// const firestore = getFirestore();
// firestore.settings({ timestampsInSnapshots: true });

export { firebase, firebaseConfig };