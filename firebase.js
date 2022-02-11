import firebase from "firebase";

// Optionally import the services that you want to use
import "firebase/auth";
//import "firebase/database";
import "firebase/firestore";
//import "firebase/functions";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsp-zjL1XiddCr7HwEm33N5sPsDbRjvlo",
  authDomain: "new-parking-app-ecfa0.firebaseapp.com",
  projectId: "new-parking-app-ecfa0",
  storageBucket: "new-parking-app-ecfa0.appspot.com",
  messagingSenderId: "1049891039964",
  appId: "1:1049891039964:web:d06f1fd2024ca7023ca219",
  measurementId: "G-RDFXJ31JDY",
};
// const firebaseConfig = {
//   apiKey: "AIzaSyCsJHDxSNclghAWUEGPP_lBrUJgxt68EOk",
//   authDomain: "pkapp-7e6be.firebaseapp.com",
//   projectId: "pkapp-7e6be",
//   storageBucket: "pkapp-7e6be.appspot.com",
//   messagingSenderId: "380633747015",
//   appId: "1:380633747015:web:4a6ad7b6167e45f0872b62",
//   measurementId: "G-S1YPTJHC97",
// };
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
app.firestore().settings({ persistence: false });
const db = app.firestore();

const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

/////

// import firebase from 'firebase';
// import "firebase/auth";
// import "firebase/firestore";
// import { getDatabase } from "firebase/database";

// var firebaseConfig = {
//   apiKey: "AIzaSyD6GLc81-fAsC72nop8AIzUfMG26Uyi5-I",
//   authDomain: "tapmoney-d1e5f.firebaseapp.com",
//   projectId: "tapmoney-d1e5f",
//   storageBucket: "tapmoney-d1e5f.appspot.com",
//   messagingSenderId: "48070917160",
//   appId: "1:48070917160:web:9f369f472514760741091d",
//   measurementId: "G-D8GB831L31"
// };

// let app ;
// if(firebase.apps.length===0){
//  app = firebase.initializeApp(firebaseConfig);
// } else {
//   app=firebase.app();
// }

// const database = firebase.database();
// const db =app.firestore();
// const auth = firebase.auth();

// export {db,auth,database};
