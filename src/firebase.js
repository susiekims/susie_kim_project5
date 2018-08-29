import firebase from 'firebase';
var config = {
  apiKey: "AIzaSyBCEk6sxhEpElxOiOMnv4l9eOV_RIemimc",
  authDomain: "expense-tracker-v2.firebaseapp.com",
  databaseURL: "https://expense-tracker-v2.firebaseio.com",
  projectId: "expense-tracker-v2",
  storageBucket: "",
  messagingSenderId: "706579492241"
};
firebase.initializeApp(config);


export default firebase;