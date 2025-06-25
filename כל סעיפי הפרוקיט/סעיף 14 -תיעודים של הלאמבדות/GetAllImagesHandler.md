# 🌐 Lambda Function: `GetAllImagesHandler`

**Description:**  
This Lambda function retrieves all image records from the `Images` DynamoDB table that have a status of `"completed"`. It is used for global gallery views such as public feeds or admin dashboards.

---

## 🔗 Endpoint

**Method:** `GET`  
**Path:** `/getAllImages`

---

## 📥 Input Parameters

None – this endpoint returns all publicly completed images.

---

## 📤 Output Format

```json
{
  "images": [
    {
      "imageId": "img-01HX123",
      "url": "https://...",
      "prompt": "A panda in a space suit",
      "created": "2025-06-25T14:00:00Z",
      "userSub": "user-abc123"
    }
  ]
}
```

---

## ❌ Error Responses

| Code | Message               | When                             |
|------|-----------------------|----------------------------------|
| 500  | "Failed to fetch data"| DynamoDB error or empty response |

---

## 🧭 Who Calls This?

- Frontend (homepage, public gallery)
- Admin tools (moderation overview)

## 🧪 Who Does It Call?

- **Amazon DynamoDB** – `scan` with filter: `status = "completed"`

---

## 📝 Notes

- Supports CORS for:
  - `https://diffusioncraft-client.s3.us-east-1.amazonaws.com`
- Filters only images with `status = "completed"`
- No pagination or limits – could be enhanced for performance
