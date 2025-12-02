import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Firebase konfiguracija
const firebaseConfig = {
    apiKey: "AIzaSyBEOwYndOTHj2Lpv9oaAPqRn9ps7c8eMOk",
    authDomain: "login-form-5929c.firebaseapp.com",
    projectId: "login-form-5929c",
    storageBucket: "login-form-5929c.appspot.com",
    messagingSenderId: "704458274314",
    appId: "1:704458274314:web:e2dd965b9f5391399591f3"
};

const app = initializeApp(firebaseConfig);

// Pomoćna funkcija za poruke
function showMessage(message, divId){
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
        setTimeout(()=>{messageDiv.style.display="none";},500);
    }, 5000);
}

// SIGN UP
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event)=>{
    event.preventDefault();

    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user = userCredential.user;
        const userData = { email, firstName, lastName };

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(()=>{
            showMessage('Account created successfully', 'signUpMessage');
            setTimeout(()=>{ window.location.href='main.html'; }, 1500);
        })
        .catch((error)=>{
            console.error("Error writing document", error);
            showMessage('Error saving user data', 'signUpMessage');
        });
    })
    .catch((error)=>{
        if(error.code === 'auth/email-already-in-use'){
            showMessage('You already have an account', 'signUpMessage');
        } else {
            showMessage('User cannot be created', 'signUpMessage');
        }
    });
});

// SIGN IN
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event)=>{
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        showMessage('Successfully signed in', 'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        setTimeout(()=>{ window.location.href='profile.html'; }, 1000);
    })
    .catch((error)=>{
        if(error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password'){
            showMessage('Check Email or Password', 'signInMessage');
        } else if(error.code === 'auth/user-not-found'){
            showMessage('Account does not exist', 'signInMessage');
        } else {
            showMessage('Sign in failed', 'signInMessage');
        }
    });
});
