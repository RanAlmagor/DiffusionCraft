document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");

  fetch("https://vwx6lrkyh4.execute-api.us-east-1.amazonaws.com/prod/Images")
    .then((res) => res.json())
    .then((data) => {
      const items = JSON.parse(data.body);
      const completedImages = items.filter(
        (item) => item.status === "completed"
      );

      if (completedImages.length === 0) {
        gallery.innerHTML = "<p>No completed images found.</p>";
        return;
      }

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

            img.src = item.s3url || "#";
            img.alt = item.prompt || `AI Image ${index + 1}`;
            userEl.textContent = item.userSub || "Unknown";
            createdEl.textContent = new Date(item.createdAt).toLocaleString();

            // ✅ Download button logic
            downloadBtn.addEventListener("click", () => {
              const imageKey = item.s3url?.split(".com/")[1];
              if (!imageKey) return;

              const apiUrl =
                "https://vwx6lrkyh4.execute-api.us-east-1.amazonaws.com/prod/Images/ImageUrl?imageKey=" +
                encodeURIComponent(imageKey);

              fetch(apiUrl)
                .then((res) => res.json())
                .then((data) => {
                  if (!data.downloadUrl) {
                    throw new Error("No download URL returned");
                  }

                  const link = document.createElement("a");
                  link.href = data.downloadUrl;
                  link.download =
                    (item.prompt?.replace(/\s+/g, "_") || "ai-image") + ".png";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                })
                .catch((err) => {
                  console.error("❌ Failed to download image:", err);
                  alert("Download failed.");
                });
            });

            // ✅ Share button logic
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
