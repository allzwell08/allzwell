/* navbar.js
   Drop-in shared nav bar for All'z Well.

   USAGE — add these three lines near the top of <head>/</body> of every
   page EXCEPT login.html and homepage.html:

     <link rel="stylesheet" href="navbar.css">
     <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
     <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
     <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
     <script src="navbar.js" defer></script>

   (If the page already loads the Firebase compat scripts itself, e.g.
   for its own database calls, just add navbar.css + navbar.js.)

   The bar injects itself as the first element in <body> and:
     - redirects to login.html if nobody is signed in (same guard
       pattern as homepage.html)
     - shows a home icon back to homepage.html
     - shows an avatar (initials from the signed-in email) that links
       to profile.html -- this is the "connected to profile" piece
     - pulls displayName from Loginform/{uid} if the user has set one,
       falling back to the email prefix
*/

(function () {
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

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const auth = firebase.auth();
  const db = firebase.database();

  function initials(text) {
    if (!text) return "?";
    const clean = text.trim();
    const parts = clean.split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  }

  function buildNavbar() {
    const bar = document.createElement("div");
    bar.id = "az-navbar";
    bar.innerHTML = `
      <div class="az-nav-left">
        <a class="az-nav-icon-btn" href="homepage.html" aria-label="Home">
          <i class="fa-solid fa-house"></i>
        </a>
        <span class="az-nav-title">All'z Well</span>
      </div>
      <div class="az-nav-right">
        <a class="az-nav-avatar" id="az-nav-avatar" href="profile.html" aria-label="Your profile">?</a>
      </div>
    `;
    document.body.prepend(bar);
    document.body.classList.add("az-has-navbar");
    return bar;
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Font Awesome is already used elsewhere in the app (homepage.html,
    // login.html); if a page hasn't loaded it, the house icon just
    // won't render -- harmless, but add the FA <link> for consistency:
    // https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css
    buildNavbar();

    auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = "login.html";
        return;
      }
      const avatar = document.getElementById("az-nav-avatar");
      const fallbackName = user.email.split("@")[0];
      avatar.textContent = initials(fallbackName);

      db.ref("Loginform/" + user.uid + "/displayName").once("value")
        .then((snap) => {
          const displayName = snap.val();
          if (displayName) {
            avatar.textContent = initials(displayName);
            avatar.setAttribute("aria-label", displayName + "'s profile");
          }
        })
        .catch((err) => console.error("navbar: could not load displayName", err));
    });
  });
})();
