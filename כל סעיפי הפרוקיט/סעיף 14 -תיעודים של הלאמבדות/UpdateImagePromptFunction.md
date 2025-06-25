# ✏️ Lambda Function: `UpdateImagePromptFunction`

**Description:**  
This Lambda function handles update requests to modify the `prompt` field of an existing image record in the `Images` DynamoDB table. It supports CORS, validates input, and uses DynamoDB's `UpdateItem` operation.

---

## 🔗 Endpoint

**Method:** `PUT`  
**Path:** `/updatePrompt`

---

## 📥 Input Parameters

| Parameter     | Type   | Required | Description                                |
|---------------|--------|----------|--------------------------------------------|
| `imageId`     | string | ✅        | ID of the image to update                  |
| `newPrompt`   | string | ✅        | New prompt text to be stored               |
| `userSub`     | string | ✅        | Cognito User Sub – used for ownership check |

**Example Request:**
```json
{
  "imageId": "img-01HX12345678",
  "newPrompt": "A cat wearing space armor",
  "userSub": "user-abc123"
}
```

---

## 📤 Output Format

```json
{
  "status": "updated",
  "updatedAt": "2025-06-25T14:53:00Z"
}
```

---

## ❌ Error Responses

| Code | Message                      | When                                      |
|------|------------------------------|-------------------------------------------|
| 400  | "Missing required fields"    | One or more fields (`imageId`, `newPrompt`, `userSub`) are missing |
| 403  | "Unauthorized"               | The userSub does not match the record's owner |
| 404  | "Image not found"            | No image with given imageId               |
| 500  | "Failed to update"           | Internal error during DynamoDB update     |

---

## 🧭 Who Calls This?

- Frontend editor form (e.g. UI element to edit prompt)
- Admin/moderation tools (optional)

## 🧪 Who Does It Call?

- **Amazon DynamoDB**:  
  `UpdateItem` on table `Images` using conditional expression for ownership check

---

## 📝 Notes

- Validates HTTP method (`PUT`) and handles `OPTIONS` for CORS
- Updates include a `modifiedAt` timestamp in ISO 8601 UTC
- Uses environment variable `TABLE_NAME` with default `"Images"`

