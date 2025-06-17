async function deleteImage(imageId) {
  // שלוף את המידע על המשתמש
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
    return data;
  } catch (error) {
    console.error("❌ Error deleting image:", error.message);
    throw error;
  }
}
