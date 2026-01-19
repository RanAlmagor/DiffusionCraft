# DiffusionCraft

**AI-Powered Text-to-Image Generation Platform on AWS**

A production-grade serverless web application that enables users to generate AI-powered images from natural language prompts. Built with a modern cloud-native architecture combining AWS services with local Stable Diffusion inference for cost-effective, scalable image generation.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![AWS](https://img.shields.io/badge/AWS-Serverless-orange?logo=amazon-aws)](https://aws.amazon.com/)
[![Stable Diffusion](https://img.shields.io/badge/AI-Stable%20Diffusion-purple)](https://stability.ai/)

---

## Overview

DiffusionCraft is a full-stack serverless platform that bridges conversational AI with image generation. Users interact with an AI chat assistant powered by Google Gemini to craft prompts, which are then processed by a local Stable Diffusion worker to generate unique images. The system demonstrates modern cloud architecture patterns including event-driven processing, Infrastructure-as-Code, and hybrid cloud-local computation.

### Key Highlights

- **Serverless Architecture**: Fully managed AWS infrastructure with zero server maintenance
- **Hybrid Processing**: Cloud-based orchestration with local GPU inference for cost optimization
- **Real-time Updates**: Asynchronous processing with polling-based status updates
- **Secure by Design**: JWT-based authentication, role-based access control, encrypted storage
- **Infrastructure-as-Code**: Complete CloudFormation templates for reproducible deployments

---

## Architecture

```
                                    ┌─────────────────────────────────────────────────────────┐
                                    │                      AWS Cloud                          │
┌──────────┐                        │                                                         │
│          │   HTTPS    ┌───────────┴───────────┐                                             │
│  Client  │◄──────────►│  S3 Static Website    │                                             │
│ Browser  │            │  (Frontend Hosting)   │                                             │
│          │            └───────────┬───────────┘                                             │
└────┬─────┘                        │                                                         │
     │                              │                                                         │
     │ JWT Auth    ┌────────────────┴────────────────┐                                        │
     │◄───────────►│        Amazon Cognito           │                                        │
     │             │   (User Pool + Hosted UI)       │                                        │
     │             └─────────────────────────────────┘                                        │
     │                                                                                        │
     │             ┌─────────────────────────────────┐      ┌──────────────────┐              │
     │ REST API    │       API Gateway               │      │   Amazon SQS     │              │
     └────────────►│   (RESTful Endpoints)           │─────►│  (Prompt Queue)  │──────────┐   │
                   └──────────────┬──────────────────┘      └──────────────────┘          │   │
                                  │                                                       │   │
                                  ▼                                                       │   │
                   ┌──────────────────────────────────┐     ┌──────────────────┐          │   │
                   │        AWS Lambda                │◄───►│  Amazon DynamoDB │          │   │
                   │   (10 Serverless Functions)      │     │ (Image Metadata) │          │   │
                   └──────────────┬───────────────────┘     └──────────────────┘          │   │
                                  │                                                       │   │
                                  │                         ┌──────────────────┐          │   │
                                  └────────────────────────►│    Amazon S3     │          │   │
                                                            │ (Image Storage)  │◄─────┐   │   │
                                                            └──────────────────┘      │   │   │
                                    └─────────────────────────────────────────────────┼───┼───┘
                                                                                      │   │
                                    ┌─────────────────────────────────────────────────┼───┼───┐
                                    │                   Local Machine                 │   │   │
                                    │                                                 │   │   │
                                    │  ┌──────────────────────────────────────────┐   │   │   │
                                    │  │         Stable Diffusion Worker          │◄──┘   │   │
                                    │  │  (Python + Hugging Face Diffusers)       │◄──────┘   │
                                    │  │                                          │           │
                                    │  │  • Polls SQS for prompts                 │           │
                                    │  │  • Generates images via SD model         │           │
                                    │  │  • Uploads results to S3                 │           │
                                    │  │  • Updates DynamoDB metadata             │           │
                                    │  └──────────────────────────────────────────┘           │
                                    └─────────────────────────────────────────────────────────┘
```

### Architecture Components

| Component | AWS Service | Purpose |
|-----------|-------------|---------|
| Frontend Hosting | S3 + CloudFront | Static website hosting with global CDN |
| Authentication | Cognito | User management, JWT tokens, OAuth flows |
| API Layer | API Gateway | RESTful endpoints with CORS support |
| Business Logic | Lambda | 10 serverless functions for all operations |
| Message Queue | SQS | Decoupled async processing of prompts |
| Database | DynamoDB | NoSQL storage for image metadata |
| File Storage | S3 | Generated image storage with encryption |
| AI Chat | Google Gemini | Conversational prompt assistance |
| Image Generation | Stable Diffusion | Local inference via Hugging Face diffusers |

---

## Features

### User Features
- **AI Chat Assistant** - Interactive wizard powered by Google Gemini for prompt crafting
- **Voice Input/Output** - Web Speech API integration for hands-free interaction
- **Style Selection** - 12 predefined artistic styles (Realistic, Fantasy, Anime, Cyberpunk, etc.)
- **Personal Gallery** - View, download, edit, and share generated images
- **Public Gallery** - Browse community-generated artwork
- **Real-time Status** - Live polling for generation progress

### Technical Features
- **Serverless Backend** - Zero infrastructure management with AWS Lambda
- **Event-Driven Processing** - SQS-based decoupling for reliability and scale
- **JWT Authentication** - Secure token-based API authorization
- **Role-Based Access** - Cognito groups for Users and Admins
- **Presigned URLs** - Secure, time-limited download links
- **Infrastructure-as-Code** - Full CloudFormation deployment automation

### Admin Features
- **Moderation Dashboard** - Review and manage all generated content
- **Advanced Filtering** - Search by prompt, user, status, and date range
- **Batch Operations** - Bulk content management capabilities

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 / CSS3 | Semantic markup and styling |
| JavaScript (ES6+) | Client-side logic, no frameworks |
| Tailwind CSS | Utility-first styling framework |
| Web Speech API | Voice recognition and synthesis |
| Web Components | Reusable UI components |

### Backend (Serverless)
| Technology | Purpose |
|------------|---------|
| AWS Lambda | Serverless compute (Python runtime) |
| API Gateway | REST API management |
| DynamoDB | NoSQL database with GSI |
| SQS | Message queue for async processing |
| S3 | Object storage and static hosting |
| Cognito | Identity and access management |
| CloudFormation | Infrastructure-as-Code |

### AI/ML
| Technology | Purpose |
|------------|---------|
| Google Gemini API | Conversational AI assistant |
| Stable Diffusion | Text-to-image generation |
| Hugging Face Diffusers | ML model inference library |
| PyTorch | Deep learning framework |

### Development Tools
| Tool | Purpose |
|------|---------|
| Node.js + Express | Local HTTPS development server |
| mkcert | SSL certificate generation |
| AWS CLI | Cloud resource management |
| Git | Version control |

---

## Project Structure

```
DiffusionCraft/
├── DefusuonCraft_ClientSide/           # Frontend web application
│   ├── index.html                      # Main application page
│   ├── gallery.html                    # Personal image gallery
│   ├── admin.html                      # Admin dashboard
│   ├── server.js                       # Local HTTPS dev server
│   ├── js/                             # JavaScript modules
│   │   ├── chat-loader.js              # AI chat interface logic
│   │   ├── login-handler.js            # Cognito authentication
│   │   ├── Homegallery-loader.js       # Public gallery display
│   │   ├── Personalgallery-loader.js   # User gallery management
│   │   ├── admin.js                    # Admin dashboard logic
│   │   └── navbar-loader.js            # Navigation component
│   ├── css/                            # Stylesheets
│   │   ├── style.css                   # Global theme styles
│   │   ├── chat.css                    # Chat UI styling
│   │   └── navbar.css                  # Navigation styling
│   ├── web components/                 # Reusable HTML components
│   └── ssl/                            # Local SSL certificates
│
├── DefusuonCraft_ServerSide/           # Local worker reference
│   └── Local server executable...      # Stable Diffusion worker link
│
├── Project sections/                   # Comprehensive documentation
│   ├── Section 1 – Project Proposal
│   ├── Section 2 – Architecture Diagram
│   ├── Section 3 – Architecture Explanations
│   ├── Section 4 – User Interface Design
│   ├── Section 5 – State Diagrams (UML)
│   ├── Section 6 – Cost Estimation
│   ├── Section 7 – User Manual
│   ├── Section 8 – Administrator Manual
│   ├── Section 10 – Deployment Guide
│   └── Section 14 – Lambda Documentation
│
├── README.md
└── LICENSE
```

---

## Lambda Functions

| Function | Trigger | Description |
|----------|---------|-------------|
| `GeminiChatLambda` | API Gateway POST | Processes chat messages via Google Gemini API |
| `sendPromptToQueue` | API Gateway POST | Enqueues image generation requests to SQS |
| `readPromptFromQueue` | Manual/Scheduled | Worker retrieves prompts from queue |
| `checkImageStatus` | API Gateway POST | Returns generation status for polling |
| `GetAllImagesHandler` | API Gateway GET | Fetches all completed images for gallery |
| `GetUserPersonalImages` | API Gateway GET | Retrieves user-specific images |
| `GenerateDownloadUrl` | API Gateway GET | Creates presigned S3 download URLs |
| `UpdateImagePromptFunction` | API Gateway PUT | Edits image metadata |
| `deleteImageHandler` | API Gateway DELETE | Removes images with ownership validation |
| `AddNewUserToUsersGroup` | Cognito Trigger | Auto-assigns users to default group |

---

## Database Schema

### DynamoDB: Images Table

| Attribute | Type | Description |
|-----------|------|-------------|
| `imageId` (PK) | String | Unique identifier (UUID format) |
| `userSub` | String | Cognito user identifier |
| `prompt` | String | Text prompt used for generation |
| `style` | String | Selected artistic style |
| `status` | String | `pending` \| `completed` \| `failed` |
| `s3url` | String | S3 object path for generated image |
| `createdAt` | String | ISO 8601 timestamp |
| `updatedAt` | String | ISO 8601 timestamp |

**Global Secondary Index**: `userSub-index` for efficient user-specific queries

---

## Getting Started

### Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js 18+ (for local development server)
- Python 3.9+ with PyTorch (for local worker)
- Hugging Face account and API token
- Google Cloud account with Gemini API key

### Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/RanAlmagor/DiffusionCraft.git
   cd DiffusionCraft
   ```

2. **Deploy AWS infrastructure**
   ```bash
   cd scripts
   chmod +x deploy.sh
   ./deploy.sh
   ```

   This script will:
   - Create temporary S3 bucket for Lambda packages
   - Upload all Lambda function code
   - Deploy CloudFormation stacks in dependency order
   - Sync frontend assets to S3

3. **Configure the local worker**
   - Download the Stable Diffusion worker executable
   - Set your Hugging Face token for model access
   - Configure AWS credentials for S3/DynamoDB access
   - Start the worker to begin polling the SQS queue

4. **Access the application**
   ```
   https://diffusioncraft-client.s3.us-east-1.amazonaws.com/DefusuonCraft_ClientSide/index.html
   ```

### Local Development

```bash
cd DefusuonCraft_ClientSide
npm install
node server.js
```

Access the local development server at `https://localhost:3000`

---

## API Reference

### Authentication
All protected endpoints require a valid JWT token in the `Authorization` header.

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chatGemini` | No | Send message to AI assistant |
| POST | `/sendPrompt` | Yes | Submit image generation request |
| POST | `/Images/status_Image` | Yes | Check generation status |
| GET | `/Images` | No | Get all completed images |
| GET | `/Images/Personal` | Yes | Get user's images |
| GET | `/Images/ImageUrl` | No | Get presigned download URL |
| PUT | `/updatePrompt` | Yes | Update image prompt |
| DELETE | `/Images/Personal` | Yes | Delete user's image |

---

## Cleanup

To remove all deployed resources:

```bash
# Delete CloudFormation stacks in reverse order
aws cloudformation delete-stack --stack-name apigateway-stack
aws cloudformation delete-stack --stack-name lambdas-stack
aws cloudformation delete-stack --stack-name cognito-stack
aws cloudformation delete-stack --stack-name sqs-stack
aws cloudformation delete-stack --stack-name dynamodb-stack
aws cloudformation delete-stack --stack-name s3-stack

# Remove S3 buckets (if not empty)
aws s3 rb s3://defusioncraft-client-site --force
aws s3 rb s3://diffusioncraft-generated-pics --force
```

---

## Documentation

Comprehensive documentation is available in the `Project sections/` directory:

- **Architecture Diagram** - Visual system overview
- **Architecture Explanations** - Detailed component documentation
- **UML Sequence Diagrams** - System interaction flows
- **User Manual** - End-user guide
- **Administrator Manual** - Admin operations guide
- **Lambda Documentation** - Function-level documentation
- **Cost Estimation** - AWS pricing analysis

---

## Skills Demonstrated

This project showcases proficiency in:

- **Cloud Architecture**: Designing scalable, serverless systems on AWS
- **Full-Stack Development**: Frontend (HTML/CSS/JS) and backend (Python/Lambda)
- **AI/ML Integration**: Working with generative AI models and APIs
- **DevOps Practices**: Infrastructure-as-Code, automated deployments
- **Security**: JWT authentication, RBAC, secure API design
- **Database Design**: NoSQL schema design with DynamoDB
- **Event-Driven Architecture**: Asynchronous processing with SQS
- **API Design**: RESTful API development with proper CORS handling

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Ran Almagor**

- GitHub: [@RanAlmagor](https://github.com/RanAlmagor)

---

<p align="center">
  <i>Built as a capstone project demonstrating cloud computing and AI integration skills.</i>
</p>
