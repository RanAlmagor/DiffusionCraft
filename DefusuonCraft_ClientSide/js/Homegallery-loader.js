document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");

  // Zoom modal elements
  const zoomModal = document.getElementById("zoom-modal");
  const zoomImage = document.getElementById("zoom-image");
  const zoomDescription = document.getElementById("zoom-description");
  const closeModalBtn = document.getElementById("close-modal");

  // Close the zoom modal on button click
  closeModalBtn.addEventListener("click", () => {
    zoomModal.classList.add("hidden");
  });

  // Fetch images from API Gateway
  fetch("https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images")
    .then((res) => res.json())
    .then((data) => {
      const completedImages = data.filter(
        (item) => item.status === "completed"
      );

      if (completedImages.length === 0) {
        gallery.innerHTML = "<p>No completed images found.</p>";
        return;
      }

      // Loop through each completed image
      completedImages.forEach((item, index) => {
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

            // Set image details
            img.src = item.s3url || "#";
            img.alt = item.prompt || `AI Image ${index + 1}`;
            userEl.textContent = item.userSub || "Unknown";
            createdEl.textContent = new Date(item.createdAt).toLocaleString();

            // Zoom modal logic
            img.style.cursor = "zoom-in";
            img.addEventListener("click", () => {
              zoomImage.src = item.s3url;
              zoomDescription.textContent = item.prompt || "No description";
              zoomModal.classList.remove("hidden");
            });

            // Download logic
            downloadBtn.addEventListener("click", () => {
              const imageKey = item.s3url?.split(".com/")[1];
              if (!imageKey) return;

              const apiUrl =
                "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/ImageUrl?imageKey=" +
                encodeURIComponent(imageKey);

              fetch(apiUrl)
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
                  console.error("❌ Failed to download image:", err);
                  alert("Download failed.");
                });
            });

            // Share logic
            shareBtn.addEventListener("click", () => {
              if (navigator.share) {
                navigator
                  .share({
                    title: "Check out this AI image",
                    text: item.prompt || "Generated Image",
                    url: img.src,
                  })
                  .catch((err) => console.error("Share failed:", err));
              } else {
                alert("Sharing is not supported on this browser.");
              }
            });

            gallery.appendChild(card);
          });
      });
    })
    .catch((err) => {
      console.error("Failed to load images from API:", err);
      gallery.innerHTML =
        "<p style='color:red;'>Failed to load images from server.</p>";
    });
});
