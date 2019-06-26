var config = {
  apiKey: "AIzaSyCaiqUn1UMOwuHVT01Mw8s-OSQl9QNHgpc",
  authDomain: "timetec-data.firebaseapp.com",
  databaseURL: "https://timetec-data.firebaseio.com",
  storageBucket: "timetec-data.appspot.com",
  messagingSenderId: "671839024565"
};
firebase.initializeApp(config);

const auth = firebase.auth();

var database = firebase.database();
/*function signUp() {
  var email = "gu_ruigang@hotmail.com";
  var password = "Timetec1911";
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      // ...
    });
}*/
function authLogin() {
  var email = document.getElementById("inputEmail").value;
  var password = document.getElementById("inputPassword").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...

      console.log("Error Code: " + errorCode);

      console.log("errorMessage" + errorMessage);
    });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("user logged in ");
    console.log(user);

    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    uid = user.uid;

    console.log("name: " + name);
    console.log("email: " + email);
    console.log(photoUrl);
    console.log(uid);
    window.location = "dashboard.html";
  } else {
    console.log("not logged in");
  }
});
