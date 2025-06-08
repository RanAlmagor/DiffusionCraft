// js/navbar-loader.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("web components/navbar.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("navbar-container").innerHTML = html;

      // רק אחרי שה-navbar נטען לדף נטען גם את הסקריפט שמפעיל את ההסתרה / הצגה
      const script = document.createElement("script");
      script.src = "js/auth-handler.js";
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch((err) => {
      console.error("Failed to load navbar:", err);
    });
});
