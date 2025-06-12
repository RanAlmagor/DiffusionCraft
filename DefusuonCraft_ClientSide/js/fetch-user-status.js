export async function fetchUserStatus() {
  // === שלוף את הטוקן רק מה-URL ===
  let token = null;
  if (window.location.hash.includes("access_token")) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    token = params.get("access_token");

    // נקה את ה-URL מייד לאחר שליפה (למנוע דליפה)
    history.replaceState(null, "", window.location.pathname);
  }

  // אם אין טוקן – החזר כ־guest
  if (!token) {
    return { type: "guest" };
  }

  try {
    // שלח את הטוקן ל־Lambda לבדיקה
    const response = await fetch(
      "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Auth",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    const data = await response.json();
    return {
      type: data.isAdmin ? "admin" : "user",
      groups: data.groups,
    };
  } catch (err) {
    console.error("Error verifying token:", err);
    return { type: "guest" };
  }
}
