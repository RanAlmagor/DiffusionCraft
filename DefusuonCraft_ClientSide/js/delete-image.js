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

async function deleteImage(imageId) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userSub = userInfo.name;
  const isAdmin = userInfo.groups?.includes("Admins") || false;

  const url =
    "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/Personal";

  try {
    // שלח בקשת DELETE עם פרמטרים בגוף הבקשה
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId, userSub, isAdmin }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete image");
    }

    console.log("🗑️ Image deleted:", data);
    showToast("🗑️ Image deleted successfully!", "#00ff99", "✅"); // Success Toast
    return data;
  } catch (error) {
    console.error("❌ Error deleting image:", error.message);
    showToast("❌ Failed to delete image.", "#ff4f4f", "⚠️"); // Error Toast
    throw error;
  }
}
