import { fetchUserStatus } from "./auth-api.js"; // ייבוא הפונקציה מהקובץ auth-api.js

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("navbar-container");

  try {
    // טוען את ה־HTML של ה־navbar
    const res = await fetch("web components/navbar.html");
    if (!res.ok) {
      throw new Error("Failed to load navbar HTML");
    }
    const html = await res.text();
    container.innerHTML = html;
  } catch (error) {
    console.error("Error loading navbar:", error);
    container.innerHTML =
      "<p>Error loading navbar. Please try again later.</p>";
    return;
  }

  const user = await fetchUserStatus(); // קריאה אסינכרונית ל־fetchUserStatus
  console.log("User Status:", user); // הדפסת הסטטוס של המשתמש

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
  }
});
