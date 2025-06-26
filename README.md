בהחלט. הנה טיוטת קובץ `README.md` מקצועי עבור **התקנה מלאה** ו־**מחיקה מלאה** של מערכת DefusionCraft – מותאם במיוחד למבנה שלך ולפרויקט כמו שהוא כרגע בנוי עם CloudShell, CloudFormation, S3, Lambda, API Gateway וכו'.

---

```markdown
# 📦 DefusionCraft – Installation & Cleanup Guide

This project deploys a full AWS-based AI image generation system using CloudFormation and Bash automation. It includes static frontend hosting, serverless backend logic, user authentication, and API integration.

---

## 🛠️ Prerequisites

Before running the installation script:

- ✅ AWS CLI must be configured properly (`aws configure` or via AWS Academy Lab pre-auth).
- ✅ Your current CloudShell working directory includes the following folders:
```

DefusionCraft-IaC-Package/
├── cloudformation/
│ ├── apigateway.yaml
│ ├── cognito.yaml
│ ├── dynamodb.yaml
│ ├── lambdas.yaml
│ ├── s3-buckets-full.yaml
│ └── sqs.yaml
├── lambda-code/
│ └── \*.zip # All Lambda function packages
├── DefusuonCraft_ClientSide/
│ └── index.html + assets
├── scripts/
│ └── deploy.sh

````

---

## 🚀 Full Installation

To install all resources and deploy the full system, run:

```bash
cd ~/DefusionCraft-IaC-Package/scripts
chmod +x deploy.sh
./deploy.sh
````

This will:

1. ✅ Create a temporary S3 bucket for Lambda .zip files.
2. ✅ Upload all Lambda ZIPs.
3. ✅ Deploy CloudFormation stacks in the following order:

   - `s3-stack` (images, code, and static website buckets)
   - `dynamodb-stack`
   - `sqs-stack`
   - `cognito-stack`
   - `lambdas-stack` (with codeBucket parameter)
   - `apigateway-stack`

4. ✅ Sync the frontend static site to `defusioncraft-client-site`.

---

## 🌐 Website URL

After successful deployment, your frontend is hosted at:

```
http://defusioncraft-client-site.s3-website-us-east-1.amazonaws.com/
```

If needed, you can configure your domain and SSL via Route 53 + CloudFront.

---

## 🧼 Full Cleanup

To **fully delete all deployed resources**, run:

```bash
# Navigate to the scripts folder
cd ~/DefusionCraft-IaC-Package/scripts

# Delete CloudFormation stacks in reverse order
aws cloudformation delete-stack --stack-name apigateway-stack
aws cloudformation delete-stack --stack-name lambdas-stack
aws cloudformation delete-stack --stack-name cognito-stack
aws cloudformation delete-stack --stack-name sqs-stack
aws cloudformation delete-stack --stack-name dynamodb-stack
aws cloudformation delete-stack --stack-name s3-stack

# Wait for stacks to delete (optional, or check manually)
aws cloudformation wait stack-delete-complete --stack-name apigateway-stack
aws cloudformation wait stack-delete-complete --stack-name lambdas-stack
# ... repeat for others if needed

# 🗑️ Manually delete the temporary Lambda code bucket if it still exists
aws s3 rb s3://defusioncraft-lambda-code-<TIMESTAMP> --force

# (Optional) Delete the frontend S3 bucket if not included in s3-stack
aws s3 rb s3://defusioncraft-client-site --force
```

> 💡 Tip: You can wrap this into a `cleanup.sh` script if you prefer automation.

---

## ℹ️ Notes

- ⚠️ The Lambda code bucket is created with a unique timestamp, and removed automatically unless an error occurs.
- 🚫 Never expose your AWS credentials or tokens.
- 💬 For support or contribution, contact the DefusionCraft Team.

---

_Crafted with precision for seamless deployment. Enjoy your journey into serverless image generation! ❤️_

```

---

רוצה שאכין מזה קובץ `README.md` מוכן להורדה או להוספה ישירה לתיקייה?
```
