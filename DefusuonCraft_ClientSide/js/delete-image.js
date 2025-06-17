// === Delete Image from DynamoDB and S3 via API ===

async function deleteImage(imageId) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userSub = userInfo.name;
  const isAdmin = userInfo.groups?.includes("Admins") || false;

  try {
    const response = await fetch(
      "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/DeleteImage",
      {
        method: "POST", // Lambda is using POST even for delete behavior
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId: imageId,
          userSub: userSub,
          isAdmin: isAdmin,
        }),
      }
    );

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
