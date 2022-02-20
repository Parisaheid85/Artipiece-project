import firebase from "firebase";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyAAVccHJbVszZhOQyJkjf3TVa8roKqXIvA",
  authDomain: "artpiece-gallery.firebaseapp.com",
  projectId: "artpiece-gallery",
  storageBucket: "artpiece-gallery.appspot.com",
  messagingSenderId: "615537410066",
  appId: "1:615537410066:web:b9d46c96cf3198e72598cb",
};

firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();
export const fsDb = firebase.firestore();
export const storage = firebase.storage();
