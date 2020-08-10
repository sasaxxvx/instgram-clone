    import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA_yuM4pFPhaTkSyFC97SmJ6sJiNAX6oWc",
    authDomain: "instagram-clone-react-e0d4d.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-e0d4d.firebaseio.com",
    projectId: "instagram-clone-react-e0d4d",
    storageBucket: "instagram-clone-react-e0d4d.appspot.com",
    messagingSenderId: "12461248062",
    appId: "1:12461248062:web:ba772e2c9c1a814769cb6f",
    measurementId: "G-LLR4TYEJGE"
  });

//   -> initialize firebase by passing the config, btw, wt is 2-way sync?
//   -> in this way of firebase, we are not setting routes, endpoints, 
//   ORM，we dont have models, databases, cuz anytime you are doing 
//  modelviewcontroller, you have to do those things. 

//  -> firebase get rid of the complexity;

// -> Q: is it safe to save the db credentials in the front-end?
//    A： it is totally fine if you set the rules corretly. 



  const db = firebaseApp.firestore();
  const auth = firebase.auth();
//   login / logout
  const storage = firebase.storage();
//   upload pictures...

//   grabbing 3 three services from firebase

  export {db, auth, storage};




