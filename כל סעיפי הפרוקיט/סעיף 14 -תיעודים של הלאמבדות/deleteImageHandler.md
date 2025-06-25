# 🗑️ Lambda Function: `deleteImageHandler`

**Description:**  
Deletes an image from both Amazon S3 and DynamoDB, validating ownership via `userSub` or allowing deletion by an admin. Supports CORS, input validation, and safe delete operations.

---

## 🔗 Endpoint

**Method:** `DELETE`  
**Path:** `/deleteImage`

---

## 📥 Input Parameters (JSON Body)

| Parameter   | Type    | Required | Description                                   |
|-------------|---------|----------|-----------------------------------------------|
| `imageId`   | string  | ✅        | The ID/key of the image to delete             |
| `userSub`   | string  | ✅        | Cognito User Sub for ownership validation     |
| `isAdmin`   | boolean | ❌        | Optional – set to true if user is an admin    |

**Example Request:**
```json
{
  "imageId": "img-01HX12345678",
  "userSub": "user-abc123",
  "isAdmin": false
}
```

---

## 📤 Output Format

```json
{
  "status": "deleted",
  "imageId": "img-01HX12345678"
}
```

---

## ❌ Error Responses

| Code | Message                    | When                                      |
|------|----------------------------|-------------------------------------------|
| 400  | "Missing required fields"  | One or more of imageId/userSub missing    |
| 403  | "Unauthorized"             | User is not authorized to delete image    |
| 404  | "Image not found"          | No record found in DynamoDB               |
| 500  | "Failed to delete"         | S3 or DynamoDB deletion failed            |

---

## 🧭 Who Calls This?

- Personal gallery (user clicks delete)
- Admin dashboard (moderation action)

## 🧪 Who Does It Call?

- **Amazon S3** – `delete_object` for image file  
- **Amazon DynamoDB** – `delete_item` from `Images` table

---

## 📝 Notes

- CORS supported for:
  - `https://diffusioncraft-client.s3.us-east-1.amazonaws.com`
- Admin users can delete any image  
- Regular users can only delete their own images (checked via `userSub`)
- `BUCKET_NAME` and `TABLE_NAME` are configurable via environment variables

