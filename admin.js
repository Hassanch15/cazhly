const admin = require("firebase-admin");
const firebase = require("firebase");
const serviceAccount = require("neighbor-service");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://neighbor-446dc.firebaseio.com"
});
const firebaseConfig = {
    apiKey: "AIzaSyCzvVZ_XjYTdFq2ozhbLtJeWo_24wD5v08",
    authDomain: "neighbor-446dc.firebaseapp.com",
    databaseURL: "https://neighbor-446dc.firebaseio.com",
    projectId: "neighbor-446dc",
    storageBucket: "neighbor-446dc.appspot.com",
    messagingSenderId: "147556462851",
    appId: "1:147556462851:web:1f6832f98ba343324db936",
    measurementId: "G-B2C5GDDSG0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = {admin, firebase};
