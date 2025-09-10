# 🧠 DefusionCraft – AI Image Generation Platform (Full Deployment Guide)

Welcome to the official deployment guide for **DefusionCraft** – a fully serverless, AI-powered image generation platform built entirely on AWS.

This guide provides everything you need to deploy the system from source using CloudFormation templates and an automated shell script, in just a few steps.

---

## ⚙️ Prerequisites

- ✅ An active AWS account
- ✅ Access to [AWS CloudShell](https://console.aws.amazon.com/cloudshell)
- ✅ IAM permissions to create and manage the following resources:
  - AWS Lambda
  - Amazon S3
  - DynamoDB
  - Amazon SQS
  - API Gateway
  - Amazon Cognito

> 💡 The system is fully compatible with AWS Academy Lab environments (e.g., `LabRole`).

---

## 📁 Step 1 – Upload the Deployment Package

1. Open **AWS CloudShell**
2. Upload the file:
   ```
   DefusionCraft-IaC-Package.zip
   ```
   using the **“Upload file”** button in the CloudShell interface

---

## 📦 Step 2 – Extract the Package

```bash
unzip DefusionCraft-IaC-Package.zip -d ~/DefusionCraft
```

You should see the following structure:

```
~/DefusionCraft/
├── lambda-code/
├── cloudformation/
├── scripts/
└── DefusuonCraft_ClientSide/
```

---

## 🚀 Step 3 – Run the Deployment Script

```bash
chmod +x ~/DefusionCraft/scripts/deploy.sh
cd ~/DefusionCraft/scripts
./deploy.sh
```

The script will automatically:
- 📤 Upload all Lambda ZIP files to a temporary S3 bucket
- ⚙️ Deploy all CloudFormation stacks in correct dependency order
- 🌍 Upload the static website to an S3 bucket and configure public hosting
- 🧹 Clean up temporary S3 resources
- ✅ Print the final public website URL upon success

---

## 🌐 Step 4 – Access Your Deployed System

Once deployment is complete, you’ll receive a URL like:

```
https://defusioncraft-static-xxxxxxxxxxxx.s3.amazonaws.com/index.html
```

Open this link in your browser.

You can now:
- 🧭 Browse as a **guest** (public image gallery)
- 🔐 Sign in via **Cognito Hosted UI** to access personal gallery
- 🛠️ If you're an admin user – access the admin panel
- 🤖 Use the AI Assistant to generate images

---

## ✅ Final Verification Checklist

| Feature                  | Status            |
|--------------------------|-------------------|
| Guest access             | Public gallery loads without login |
| Cognito login            | Redirects to Hosted UI and returns token |
| Personal gallery         | Displays user-generated images |
| Admin interface          | Visible for Admin group only |
| Full AI flow             | Lambda → SQS → Worker → S3 → DynamoDB |

---

## 💡 Advanced Architecture Notes

- Built using **CloudFormation (YAML templates)** for full Infrastructure-as-Code (IaC)
- All APIs use **API Gateway REST with Lambda Proxy Integration**
- **CORS headers are dynamically handled** by the backend Lambdas – no hardcoded domain restrictions
- ✅ Fully portable – can be deployed in any AWS environment with zero code changes

---

## 🏁 You're Done!

You now have a production-grade, serverless image generation system, fully deployed on AWS and ready to use.

> Crafted with clarity and precision for maximum impact and minimal confusion.  
> Enjoy – **The DefusionCraft Team** 💡
