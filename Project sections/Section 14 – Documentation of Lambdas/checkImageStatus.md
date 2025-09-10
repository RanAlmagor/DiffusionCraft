# 🧪 Lambda Function: `checkImageStatus`

**Description:**  
This Lambda function checks the processing status of an image based on its `imageId`. It queries the `Images` DynamoDB table and returns whether the image is still `pending`, `completed`, or missing. Used for client-side polling to know when a generated image is ready.

---

## 🔗 Endpoint

**Method:** `POST`  
**Path:** `/checkImageStatus`

---

## 📥 Input Parameters (JSON Body)

| Parameter   | Type   | Required | Description                      |
|-------------|--------|----------|----------------------------------|
| `imageId`   | string | ✅        | ID of the image to check status |

**Example Request:**
```json
{
  "imageId": "img-01HX12345"
}
```

---

## 📤 Output Format

```json
{
  "imageId": "img-01HX12345",
  "status": "completed"
}
```

---

## ❌ Error Responses

| Code | Message                   | When                                |
|------|---------------------------|-------------------------------------|
| 400  | "Missing imageId"         | imageId is not provided in body     |
| 404  | "Image not found"         | No image found in DynamoDB          |
| 500  | "Failed to check status"  | Internal DynamoDB error             |

---

## 🧭 Who Calls This?

- Frontend (polling mechanism after prompt submission)
- Chat assistant (to update UI once image is generated)

## 🧪 Who Does It Call?

- **Amazon DynamoDB** – `get_item` by `imageId` from the `Images` table

---

## 📝 Notes

- CORS supported for:
  - `https://diffusioncraft-client.s3.us-east-1.amazonaws.com`
  - `http://localhost:3000`
- Returns HTTP 200 even when image is not found – with `"status": "not_found"` or proper message
- Intended for rapid polling after image submission
