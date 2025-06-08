// File: js/navbar-loader.js

document.addEventListener("DOMContentLoaded", () => {
  fetch("web components/navbar.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("navbar-container").innerHTML = html;
    });
});
