// File: js/navbar-loader.js
import { fetchUserStatus, logoutUser } from "./auth-api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("navbar-container");

  // טען את ה־HTML של ה־navbar
  const res = await fetch("web components/navbar.html");
  const html = await res.text();
  container.innerHTML = html;

  // רק אחרי שה־HTML נטען, אפשר לגשת לאלמנטים שבו
  const user = await fetchUserStatus();

  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");
  const adminLink = document.getElementById("admin-link");
  const galleryLink = document.getElementById("personal-gallery-link");

  if (user.type === "guest") {
    loginLink?.classList.remove("hidden");
    logoutLink?.classList.add("hidden");
    galleryLink?.classList.add("hidden");
    adminLink?.classList.add("hidden");
  } else {
    loginLink?.classList.add("hidden");
    logoutLink?.classList.remove("hidden");
    galleryLink?.classList.remove("hidden");

    if (user.type === "admin") {
      adminLink?.classList.remove("hidden");
    } else {
      adminLink?.classList.add("hidden");
    }

    // טען את צ'אט ג'מיני רק למשתמשים מחוברים
    const chatScript = document.createElement("script");
    chatScript.src = "js/chat-loader.js";
    chatScript.defer = true;
    document.body.appendChild(chatScript);
  }

  logoutLink?.addEventListener("click", async (e) => {
    e.preventDefault();
    await logoutUser();
  });
});
