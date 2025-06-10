// פונקציה שבודקת את מצב המשתמש - מחובר או guest
export async function fetchUserStatus() {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="));
  const accessToken = token ? token.split("=")[1] : null;

  console.log("Access token from cookies:", accessToken); // הדפסת הטוקן מהעוגיה

  if (!accessToken) {
    console.log("No access token found, user is a guest."); // אם אין טוקן, הודעה ברורה
    return { type: "guest" }; // החזר אורח
  }

  try {
    const response = await fetch("http://localhost:8000/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`, // שליחה של הטוקן לשרת
      },
    });

    const data = await response.json();
    console.log("User data from server:", data); // הדפסת המידע מהשרת

    if (response.ok) {
      console.log("User successfully authenticated:", data.user); // אם ההתחברות הצליחה
      return data.user; // החזרת המידע על המשתמש
    } else {
      console.log("Server response indicates failure, returning guest."); // אם התגובה לא תקינה
      return { type: "guest" }; // אם התגובה לא תקינה, החזר אורח
    }
  } catch (error) {
    console.error("Error fetching user status:", error); // הדפסת שגיאה
    return { type: "guest" }; // אם יש שגיאה, החזר אורח
  }
}

// פונקציה לשמירת הטוקן בעוגיה
export async function setLoginCookie(accessToken) {
  document.cookie = `access_token=${accessToken}; path=/; secure; HttpOnly; SameSite=Strict`;
  console.log("Access token saved to cookie:", accessToken); // הדפסת הטוקן
  console.log("Token saved successfully. User is logged in."); // הודעת הצלחה
}

// פונקציה לביצוע יציאה (logout)
export async function logoutUser() {
  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; HttpOnly; SameSite=Strict";
  console.log("User logged out. Access token removed from cookies."); // הודעת הצלחה
  window.location.href = "http://localhost:5500/"; // הפניית המשתמש לדף הבית
}
