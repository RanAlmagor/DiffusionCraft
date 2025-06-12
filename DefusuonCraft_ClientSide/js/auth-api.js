// js/auth-api.js

export async function fetchUserStatus() {
  try {
    const res = await fetch("https://<API_ID>.execute-api.us-east-1.amazonaws.com/Prod/status", {
      method: "GET",
      credentials: "include"  // כדי שה-cookie יישלח
    });

    if (!res.ok) return { type: "guest" };

    const data = await res.json();
    return {
      email: data.email,
      sub: data.sub,
      groups: data.groups,
      type: data.groups.includes("Admins") ? "admin" : "user"
    };
  } catch (err) {
    console.error("Error fetching status:", err);
    return { type: "guest" };
  }
}
