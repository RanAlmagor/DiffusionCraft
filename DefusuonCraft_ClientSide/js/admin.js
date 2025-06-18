/****************  CONFIG  ****************/
const API_IMAGES =
  "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images";
const API_DOWNLOAD =
  "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/ImageUrl";
const PAGE_SIZE = 12;

let imagesCache = [];
let currentPage = 1;

/****************  HELPERS  ****************/
const unwrap = (obj, key) => (obj[key] && obj[key].S ? obj[key].S : obj[key]);
const badge = (status) => {
  const colors = {
    completed: "bg-green-600",
    pending: "bg-yellow-500",
    failed: "bg-red-600",
  };
  return `<span class="px-2 py-1 rounded text-xs text-white ${
    colors[status] || "bg-gray-600"
  }">${status}</span>`;
};

/****************  SECTION TOGGLE  ****************/
window.showSection = (id) => {
  ["user-management", "image-management"].forEach((sec) => {
    const el = document.getElementById(sec);
    if (el) el.classList.add("hidden");
  });
  const chosen = document.getElementById(id);
  if (chosen) chosen.classList.remove("hidden");
};

/****************  RENDER USERS (DEMO)  ****************/
const demoUsers = [
  { username: "John Doe", group: "Admin" },
  { username: "Jane Smith", group: "User" },
  { username: "Alice Johnson", group: "User" },
];

function renderUsers() {
  const tbody = document.getElementById("user-list");
  tbody.innerHTML = "";
  demoUsers.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.username}</td>
      <td>${u.group}</td>
      <td class="actions">
        <button class="btn edit-btn" onclick="editUser('${
          u.username
        }')"></button>
        ${
          u.group === "User"
            ? `<button class="btn delete-btn" onclick="deleteUser('${u.username}')"></button>`
            : ""
        }
      </td>`;
    tbody.appendChild(tr);
  });
}

function editUser(username) {
  alert("Edit user: " + username);
}
function deleteUser(username) {
  if (!confirm(`Delete user ${username}?`)) return;
  alert("Deleted " + username);
}

/****************  FETCH & RENDER IMAGES  ****************/
async function getImages() {
  const res = await fetch(API_IMAGES);
  if (!res.ok) throw new Error("Failed to fetch images");
  imagesCache = await res.json();
}

function renderPager() {
  const pager = document.getElementById("pager");
  pager.innerHTML = "";
  const total = Math.ceil(imagesCache.length / PAGE_SIZE);

  const mkBtn = (p, label, disabled) =>
    `<button ${
      disabled ? "disabled" : ""
    } onclick="renderPage(${p})">${label}</button>`;

  pager.insertAdjacentHTML(
    "beforeend",
    mkBtn(currentPage - 1, "← Prev", currentPage === 1)
  );
  pager.insertAdjacentHTML(
    "beforeend",
    `<span class="text-muted">Page ${currentPage}/${total}</span>`
  );
  pager.insertAdjacentHTML(
    "beforeend",
    mkBtn(currentPage + 1, "Next →", currentPage === total)
  );
}
function renderPage(page) {
  currentPage = page;
  const start = (page - 1) * PAGE_SIZE;
  const slice = imagesCache.slice(start, start + PAGE_SIZE);

  const tbody = document.getElementById("image-list");
  tbody.innerHTML = "";

  if (!slice.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-muted">No images found.</td></tr>`; // כאן נוסיף 8 עמודות במקום 7
  }

  slice.forEach((item) => {
    const id = unwrap(item, "imageId");
    const userSub = unwrap(item, "userSub");
    const prompt = unwrap(item, "prompt");
    const url = unwrap(item, "s3url");
    const created = unwrap(item, "createdAt");
    const status = unwrap(item, "status");
    const updatedAt = unwrap(item, "updatedAt"); // תאריך עדכון
    const dateStr = new Date(created).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updatedDateStr = updatedAt
      ? new Date(updatedAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Not updated yet"; // אם אין תאריך עדכון, נציג "לא עודכן"

    const tr = document.createElement("tr");
    tr.setAttribute("data-id", id);
    tr.setAttribute("data-user", userSub);

    tr.innerHTML = `
      <td><img src="${url}" alt="" /></td>
      <!-- הוספת מחלקת truncate לכל פרומפט שארוך מדי -->
      <td class="truncate" title="${prompt}" id="prompt-${id}">${prompt}</td>
      <td>${userSub}</td>
      <td>${dateStr}</td>
      <td>${updatedDateStr}</td> <!-- תאריך עדכון -->
      <td>${badge(status)}</td>
      <td class="actions">
        <button class="btn edit-btn" onclick="startEditPrompt('${id}', '${userSub}', \`${prompt}\`)"></button>
        <button class="btn zoom-btn" onclick="zoom('${url}')"></button>
        <button class="btn download-btn" onclick="downloadImg('${url}', \`${prompt}\`)"></button>
        <button class="btn delete-btn" onclick="deleteImg('${id}', '${userSub}')"></button>
      </td>`;
    tbody.appendChild(tr);
  });

  renderPager();
}

async function renderImages() {
  try {
    await getImages();
    renderPage(1);
  } catch (e) {
    alert(e.message);
  }
}

/****************  ACTIONS  ****************/
function showToast(message, color = "#00fff7", emoji = "🎉") {
  let toast = document.getElementById("toast-message");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-message";
    document.body.appendChild(toast);
  }

  toast.innerText = `${emoji} ${message}`;
  toast.style.color = color;
  toast.style.borderColor = color;
  toast.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function zoom(src) {
  const modal = document.getElementById("zoom-modal");
  document.getElementById("zoom-img").src = src;
  modal.classList.remove("hidden");
  modal.onclick = () => modal.classList.add("hidden");
}

async function downloadImg(s3url, prompt) {
  const imageKey = s3url?.split(".com/")[1];
  if (!imageKey) {
    alert("Invalid image URL");
    return;
  }

  const apiUrl = `${API_DOWNLOAD}?imageKey=${encodeURIComponent(imageKey)}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.downloadUrl) throw new Error("No download URL returned");

    const link = document.createElement("a");
    link.href = data.downloadUrl;
    link.download = (prompt || "ai-image").replace(/\s+/g, "_") + ".png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("❌ Failed to download image:", err);
    alert("Download failed.");
  }
}

async function deleteImg(imageId, userSub, isAdmin = false) {
  if (!confirm("❗ Are you sure you want to delete this image?")) return;

  try {
    const response = await fetch(
      "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/Personal",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId, userSub, isAdmin }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ Delete failed:", error);
      showToast("Failed to delete image.", "#ff4f4f", "❌");
      return;
    }

    const result = await response.json();
    console.log("✅ Image deleted:", result.message);

    // עדכון הטבלה בצד לקוח לאחר מחיקה
    const row = document.querySelector(`tr[data-id="${imageId}"]`);
    if (row) row.remove();

    showToast("Image deleted successfully!", "#00ff99", "🗑️");
  } catch (err) {
    console.error("❌ Delete failed:", err);
    showToast("Delete failed. Try again.", "#ff4f4f", "⚠️");
  }
}

function startEditPrompt(imageId, userSub, oldPrompt) {
  const td = document.getElementById(`prompt-${imageId}`);

  td.innerHTML = `
    <input type="text" id="input-${imageId}" value="${oldPrompt}" class="prompt-input" />
    <button class="btn" onclick="submitPromptEdit('${imageId}', '${userSub}')">💾</button>
  `;

  setTimeout(() => document.getElementById(`input-${imageId}`).focus(), 0);
}

function submitPromptEdit(imageId, userSub) {
  const input = document.getElementById(`input-${imageId}`);
  const newPrompt = input.value;

  const data = { imageId, userSub, newPrompt };
  console.log("📤 Sending update request:", data);

  fetch("https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`❌ ${res.status}`);
      return res.json();
    })
    .then((json) => {
      console.log("✅ Success:", json);
      // עדכון מיידי של הפרומפט
      document.getElementById(`prompt-${imageId}`).innerText = newPrompt;

      // עדכון התאריך בעמודה "Updated At"
      const updatedDate = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      const updatedCell = document.getElementById(`updated-${imageId}`);
      if (updatedCell) {
        updatedCell.innerText = updatedDate;
      }

      showToast("Prompt updated successfully!", "#00ff99", "💾");
    })
    .catch((err) => {
      console.error("❌ Update failed:", err);
      showToast("Failed to update image.", "#ff4f4f", "⚠️");
    });
}

/****************  INIT  ****************/
document.addEventListener("DOMContentLoaded", () => {
  renderUsers();
  renderImages();
  showSection("image-management");
});
