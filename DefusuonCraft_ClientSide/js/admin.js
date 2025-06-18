/****************  CONFIG  ****************/
const API_IMAGES =
  "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images";
const API_DOWNLOAD =
  "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/ImageUrl";
const PAGE_SIZE = 12;

let imagesCache = [];
let filteredCache = [];
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
    document.getElementById(sec)?.classList.add("hidden");
  });
  document.getElementById(id)?.classList.remove("hidden");
};
document.getElementById("link-users").addEventListener("click", () => {
  showSection("user-management");
});
document.getElementById("link-images").addEventListener("click", () => {
  showSection("image-management");
});

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
  alert("Edit: " + username);
}
function deleteUser(username) {
  if (!confirm(`Delete ${username}?`)) return;
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
  const total = Math.ceil(filteredCache.length / PAGE_SIZE);
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
  const slice = filteredCache.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById("image-list");
  tbody.innerHTML = slice.length
    ? slice
        .map((item) => {
          const id = unwrap(item, "imageId");
          const userSub = unwrap(item, "userSub");
          const prompt = unwrap(item, "prompt");
          const url = unwrap(item, "s3url");
          const created = new Date(unwrap(item, "createdAt")).toLocaleString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }
          );
          const updatedAt = unwrap(item, "updatedAt");
          const updatedStr = updatedAt
            ? new Date(updatedAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Not updated yet";
          return `
          <tr data-id="${id}">
            <td><img src="${url}" alt="" /></td>
            <td class="truncate" title="${prompt}" id="prompt-${id}">${prompt}</td>
            <td>${userSub}</td>
            <td>${created}</td>
            <td>${updatedStr}</td>
            <td>${badge(unwrap(item, "status"))}</td>
            <td class="actions">
              <button class="btn edit-btn" onclick="startEditPrompt('${id}','${userSub}',\`${prompt}\`)"></button>
              <button class="btn zoom-btn" onclick="zoom('${url}')"></button>
              <button class="btn download-btn" onclick="downloadImg('${url}',\`${prompt}\`)"></button>
              <button class="btn delete-btn" onclick="deleteImg('${id}','${userSub}')"></button>
            </td>
          </tr>`;
        })
        .join("")
    : `<tr><td colspan="8" class="text-muted">No images found.</td></tr>`;
  renderPager();
}
async function renderImages() {
  try {
    await getImages();
    filteredCache = imagesCache.slice();
    renderPage(1);
  } catch (e) {
    alert(e.message);
  }
}

/****************  TOAST & MODALS  ****************/
function showToast(msg, color = "#00b8d8", emoji = "🎉") {
  let toast = document.getElementById("toast-message");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-message";
    document.body.appendChild(toast);
  }
  toast.innerText = `${emoji} ${msg}`;
  toast.style.color = color;
  toast.style.borderColor = color;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}
function zoom(src) {
  const m = document.getElementById("zoom-modal");
  document.getElementById("zoom-img").src = src;
  m.classList.remove("hidden");
  m.onclick = () => m.classList.add("hidden");
}

/****************  IMAGE ACTIONS  ****************/
async function downloadImg(s3url, prompt) {
  const key = s3url.split(".com/")[1];
  if (!key) return alert("Invalid URL");
  const res = await fetch(
    `${API_DOWNLOAD}?imageKey=${encodeURIComponent(key)}`
  );
  const data = await res.json();
  if (!data.downloadUrl) return alert("Download failed");
  const a = document.createElement("a");
  a.href = data.downloadUrl;
  a.download = (prompt || "ai-image").replace(/\s+/g, "_") + ".png";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
async function deleteImg(id, user) {
  if (!confirm("Delete?")) return;
  const res = await fetch(
    "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/Personal",
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: id, userSub: user }),
    }
  );
  if (!res.ok) return showToast("Delete failed", "var(--color-danger)", "❌");
  document.querySelector(`tr[data-id="${id}"]`).remove();
  showToast("Deleted!", "#00ff99", "🗑️");
}

/****************  EDIT PROMPT  ****************/
function startEditPrompt(id, user, old) {
  const td = document.getElementById(`prompt-${id}`);
  td.innerHTML = `
    <input type="text" id="input-${id}" value="${old}" class="prompt-input" />
    <button class="btn" onclick="submitPromptEdit('${id}','${user}')">💾</button>
  `;
  setTimeout(() => document.getElementById(`input-${id}`).focus(), 0);
}
function submitPromptEdit(id, user) {
  const newPrompt = document.getElementById(`input-${id}`).value;
  fetch(API_IMAGES, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageId: id, userSub: user, newPrompt }),
  })
    .then((r) => r.json())
    .then((_) => {
      renderImages();
      showToast("Prompt updated", "var(--color-primary)", "💾");
    })
    .catch((_) => showToast("Update failed", "var(--color-danger)", "❌"));
}

/****************  FILTER PANEL  ****************/
const promptInput = document.getElementById("filter-prompt");
const userInput = document.getElementById("filter-user");
const statusInput = document.getElementById("filter-status");
const createdFrom = document.getElementById("filter-created-from");
const createdTo = document.getElementById("filter-created-to");
const updatedFrom = document.getElementById("filter-updated-from");
const updatedTo = document.getElementById("filter-updated-to");

function applyFilters() {
  const term = promptInput.value.toLowerCase();
  const usr = userInput.value.toLowerCase();
  const stat = statusInput.value;
  const cF = createdFrom.value,
    cT = createdTo.value;
  const uF = updatedFrom.value,
    uT = updatedTo.value;

  filteredCache = imagesCache.filter((item) => {
    const p = unwrap(item, "prompt").toLowerCase();
    const u = unwrap(item, "userSub").toLowerCase();
    const s = unwrap(item, "status");
    const cr = new Date(unwrap(item, "createdAt"));
    const up = unwrap(item, "updatedAt")
      ? new Date(unwrap(item, "updatedAt"))
      : null;

    if (term && !p.includes(term)) return false;
    if (usr && !u.includes(usr)) return false;
    if (stat && s !== stat) return false;
    if (cF && cr < new Date(cF)) return false;
    if (cT && cr > new Date(cT)) return false;
    if (uF && (!up || up < new Date(uF))) return false;
    if (uT && (!up || up > new Date(uT))) return false;
    return true;
  });

  renderPage(1);
}

// debounce
function debounce(fn, ms = 200) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}
const debounced = debounce(applyFilters);
[promptInput, userInput].forEach((el) =>
  el.addEventListener("input", debounced)
);
statusInput.addEventListener("change", applyFilters);
[createdFrom, createdTo, updatedFrom, updatedTo].forEach((el) =>
  el.addEventListener("change", applyFilters)
);

// clear filters
document.getElementById("clear-filters").addEventListener("click", () => {
  [
    promptInput,
    userInput,
    statusInput,
    createdFrom,
    createdTo,
    updatedFrom,
    updatedTo,
  ].forEach((el) => (el.value = ""));
  applyFilters();
});

/****************  INIT  ****************/
document.addEventListener("DOMContentLoaded", () => {
  renderUsers();
  renderImages();
  showSection("image-management");
});
