# 📦 Lambda Function: `readPromptFromQueue`

**Description:**  
Reads one message from an Amazon SQS queue (`DiffusionPromptQueue`), parses its content (image prompt and metadata), deletes the message from the queue, and returns the prompt data for further processing (typically by a local image generation worker).

---

## 🔗 Trigger

**Trigger Type:** Manual / Scheduled / Worker  
**Integration:** Internal (not exposed to frontend)

---

## ❓ Purpose

- Acts as a **queue worker consumer**
- Fetches the **next prompt** to be processed
- Prevents duplication by **deleting the message immediately after reading**

---

## 📤 Output Format

### ✅ When a message exists:
```json
{
  "prompt": "A robot playing violin on a mountaintop",
  "style": "anime",
  "userSub": "user-abc123",
  "imageId": "img-01HX12345678"
}
```

### 🕳️ When queue is empty:
```json
{
  "message": "No messages in queue."
}
```

---

## ❌ Error Responses

| Code | Message            | When                        |
|------|--------------------|-----------------------------|
| 500  | Internal server error | Failure in SQS communication or message parsing |

---

## 🧭 Who Calls This?

- Local worker application (e.g., Python script with `boto3` and Stable Diffusion)
- Can also be used in automated workflows (e.g., Step Functions or scheduled Lambda)

## 🧪 Who Does It Call?

- **Amazon SQS** – `receive_message`, `delete_message` on queue `DiffusionPromptQueue`

---

## 📝 Notes

- Uses `MaxNumberOfMessages = 1` to avoid batch complications
- Wait time is short (1 second) to keep latency low for polling workers
- No authentication layer assumed (used in internal AWS infrastructure)

