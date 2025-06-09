import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langdetect import detect
import google.generativeai as genai
from typing import Optional


# Load environment variables
load_dotenv("secrets.env")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY in environment")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash-preview-05-20")  

# Start a persistent chat session
chat = model.start_chat(history=[])

# FastAPI router
router = APIRouter()

# Request and response schemas
class PromptRequest(BaseModel):
    prompt: str

class PromptResponse(BaseModel):
    reply: str
    intent: str
    suggested_prompt: Optional[str] = None
    confirm_required: bool = False

# Confirmation trigger phrases
CONFIRM_WORDS = {"yes", "confirm", "submit", "שלח", "אני בטוח"}

@router.post("/gemini/image-chat", response_model=PromptResponse)
async def gemini_image_chat(request: PromptRequest):
    user_input = request.prompt.strip()

    # Detect user language
    try:
        lang = detect(user_input)
    except:
        lang = "en"

    is_hebrew = lang == "he"

    # If the user confirmed, acknowledge and prepare for sending
    if user_input.lower() in CONFIRM_WORDS:
        return PromptResponse(
            reply="🎯 שולח את הפרומפט! בהצלחה ביצירה ✨" if is_hebrew else "🎯 Sending your prompt! Good luck creating ✨",
            intent="confirm",
            confirm_required=False
        )

    # Add system message only once
    if not chat.history:
        system_message = (
            "אתה עוזר אישי ידידותי ומוכשר שעוזר למשתמשים לנסח רעיונות לתמונות. "
            "מטרתך היא לשוחח בצורה נעימה, להציע פרומפטים מדויקים, "
            "ולשאול תמיד 'האם לשלוח את זה?' לפני שליחה."
            if is_hebrew else
            "You are a friendly and creative assistant that helps users craft prompts for AI image generation. "
            "Speak naturally, refine their ideas beautifully, and always ask: 'Shall I send this?'"
        )
        chat.send_message(system_message)

    # Send user input and get Gemini's response
    try:
        gemini_reply = chat.send_message(user_input)
        reply_text = gemini_reply.text.strip()

        return PromptResponse(
            reply=reply_text,
            intent="image",
            suggested_prompt=reply_text,
            confirm_required=True
        )

    except Exception as e:
        fallback = (
            "⚠️ קרתה שגיאה זמנית. נסה שוב בעוד רגע." if is_hebrew
            else "⚠️ A temporary error occurred. Please try again shortly."
        )
        raise HTTPException(status_code=500, detail=f"{fallback} (Details: {str(e)})")
