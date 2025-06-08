// js/navbar-loader.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("web components/navbar.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("navbar-container").innerHTML = html;

      // ✅ Load auth-handler.js only after navbar is injected
      const authScript = document.createElement("script");
      authScript.src = "js/auth-handler.js";
      authScript.defer = true;
      document.body.appendChild(authScript);
    })
    .catch((err) => {
      console.error("Failed to load navbar:", err);
    });
});
