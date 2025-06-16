// ==============================
// navbar-loader.js (מודול)
// ==============================

// ייבוא הפונקציה מ־login-handler
import { fetchUserStatus } from "./login-handler.js";

// טעינת הקובץ HTML לדיב
fetch("web components/navbar.html")
  .then((res) => res.text())
  .then(async (html) => {
    const container = document.getElementById("navbar-container");
    container.innerHTML = html;

    // ודא שה־DOM נטען לפני השלב הבא
    setTimeout(async () => {
      const user = await fetchUserStatus();
      setupNavbarVisibility(user);
      setupLogoutHandler();
    }, 0);
  })
  .catch((err) => console.error("❌ Failed to load navbar:", err));

// הצגת הכפתורים לפי סוג המשתמש
function setupNavbarVisibility(user) {
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");
  const adminLink = document.getElementById("admin-link");
  const galleryLink = document.getElementById("personal-gallery-link");
  const chatBubble = document.getElementById("gemini-bubble");

  // החבא הכל מראש
  [loginLink, logoutLink, adminLink, galleryLink, chatBubble].forEach((el) =>
    el?.classList.add("hidden")
  );

  // משתמש לא מחובר
  if (user.type === "guest") {
    loginLink?.classList.remove("hidden");
    return;
  }

  // משתמש רגיל או מנהל
  logoutLink?.classList.remove("hidden");
  galleryLink?.classList.remove("hidden");
  chatBubble?.classList.remove("hidden");

  // אם הוא אדמין
  if (user.type === "admin") {
    adminLink?.classList.remove("hidden");
  }
}

// ניהול התנתקות
function setupLogoutHandler() {
  const logoutBtn = document.getElementById("logout-link");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear(); // מוחק גם את הטוקן והמידע
    window.location.href = "/"; // חזרה לדף הבית
  });
}
