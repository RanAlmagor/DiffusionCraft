// ========================
// navbar-loader.js
// ========================

window.addEventListener("load", async () => {
  try {
    const res = await fetch("web components/navbar.html");
    const html = await res.text();
    const container = document.getElementById("navbar-container");
    container.innerHTML = html;

    // הוספת השהייה קטנה כדי להבטיח שהטוקנים כבר הוזנו
    setTimeout(() => {
      setupNavbarVisibility();
      setupLogoutHandler();
    }, 50); // אפשר גם 100 אם צריך
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

  // ברירת מחדל: הצג כאילו לא מחובר
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
      userNameSpan.textContent = `👤 ${userInfo.name}`;
      userNameSpan.classList.remove("hidden");
    }
  }
}

function setupLogoutHandler() {
  const logoutBtn = document.getElementById("logout-link");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logoutUser(); // מוגדר ב-login-handler.js
  });
}
