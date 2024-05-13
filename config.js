import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAugmXlFOFz56ODMFNL-zm1YKxDJyhfhkU",
  authDomain: "eventpass-84cb8.firebaseapp.com",
  projectId: "eventpass-84cb8",
  storageBucket: "eventpass-84cb8.appspot.com",
  messagingSenderId: "40067555627",
  appId: "1:40067555627:web:dc4e1735fbcc8acf36a56e",
  measurementId: "G-LGLQZTZ3CV",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
