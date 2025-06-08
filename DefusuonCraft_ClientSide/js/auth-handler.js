document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    window.history.replaceState({}, document.title, "/");
    location.reload();
    return;
  }

  fetch("http://localhost:8001/", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      const user = data.user;

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

        // ✅ Load chat dynamically only for logged-in users
        const script = document.createElement("script");
        script.src = "js/chat-loader.js";
        script.defer = true;
        document.body.appendChild(script);
      }

      logoutLink?.addEventListener("click", (e) => {
        e.preventDefault();
        fetch("http://localhost:8001/logout", {
          method: "GET",
          credentials: "include",
        }).then(() => location.reload());
      });
    })
    .catch((err) => {
      console.error("Auth check failed", err);
    });
});
