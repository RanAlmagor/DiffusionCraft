document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userSub = userInfo.sub;

  if (!userSub) {
    gallery.innerHTML = "<p>User not logged in.</p>";
    return;
  }

  const apiUrl = `https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/Personal?userSub=${encodeURIComponent(
    userSub
  )}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((images) => {
      if (!images.length) {
        gallery.innerHTML = "<p>No images found.</p>";
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
            userEl.textContent = "You";
            createdEl.textContent = new Date(item.createdAt).toLocaleString();

            // --- Download Logic ---
            downloadBtn.addEventListener("click", () => {
              const imageKey = item.s3url?.split(".com/")[1];
              if (!imageKey) return;

              const downloadApi =
                "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/ImageUrl?imageKey=" +
                encodeURIComponent(imageKey);

              fetch(downloadApi)
                .then((res) => res.json())
                .then((data) => {
                  if (!data.downloadUrl) throw new Error("No download URL");

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

            // --- Share Logic ---
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
