# 🚀 Lambda Function: `sendPromptToQueue`

**Description:**  
This Lambda function receives a user prompt and style, generates a unique `imageId`, pushes the data to an Amazon SQS queue, and creates a new record in DynamoDB with `status: pending`.

---

## 🔗 Endpoint

**Method:** `POST`  
**Path:** `/sendPrompt`

---

## 📥 Input Parameters

| Parameter  | Type   | Required | Description                                |
|------------|--------|----------|--------------------------------------------|
| `prompt`   | string | ✅        | Textual prompt provided by the user        |
| `style`    | string | ✅        | The visual style for the image (e.g. "anime") |
| `userSub`  | string | ✅        | Cognito User Sub identifier                |

**Example Request:**
```json
{
  "prompt": "A futuristic city at night",
  "style": "cyberpunk",
  "userSub": "user-abc123"
}
```

---

## 📤 Output Format

```json
{
  "status": "success",
  "imageId": "img-01HX7ABCDEFG89XYZ"
}
```

---

## ❌ Error Responses

| Code | Message                   | When                                   |
|------|---------------------------|----------------------------------------|
| 400  | "Missing required fields" | One or more input fields are missing   |
| 500  | "Failed to enqueue"       | Internal error sending to SQS or writing to DynamoDB |

---

## 🧭 Who Calls This?

- Frontend chat interface (`chat-loader.js` or form submit)

## 🧪 Who Does It Call?

- **Amazon SQS**: Sends the prompt and metadata to a queue (`DiffusionPromptQueue`)  
- **Amazon DynamoDB**: Inserts a new image record in the `Images` table

---

## 📝 Notes

- This Lambda supports CORS for:
  - `https://diffusioncraft-client.s3.us-east-1.amazonaws.com`
- Uses `uuid4` to generate a unique `imageId`
- Sets initial DynamoDB status to `"pending"` until the image is created by a worker

