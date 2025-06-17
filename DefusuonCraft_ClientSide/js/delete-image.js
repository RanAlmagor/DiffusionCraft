// === Delete Image from DynamoDB and S3 via API ===

/**
 * Sends a DELETE request to the API to delete an image using query parameters.
 * @param {string} imageId - The ID of the image to delete.
 */
async function deleteImage(imageId) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userSub = userInfo.name;
  const isAdmin = userInfo.groups?.includes("Admins") || false;

  // Build URL with query parameters
  const url = new URL(
    "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/Personal"
  );
  url.searchParams.append("imageId", imageId);
  url.searchParams.append("userSub", userSub);
  url.searchParams.append("isAdmin", isAdmin);

  try {
    const response = await fetch(url.toString(), {
      method: "DELETE",
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
