export async function fetchUserStatus() {
  try {
    const res = await fetch("http://localhost:8001/", {
      credentials: "include",
    });
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error("Failed to fetch user status:", err);
    return { type: "guest" };
  }
}

export async function logoutUser() {
  try {
    await fetch("http://localhost:8001/logout", {
      method: "GET",
      credentials: "include",
    });
    location.reload();
  } catch (err) {
    console.error("Logout failed:", err);
  }
}
