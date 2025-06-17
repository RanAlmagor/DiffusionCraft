async function deleteImage(imageId) {
  // שלוף את המידע על המשתמש (שם, קבוצת Admins וכו')
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userSub = userInfo.name;
  const isAdmin = userInfo.groups?.includes("Admins") || false;

  // יצירת URL עם פרמטרים
  const url = new URL(
    "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Images/Personal"
  );
  url.searchParams.append("imageId", imageId);
  url.searchParams.append("userSub", userSub);
  url.searchParams.append("isAdmin", isAdmin);

  try {
    // שלח בקשת DELETE
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // חשוב לציין את סוג התוכן
      },
    });

    // קבל את התשובה מהשרת
    const data = await response.json();

    if (!response.ok) {
      // אם יש שגיאה בשרת, שלח שגיאה
      throw new Error(data.error || "Failed to delete image");
    }

    console.log("🗑️ Image deleted:", data); // הצגת הצלחה בלוג
    return data; // החזר את התשובה
  } catch (error) {
    // אם יש שגיאה בקוד או בבקשה
    console.error("❌ Error deleting image:", error.message);
    throw error;
  }
}
