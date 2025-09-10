# 🧠 Lambda Function: `GeminiChatLambda`

**Description:**  
This Lambda function receives a user's text prompt, sends it to the Google Gemini model via HTTP request, and returns the AI-generated response.

---

## 🔗 Endpoint

**Method:** `POST`  
**Path:** `/chatGemini`

---

## 📥 Input Parameters

| Parameter | Type   | Required | Description                       |
|-----------|--------|----------|-----------------------------------|
| `prompt`  | string | ✅        | The text input from the user      |

**Example Request:**
```json
{
  "prompt": "Give me an idea for a sci-fi scene"
}
```

---

## 📤 Output Format

```json
{
  "reply": "Imagine a glowing portal opening in the middle of Times Square."
}
```

---

## ❌ Error Responses

| Code | Message             | Condition                            |
|------|---------------------|--------------------------------------|
| 400  | "Missing prompt"    | Prompt field is missing from request |
| 500  | "Gemini API failed" | Failure communicating with Gemini API |

---

## 🧭 Who Calls This?

- Frontend chat interface (`chat-loader.js`)

## 🧪 Who Does It Call?

- Gemini API (`v1beta/models/gemini-1.5-flash:generateContent`)

---

## 📝 Notes

- This function supports CORS for:
  - `https://diffusioncraft-client.s3.us-east-1.amazonaws.com`
  - `http://localhost:3000`
- The Gemini API Key is securely loaded via the environment variable: `GEMINI_API_KEY`
