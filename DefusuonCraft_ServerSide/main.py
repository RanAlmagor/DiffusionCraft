from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import httpx
import base64
import os
from jose import jwt as jose_jwt, jwk
from jose.utils import base64url_decode

# טעינת משתנים מקובץ .env
load_dotenv("secrets.env")

app = FastAPI()

# הגדרת CORS - מאפשר גישה רק מכתובת 5500 (הדפדפן שלך)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500"],  # הכתובת שהדפדפן מתחבר ממנה
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === הגדרות Cognito ===
REGION = "us-east-1"
USER_POOL_ID = "us-east-1_Wdjdde8sJ"
COGNITO_DOMAIN = "https://us-east-1wdjdde8sj.auth.us-east-1.amazoncognito.com"
CLIENT_ID = "340veg7vfq5qnjo86v1hpp16fe"
CLIENT_SECRET = os.getenv("COGNITO_CLIENT_SECRET")  # סוד הלקוח שנשמר בקובץ .env
REDIRECT_URI = "http://localhost:8000/callback"
TOKEN_URL = f"{COGNITO_DOMAIN}/oauth2/token"
JWKS_URL = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"
ISSUER = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}"

# === פונקציה כדי לקבל את המפתחות הציבוריים של Cognito ===
async def get_jwks():
    """
    פונקציה אסינכרונית שמביאה את המפתחות הציבוריים של Cognito
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(JWKS_URL)
        return response.json()["keys"]  # מחזירה את המפתחות הציבוריים

# === פונקציה לאימות טוקן JWT ===
async def verify_jwt_token(token: str):
    """
    פונקציה שבודקת אם הטוקן שנשלח מהלקוח תקין ומחזירה את התוכן (payload) אם הוא תקין
    """
    jwks = await get_jwks()  # מקבלת את המפתחות הציבוריים מ-Cognito
    headers = jose_jwt.get_unverified_header(token)  # מקבלת את כותרת ה-JWT (header)
    kid = headers["kid"]  # מזהה המפתח (key ID) שנמצא בכותרת

    # מוצאת את המפתח המתאים למזהה kid מתוך המפתחות הציבוריים
    key = next((k for k in jwks if k["kid"] == kid), None)
    if not key:
        raise Exception("Public key not found")  # אם לא נמצא מפתח מתאים

    public_key = jwk.construct(key)  # בונה את המפתח הציבורי
    message, encoded_signature = str(token).rsplit(".", 1)  # מפצל את ה-JWT
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))  # מפענח את החתימה

    if not public_key.verify(message.encode("utf-8"), decoded_signature):  # בודק אם החתימה תקינה
        raise Exception("Signature verification failed")

    # פיענוח ה-token והחזרת התוכן (payload)
    claims = jose_jwt.decode(
        token,
        public_key.to_pem().decode("utf-8"),
        algorithms=["RS256"],
        audience=CLIENT_ID,  # הקהל (audience) צריך להיות ה-CLIENT_ID שלך
        issuer=ISSUER,  # המנפיק (issuer) צריך להיות ה-ISSUER שלך
    )
    return claims

# === ראוטים ===
@app.get("/callback")
async def callback(code: str):
    """
    פונקציה שמטפלת בקוד ההחזרה אחרי התחברות ב-Cognito, מחליפה אותו בטוקן
    """
    basic_auth = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Basic {basic_auth}"  # שליחת סיסמה עם client_id
    }

    data = {
        "grant_type": "authorization_code",
        "code": code,  # הקוד שמתקבל מ-Cognito
        "redirect_uri": REDIRECT_URI,  # הכתובת אליה יופנה המשתמש אחרי ההתחברות
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(TOKEN_URL, data=data, headers=headers)

        # אם בקשת ההחלפה לא הצליחה
        if res.status_code != 200:
            error_detail = await res.aread()
            return JSONResponse({
                "error": "Token exchange failed",
                "detail": error_detail.decode()
            }, status_code=500)

        tokens = res.json()
        access_token = tokens.get("access_token")  # מקבל את ה-token
        if not access_token:
            return JSONResponse({"error": "Failed to retrieve access token"}, status_code=400)

        # שמירת הטוקן בעוגיה
        response = RedirectResponse("http://localhost:5500/")  # הפניית המשתמש לדף הבית
        response.set_cookie(key="access_token", value=access_token, httponly=True)  # שמירה בעוגיה עם HttpOnly
        return response

@app.get("/logout")
def logout():
    """
    פונקציה שמתבצעת כאשר המשתמש לוחץ על יציאה
    """
    response = RedirectResponse("http://localhost:5500/")  # הפניית המשתמש לדף הבית
    response.delete_cookie("access_token")  # מחיקת הטוקן מהעוגיה
    return response

@app.get("/status")
async def status(request: Request):
    """
    פונקציה בודקת את הסטטוס של המשתמש (מחובר/אורח)
    """
    token = request.cookies.get("access_token")  # בודק אם יש טוקן בעוגיה

    if not token:
        return JSONResponse({
            "message": "Welcome, guest",
            "user": {"type": "guest"}
        })

    try:
        payload = await verify_jwt_token(token)  # אם יש טוקן, מאמתים אותו
        groups = payload.get("cognito:groups", [])  # קבוצות המשתמש ב-Cognito
        user_type = "admin" if "Admins" in groups else "user"  # אם הוא מנהל או משתמש רגיל
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
