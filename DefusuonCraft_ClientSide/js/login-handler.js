// =========================
// login-handler.js (צד לקוח)
// =========================

function getIdTokenFromUrl() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("id_token");
}

export async function fetchUserStatus() {
  const token = localStorage.getItem("id_token");
  const userInfo = localStorage.getItem("userInfo");

  if (!token || !userInfo) {
    return { type: "guest" };
  }

  const parsedUser = JSON.parse(userInfo);
  const isAdmin = parsedUser.groups?.includes("Admins");

  return {
    type: isAdmin ? "admin" : "user",
    ...parsedUser,
  };
}

async function verifyAndFetchUserInfo(idToken) {
  const apiUrl =
    "https://qw1foyfl98.execute-api.us-east-1.amazonaws.com/Prod/Auth";

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: idToken }),
  });

  if (!res.ok) {
    console.error("❌ אימות נכשל:", await res.text());
    return null;
  }

  const userInfo = await res.json();
  localStorage.setItem("id_token", idToken);
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
  localStorage.setItem("isLoggedIn", "true");
  return userInfo;
}

function logoutUser() {
  localStorage.clear();
  window.location.reload();
}

window.addEventListener("load", async () => {
  const idToken = getIdTokenFromUrl();

  if (idToken) {
    const userInfo = await verifyAndFetchUserInfo(idToken);
    if (userInfo) {
      console.log("✅ התחברות הצליחה:", userInfo);
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }
});
