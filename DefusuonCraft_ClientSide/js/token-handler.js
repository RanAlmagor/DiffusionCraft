// === token-handler.js ===
// Handles access token from Cognito and stores it securely

(function () {
  // Step 1: Extract token from URL hash
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get("access_token");

  if (accessToken) {
    // Step 2: Store token in a secure cookie (non-HTTP only, since we are client-side)
    document.cookie = `access_token=${accessToken}; path=/; max-age=3600`;

    // Step 3: Clean the URL (remove the hash)
    window.history.replaceState(null, "", window.location.pathname);
  }

  // Step 4: Get token from cookie
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  if (!token) return;

  // Step 5: Parse JWT payload
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const groups = payload["cognito:groups"] || [];

    window.CognitoUser = {
      email: payload.email || null,
      groups: groups,
      isAdmin: groups.includes("Admins"),
      token: token,
    };
  } catch (err) {
    // Invalid token – clear it
    document.cookie = "access_token=; path=/; max-age=0";
    window.CognitoUser = null;
  }
})();
