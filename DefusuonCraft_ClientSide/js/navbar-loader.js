// ========================
// navbar-loader.js
// ========================

window.addEventListener("load", async () => {
  try {
    const res = await fetch("web components/navbar.html");
    const html = await res.text();
    const container = document.getElementById("navbar-container");
    container.innerHTML = html;

    // השהייה קלה לוודא טעינה לפני טיפול
    setTimeout(() => {
      setupNavbarVisibility();
      setupLogoutHandler();
      setupSidebarToggle(); // ✅ נוספה תמיכה במובייל
    }, 50);
  } catch (err) {
    console.error("❌ Failed to load navbar:", err);
  }
});

function setupNavbarVisibility() {
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");
  const adminLink = document.getElementById("admin-link");
  const galleryLink = document.getElementById("personal-gallery-link");
  const userNameSpan = document.getElementById("user-name");

  // ברירת מחדל - הסתרה
  loginLink?.classList.remove("hidden");
  logoutLink?.classList.add("hidden");
  adminLink?.classList.add("hidden");
  galleryLink?.classList.add("hidden");
  userNameSpan?.classList.add("hidden");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  if (isLoggedIn && userInfo) {
    loginLink?.classList.add("hidden");
    logoutLink?.classList.remove("hidden");
    galleryLink?.classList.remove("hidden");

    if (userInfo.groups?.includes("Admins")) {
      adminLink?.classList.remove("hidden");
    }

    if (userNameSpan && userInfo.name) {
      userNameSpan.textContent = `Welcome, ${userInfo.name} 👤`;
      userNameSpan.classList.remove("hidden");
    }
  }
}

// ✅ פונקציית התנתקות מלאה – ניקוי ואדום ל־Cognito logout
function logoutUser() {
  localStorage.clear();

  const logoutUrl =
    "https://us-east-1dnwmhmzpn.auth.us-east-1.amazoncognito.com/logout" +
    "?client_id=3nnhk77f33vism7j0ou8o0oeka" +
    "&logout_uri=" +
    encodeURIComponent(
      "https://diffusioncraft-client.s3.us-east-1.amazonaws.com/DefusuonCraft_ClientSide/index.html"
    );

  window.location.href = logoutUrl;
}

function setupLogoutHandler() {
  const logoutBtn = document.getElementById("logout-link");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logoutUser();
  });
}

function setupSidebarToggle() {
  const toggleBtn = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    toggleBtn.textContent = sidebar.classList.contains("open") ? "✖" : "☰";
  });
}

document.addEventListener("DOMContentLoaded", setupSidebarToggle);
