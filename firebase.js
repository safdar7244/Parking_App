import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzaJcDueS7-N1XeLc89fD4WXhSQZQEPsc",
  authDomain: "parking-app-9058e.firebaseapp.com",
  projectId: "parking-app-9058e",
  storageBucket: "parking-app-9058e.appspot.com",
  messagingSenderId: "951274266277",
  appId: "1:951274266277:web:40f01433ada2504785f74c",
  measurementId: "G-3FN5S881GM",
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
