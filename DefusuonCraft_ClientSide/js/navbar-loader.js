import { fetchUserStatus } from "./fetch-user-status.js";

// Load navbar.html into #navbar-container
fetch("web components/navbar.html")
  .then((res) => res.text())
  .then(async (html) => {
    const container = document.getElementById("navbar-container");
    container.innerHTML = html;

    // Wait until DOM is updated
    setTimeout(async () => {
      const user = await fetchUserStatus();
      setupNavbarVisibility(user);
      setupLogoutHandler();
    }, 0);
  })
  .catch((err) => console.error("Failed to load navbar:", err));

// Handle visibility of links based on user status
function setupNavbarVisibility(user) {
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");
  const adminLink = document.getElementById("admin-link");
  const galleryLink = document.getElementById("personal-gallery-link");
  const chatBubble = document.getElementById("gemini-bubble");

  // Hide all links initially
  [loginLink, logoutLink, adminLink, galleryLink, chatBubble].forEach((el) =>
    el?.classList.add("hidden")
  );

  if (user.type === "guest") {
    loginLink?.classList.remove("hidden");
  } else {
    logoutLink?.classList.remove("hidden");
    galleryLink?.classList.remove("hidden");
    chatBubble?.classList.remove("hidden");

    if (user.type === "admin") {
      adminLink?.classList.remove("hidden");
    }
  }
}

// Handle logout – remove token and reload
function setupLogoutHandler() {
  const logoutBtn = document.getElementById("logout-link");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.cookie = "access_token=; path=/; max-age=0";
    window.location.reload();
  });
}
