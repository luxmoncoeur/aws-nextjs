# Serverless File Uploader

A Next.js application that uses AWS S3 pre-signed URLs to securely stream and upload files directly from the browser.

**Live Demo:** [https://dvjeq9wk5xcfb.cloudfront.net](https://dvjeq9wk5xcfb.cloudfront.net)

---

## How It Works

- **Next.js Backend (AWS Lambda):** Generates a secure, temporary upload link (pre-signed URL) on demand.
- **React Frontend:** Intercepts the link and streams the file binary directly into **Amazon S3**.
- **CloudFront CDN:** Caches the app and serves it globally with minimal latency.

---

## Today I Learned

### 1. AWS Account & IAM Setup

- Before writing, I had to configure my local machine with the AWS CLI and an IAM user with programmatic access credentials.

### 2. Preventing Runtime Crashes

- Submitting the form without selecting a file immediately broke the app with a `null is not an object` crash on `file.type`. Adding a simple JavaScript defensive guard clause (`if (!file) return;`) completely fixed this user error.

### 3. Navigating the AWS Dashboard

- AWS is isolated by global geographic regions. When I logged into the console, it looked completely empty until I switched my region filter dropdown to **Sydney (`ap-southeast-2`)**, which instantly surfaced my live S3 buckets.

---

## Future Study Goals

To build on this project and master full-stack cloud development, my next goals are:

- Learn how the core blocks of cloud computing work behind the scenes—specifically looking into VPC networking layers, IAM roles/policies, and database management.
- Build more features on top of this stack, like adding user authentication (Cognito) or creating a gallery page to read and display the images stored inside the S3 bucket.
- Rebuild and deploy this application or a similar stack using Docker and AWS ECS Fargate to practice shipping apps inside lightweight container environments instead of raw serverless functions.

---

## Quick Commands

- **Run Local Sandbox:** `npx sst dev`
- **Deploy Global Production:** `npx sst deploy --stage production`
