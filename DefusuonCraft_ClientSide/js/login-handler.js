// ========================
// login-handler.js
// ========================

// Decode JWT payload
function decodeJwtPayload(token) {
  const payload = token.split(".")[1];
  const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(decoded);
}

// Extract tokens from URL and process user
function handleLoginRedirect() {
  const hash = window.location.hash.substring(1);
  if (!hash) return;

  const params = new URLSearchParams(hash);
  const idToken = params.get("id_token");
  const accessToken = params.get("access_token");

  if (idToken && accessToken) {
    const payload = decodeJwtPayload(idToken);
    const userInfo = {
      email: payload.email,
      name: payload.name || payload["cognito:username"] || "",
      username: payload["cognito:username"] || "",
      sub: payload.sub,
      groups: payload["cognito:groups"] || [],
      raw: payload,
    };

    localStorage.setItem("id_token", idToken);
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("isLoggedIn", "true");

    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// Logout function
function logoutUser() {
  localStorage.clear();
  window.location.reload();
}

// Redirect to Cognito login
function redirectToLogin() {
  const redirectUri =
    "https://diffusioncraft-client.s3.us-east-1.amazonaws.com/DefusuonCraft_ClientSide/index.html";

  const loginUrl =
    "https://us-east-1dnwmhmzpn.auth.us-east-1.amazoncognito.com/login" +
    "?client_id=3nnhk77f33vism7j0ou8o0oeka" +
    "&response_type=token" +
    "&scope=email+openid+profile" +
    "&redirect_uri=" +
    encodeURIComponent(redirectUri);

  window.location.href = loginUrl;
}

// Init
window.onload = () => {
  handleLoginRedirect();
};
