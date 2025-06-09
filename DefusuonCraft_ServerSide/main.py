from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from jose import jwt as jose_jwt, jwk
from jose.utils import base64url_decode
from urllib.parse import quote
import httpx
import requests
import base64
import os

from AiChat import router as gemini_router  # Import Gemini router

load_dotenv("secrets.env")

app = FastAPI()

# CORS for frontend (port 5500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include Gemini image prompt API
app.include_router(gemini_router)

# === Cognito Configuration ===
REGION = "us-east-1"
USER_POOL_ID = "us-east-1_Wdjdde8sJ"
COGNITO_DOMAIN = "https://us-east-1wdjdde8sj.auth.us-east-1.amazoncognito.com"
CLIENT_ID = "340veg7vfq5qnjo86v1hpp16fe"
CLIENT_SECRET = os.getenv("COGNITO_CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8000/callback"

TOKEN_URL = f"{COGNITO_DOMAIN}/oauth2/token"
JWKS_URL = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"
ISSUER = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}"

# Load public keys once
jwks = requests.get(JWKS_URL).json()["keys"]

# Token verification
def verify_jwt_token(token: str):
    headers = jose_jwt.get_unverified_header(token)
    kid = headers["kid"]
    key = next((k for k in jwks if k["kid"] == kid), None)
    if not key:
        raise Exception("Public key not found")
    public_key = jwk.construct(key)
    message, encoded_signature = str(token).rsplit(".", 1)
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))
    if not public_key.verify(message.encode("utf-8"), decoded_signature):
        raise Exception("Signature verification failed")
    claims = jose_jwt.decode(
        token,
        public_key.to_pem().decode("utf-8"),
        algorithms=["RS256"],
        audience=CLIENT_ID,
        issuer=ISSUER,
    )
    return claims

# === Routes ===

@app.get("/")
def home(request: Request):
    token = request.cookies.get("access_token")
    if token:
        try:
            payload = verify_jwt_token(token)
            groups = payload.get("cognito:groups", [])
            user_type = "admin" if "Admins" in groups else "user"
            return JSONResponse({
                "message": "✅ Logged in",
                "user": {
                    "email": payload.get("email"),
                    "groups": groups,
                    "type": user_type,
                    "sub": payload.get("sub")
                }
            })
        except Exception as e:
            return JSONResponse({"message": f"⚠️ Invalid token: {str(e)}", "user": {"type": "guest"}}, status_code=401)
    return JSONResponse({"message": "🔓 Not logged in", "user": {"type": "guest"}})

@app.get("/login")
def login():
    encoded_redirect = quote(REDIRECT_URI, safe="")
    login_url = (
        f"{COGNITO_DOMAIN}/login?response_type=code&client_id={CLIENT_ID}"
        f"&redirect_uri={encoded_redirect}&scope=email+openid+profile"
    )
    return RedirectResponse(login_url)

@app.get("/callback")
async def callback(code: str):
    basic_auth = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Basic {basic_auth}"
    }
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(TOKEN_URL, data=data, headers=headers)

        if res.status_code != 200:
            error_detail = await res.aread()
            return JSONResponse({
                "error": "Token exchange failed",
                "detail": error_detail.decode()
            }, status_code=500)

        tokens = res.json()
        access_token = tokens.get("access_token")
        if not access_token:
            return JSONResponse({"error": "Failed to retrieve access token"}, status_code=400)

        response = RedirectResponse("http://localhost:5500/")
        response.set_cookie(key="access_token", value=access_token, httponly=True)
        return response

@app.get("/logout")
def logout():
    response = RedirectResponse("http://localhost:5500/")
    response.delete_cookie("access_token")
    return response
