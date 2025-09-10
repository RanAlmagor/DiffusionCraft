# 🖼️ Lambda Function: `GetUserPersonalImages`

**Description:**  
This Lambda function retrieves all images associated with a specific user (`userSub`) from the `Images` DynamoDB table using a GSI (Global Secondary Index) named `userSub-index`.

---

## 🔗 Endpoint

**Method:** `GET`  
**Path:** `/getImages?userName=<userSub>`

---

## 📥 Input Parameters (Query String)

| Parameter  | Type   | Required | Description                         |
|------------|--------|----------|-------------------------------------|
| `userName` | string | ✅        | Cognito User Sub identifying the user |

**Example Request:**
```http
GET /getImages?userName=user-abc123
```

---

## 📤 Output Format

```json
{
  "images": [
    {
      "imageId": "img-01HX123",
      "url": "https://...",
      "prompt": "A fox in the forest",
      "created": "2025-06-25T12:34:56Z"
    }
  ]
}
```

---

## ❌ Error Responses

| Code | Message             | When                          |
|------|---------------------|-------------------------------|
| 400  | "Missing userName"  | Query string parameter missing |
| 500  | "Failed to fetch"   | DynamoDB query or internal error |

---

## 🧭 Who Calls This?

- Frontend (personal gallery view)
- Admin tools (view user history)

## 🧪 Who Does It Call?

- **Amazon DynamoDB** – `query` using GSI `userSub-index` on the `Images` table

---

## 📝 Notes

- Supports CORS for:
  - `https://diffusioncraft-client.s3.us-east-1.amazonaws.com`
- Uses `GET` method with `queryStringParameters`
- Can return an empty `images` list if user has no entries

