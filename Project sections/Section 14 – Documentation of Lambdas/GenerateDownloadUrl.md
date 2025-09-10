# 📥 Lambda Function: `GenerateDownloadUrl`

**Description:**  
Generates a time-limited presigned S3 download URL for a specific image based on the provided `imageKey`. Supports both GET (query parameters) and POST (JSON body) request formats.

---

## 🔗 Endpoint

**Method:** `GET` or `POST`  
**Path:** `/generateDownloadUrl`

---

## 📥 Input Parameters

| Parameter   | Type   | Required | Description                                 |
|-------------|--------|----------|---------------------------------------------|
| `imageKey`  | string | ✅        | S3 object key for the image to be downloaded |

**Example Request (GET):**
```
/generateDownloadUrl?imageKey=images/img-01HX12345.png
```

**Example Request (POST):**
```json
{
  "imageKey": "images/img-01HX12345.png"
}
```

---

## 📤 Output Format

```json
{
  "downloadUrl": "https://diffusioncraft-generated-pics.s3.amazonaws.com/..."
}
```

---

## ❌ Error Responses

| Code | Message               | When                             |
|------|-----------------------|----------------------------------|
| 400  | "Missing 'imageKey'"  | Request does not include imageKey |
| 500  | "Failed to generate URL" | Error in S3 presigned URL logic |

---

## 🧭 Who Calls This?

- Frontend download button
- Admin panel for media access

## 🧪 Who Does It Call?

- **Amazon S3** – `generate_presigned_url(ClientMethod="get_object", ...)`

---

## 📝 Notes

- Default bucket: `diffusioncraft-generated-pics` (from `BUCKET_NAME` env variable)
- URL expires in 10 minutes (default behavior of `generate_presigned_url`)
- CORS enabled for all origins (`*`) – adjust in production

