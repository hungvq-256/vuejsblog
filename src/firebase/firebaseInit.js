import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
var firebaseConfig = {
    apiKey: "AIzaSyBzF6bAJdwEsMKh2q2P4dU7xTzBT-nIpOs",
    authDomain: "blog-vuejs-4f130.firebaseapp.com",
    projectId: "blog-vuejs-4f130",
    storageBucket: "blog-vuejs-4f130.appspot.com",
    messagingSenderId: "205393630458",
    appId: "1:205393630458:web:6b7e9c72acc45ab45aa543",
    measurementId: "G-RM06TDE9S1"
};
// Initialize Firebase
// firebase.analytics();
const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const db = firebase.firestore();
export { timestamp, db };
export default firebaseApp;

