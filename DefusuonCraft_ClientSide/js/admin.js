/* ----------  DATA  ---------- */
const users = [
  { username: "John Doe", group: "Admin" },
  { username: "Jane Smith", group: "User" },
  { username: "Alice Johnson", group: "User" },
];

const images = [
  { name: "image1.jpg", date: "2025-06-01" },
  { name: "image2.jpg", date: "2025-06-02" },
  { name: "image3.jpg", date: "2025-06-03" },
];

/* ----------  SECTION TOGGLE  ---------- */
window.showSection = function (id) {
  ["user-management", "image-management"].forEach((sec) => {
    const el = document.getElementById(sec);
    if (el) el.classList.add("hidden");
  });
  const chosen = document.getElementById(id);
  if (chosen) chosen.classList.remove("hidden");
};

/* ----------  RENDERING  ---------- */
function renderUsers() {
  const tbody = document.getElementById("user-list");
  tbody.innerHTML = "";
  users.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-gray-300">${u.username}</td>
      <td class="text-gray-300">${u.group}</td>
      <td>
        <button class="bg-blue-500 text-white">Edit</button>
        ${
          u.group === "User"
            ? '<button class="bg-red-500 text-white ml-2">Delete</button>'
            : ""
        }
      </td>`;
    tbody.appendChild(tr);
  });
}

function renderImages() {
  const tbody = document.getElementById("image-list");
  tbody.innerHTML = "";
  images.forEach((img) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-gray-300">${img.name}</td>
      <td class="text-gray-300">${img.date}</td>
      <td><button class="bg-red-500 text-white">Delete</button></td>`;
    tbody.appendChild(tr);
  });
}

/* ----------  INIT  ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderUsers();
  renderImages();
  showSection("user-management"); // ברירת-מחדל
});
