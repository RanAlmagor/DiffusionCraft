# 🧠 DefusionCraft Lambda API Documentation

Welcome to the **official documentation** for the Lambda-based serverless backend of the **DefusionCraft** project.

This collection includes comprehensive, professional documentation for all Lambda functions developed in the system, each presented in a modular and readable format – inspired by industry standards such as AWS Boto3, Swagger, and real-world microservice documentation.

---

## 📚 Table of Contents

Each Lambda function has its own dedicated `.md` file. Click to view:

| Function Name                  | Description                                                |
|-------------------------------|------------------------------------------------------------|
| [`GeminiChatLambda`](./GeminiChatLambda.md)             | Sends user prompts to Gemini AI and returns replies       |
| [`sendPromptToQueue`](./sendPromptToQueue.md)           | Pushes prompt into SQS and adds record to DynamoDB        |
| [`readPromptFromQueue`](./readPromptFromQueue.md)       | Reads and deletes the next prompt from SQS                |
| [`UpdateImagePromptFunction`](./UpdateImagePromptFunction.md) | Updates prompt field in image record                     |
| [`GetUserPersonalImages`](./GetUserPersonalImages.md)   | Fetches all images for a specific user                    |
| [`GetAllImagesHandler`](./GetAllImagesHandler.md)       | Retrieves all public/completed images                     |
| [`GenerateDownloadUrl`](./GenerateDownloadUrl.md)       | Creates a presigned S3 URL for image download             |
| [`checkImageStatus`](./checkImageStatus.md)             | Polls for image processing status by imageId              |
| [`deleteImageHandler`](./deleteImageHandler.md)         | Deletes image from S3 and DynamoDB with permission checks |
| [`AddNewUserToUsersGroup`](./AddNewUserToUsersGroup.md) | Adds new Cognito user to 'Users' group automatically      |

---

## 💡 Notes

- All Lambdas are documented individually with:
  - ✅ Description
  - ✅ Endpoint or Trigger
  - ✅ Input/Output structure
  - ✅ Error handling
  - ✅ Who calls and who they call


---

## 🧾 About This Project

**DefusionCraft** is a  AI image generation platform using AWS Lambda, DynamoDB, SQS, and S3. It allows users to generate, manage, and share images using Stable Diffusion + Gemini chat assistance.

---

> Crafted with clarity and precision for maximum impact — and minimal confusion.  
> Enjoy!  
> — The DefusionCraft Team ❤️
