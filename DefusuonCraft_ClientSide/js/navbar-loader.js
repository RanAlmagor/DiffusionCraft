// === navbar-loader.js ===
// Loads the sidebar navbar dynamically and shows links based on Cognito group

// Load navbar.html into #navbar-container
fetch("web components/navbar.html")
  .then((res) => res.text())
  .then((html) => {
    const container = document.getElementById("navbar-container");
    container.innerHTML = html;

    // Wait until DOM is updated
    setTimeout(() => {
      setupNavbarVisibility();
      setupLogoutHandler();
    }, 0);
  })
  .catch((err) => console.error("Failed to load navbar:", err));

// Handle visibility of links based on user type
function setupNavbarVisibility() {
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");
  const adminLink = document.getElementById("admin-link");
  const galleryLink = document.getElementById("personal-gallery-link");

  // Default state – guest
  loginLink.classList.remove("hidden");
  logoutLink.classList.add("hidden");
  adminLink.classList.add("hidden");
  galleryLink.classList.add("hidden");

  if (window.CognitoUser) {
    // User is logged in
    loginLink.classList.add("hidden");
    logoutLink.classList.remove("hidden");
    galleryLink.classList.remove("hidden");

    if (window.CognitoUser.isAdmin) {
      adminLink.classList.remove("hidden");
    }
  }
}

// Handle logout click – removes token + reloads
function setupLogoutHandler() {
  const logoutBtn = document.getElementById("logout-link");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.cookie = "access_token=; path=/; max-age=0";
    window.location.reload();
  });
}
