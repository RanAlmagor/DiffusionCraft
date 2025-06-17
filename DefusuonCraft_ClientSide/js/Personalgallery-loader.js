document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");

  // Zoom modal elements
  const zoomModal = document.getElementById("zoom-modal");
  const zoomImage = document.getElementById("zoom-image");
  const zoomDescription = document.getElementById("zoom-description");
  const closeModalBtn = document.getElementById("close-modal");

  // Close the zoom modal
  closeModalBtn.addEventListener("click", () => {
    zoomModal.classList.add("hidden");
  });

  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userName = userInfo.name;

  if (!userName) {
    gallery.innerHTML = "<p>User not logged in.</p>";
    return;
  }

  const apiUrl = `https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/Personal?userName=${encodeURIComponent(
    userName
  )}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((images) => {
      if (!images.length) {
        gallery.innerHTML = "<p>No personal images found.</p>";
        return;
      }

      images.forEach((item, index) => {
        fetch("web components/image-card.html")
          .then((res) => res.text())
          .then((html) => {
            const temp = document.createElement("div");
            temp.innerHTML = html;
            const card = temp.firstElementChild;

            const img = card.querySelector("img");
            const userEl = card.querySelector(".image-user");
            const createdEl = card.querySelector(".image-created");
            const shareBtn = card.querySelector(".btn-share");
            const downloadBtn = card.querySelector(".btn-download");

            img.src = item.s3url || "#";
            img.alt = item.prompt || `AI Image ${index + 1}`;
            userEl.textContent = userName;
            createdEl.textContent = new Date(item.createdAt).toLocaleString();

            // 🖼️ Zoom logic
            img.style.cursor = "zoom-in";
            img.addEventListener("click", () => {
              zoomImage.src = item.s3url;
              zoomDescription.textContent = item.prompt || "No description";
              zoomModal.classList.remove("hidden");
            });

            // 💾 Download logic
            downloadBtn.addEventListener("click", () => {
              const imageKey = item.s3url?.split(".com/")[1];
              if (!imageKey) return;

              const downloadApi =
                "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/ImageUrl?imageKey=" +
                encodeURIComponent(imageKey);

              fetch(downloadApi)
                .then((res) => res.json())
                .then((data) => {
                  if (!data.downloadUrl)
                    throw new Error("No download URL returned");

                  const link = document.createElement("a");
                  link.href = data.downloadUrl;
                  link.download =
                    item.prompt?.replace(/\s+/g, "_") || "ai-image";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                })
                .catch((err) => {
                  console.error("❌ Download failed:", err);
                  alert("Download failed.");
                });
            });

            // 🚀 Share logic
            shareBtn.addEventListener("click", () => {
              if (navigator.share) {
                navigator
                  .share({
                    title: "My AI image",
                    text: item.prompt || "Generated with DefusionCraft",
                    url: img.src,
                  })
                  .catch((err) => console.error("Share failed:", err));
              } else {
                alert("Sharing is not supported on this browser.");
              }
            });

            // 🗑️ DELETE BUTTON (dynamic per personal gallery)
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn-delete";
            deleteBtn.title = "Delete image";
            deleteBtn.textContent = "🗑️";

            // Style for the delete button
            Object.assign(deleteBtn.style, {
              position: "absolute",
              top: "8px",
              right: "8px",
              border: "2px solid #00fff7",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              backgroundColor: "#0a0a0a",
              color: "#00fff7",
              cursor: "pointer",
              boxShadow: "0 0 8px #00fff744",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              zIndex: 10,
            });

            deleteBtn.addEventListener("mouseover", () => {
              deleteBtn.style.backgroundColor = "#00fff7";
              deleteBtn.style.color = "#0a0a0a";
            });

            deleteBtn.addEventListener("mouseout", () => {
              deleteBtn.style.backgroundColor = "#0a0a0a";
              deleteBtn.style.color = "#00fff7";
            });

            deleteBtn.addEventListener("click", async () => {
              const confirmDelete = confirm(
                "Are you sure you want to delete this image?"
              );
              if (!confirmDelete) return;

              try {
                await deleteImage(item.imageId); // this function should already exist globally
                card.remove();
              } catch (err) {
                alert("❌ Failed to delete image.");
                console.error(err);
              }
            });

            card.style.position = "relative";
            card.appendChild(deleteBtn);

            gallery.appendChild(card);
          });
      });
    })
    .catch((err) => {
      console.error("❌ Error loading personal images:", err);
      gallery.innerHTML =
        "<p style='color:red;'>Failed to load personal images.</p>";
    });
});
