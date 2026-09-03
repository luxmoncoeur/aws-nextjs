# Serverless File Uploader

A Next.js application that uses AWS S3 pre-signed URLs to securely stream and upload files directly from the browser, then browse them in a gallery.

**Live Demo:** [https://dvjeq9wk5xcfb.cloudfront.net](https://dvjeq9wk5xcfb.cloudfront.net)

---

## How It Works

- **Next.js Backend (AWS Lambda):** Validates the file (size, type) and generates a secure, temporary upload link (pre-signed URL) on demand.
- **React Frontend:** Intercepts the link and streams the file binary directly into **Amazon S3**, with a live progress bar.
- **S3 Bucket (private):** Objects are never publicly readable — every view and download goes through a short-lived pre-signed URL. Files are removed after 30 days to keep storage costs bounded.
- **CloudFront CDN:** Caches the app and serves it globally with minimal latency.

## Current Features

- Upload any file type up to **25 MB** (HTML/SVG are rejected to prevent stored XSS on the app's origin).
- Server-side enforcement: the pre-signed URL itself caps the upload size and pins the content type.
- Drag & drop, upload progress, inline status messages, and a client-side preview for images, audio, video, and PDFs.
- **Gallery page** listing the 50 most recent uploads with one-hour view links and a delete button.

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
- Add user authentication (Cognito) so uploads and deletions are tied to real users, and move file metadata (original name, uploader, timestamp) into DynamoDB.
- Rebuild and deploy this application or a similar stack using Docker and AWS ECS Fargate to practice shipping apps inside lightweight container environments instead of raw serverless functions.

---

## Quick Commands

- **Local Dev (Next.js only):** `npm run dev` — no AWS resources are bound, so S3 features won't work.
- **AWS Live Lambda Development:** `npx sst dev` (deploys and watches local cloud infra — use this for real testing).
- **Type Checking:** `npm run typecheck`
- **Deploy Global Production:** `npx sst deploy --stage production`
