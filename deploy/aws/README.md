# AWS Deployment Guide (S3 + CloudFront)

This guide explains how to host VertiWiki on **Amazon S3** with **AWS CloudFront**, achieving global edge delivery, HTTPS, and full **AI Agent Content Negotiation**.

---

## 1. Architecture Overview

```text
User / AI Agent
      │
      ▼
CloudFront (Edge CDN)
  ├── Viewer Request Function: cloudfront-function.js (Inspects Accept: text/markdown)
  └── Response Headers Policy: Content-Type: text/markdown, CORS: *
      │
      ▼
Amazon S3 Bucket (Private origin, encrypted at rest)
  ├── docs/index.html (VertiWiki standalone bundle)
  ├── docs/*.md (Raw markdown documentation)
  └── llms.txt (LLM index)
```

---

## 2. Step-by-Step Setup

### Step A: Amazon S3 Bucket
1. Create a standard private S3 bucket (e.g. `my-vertiwiki-docs`).
2. Upload your VertiWiki site files into the bucket.
3. Configure bucket permissions: Use **CloudFront Origin Access Control (OAC)** so the bucket is accessible only through CloudFront.

### Step B: CloudFront Response Headers Policy (CORS & MIME Types)
1. In CloudFront Console, navigate to **Policies** > **Response Headers**.
2. Create a custom response headers policy named `VertiWiki-Headers`:
   - **Access-Control-Allow-Origin**: `*`
   - **Access-Control-Allow-Methods**: `GET, HEAD, OPTIONS`
   - **Cache-Control**: `public, max-age=0, must-revalidate` (for `.md` and `.json`)

### Step C: CloudFront Function for AI Content Negotiation
1. In CloudFront Console, navigate to **Functions** > **Create function**.
2. Name: `vertiwiki-content-negotiation`, Runtime: **cloudfront-js-2.0**.
3. Paste the contents of [`cloudfront-function.js`](./cloudfront-function.js).
4. Save and click **Publish**.
5. In your CloudFront distribution, navigate to **Behaviors** > edit default behavior:
   - **Viewer request**: Select `vertiwiki-content-negotiation` function.
   - **Response headers policy**: Select `VertiWiki-Headers`.
   - Save changes.

---

## 3. Verification
Test with `curl`:
```bash
# Human browser (HTML)
curl -IL https://your-domain.com/docs/

# AI Coding Agent (Raw Markdown)
curl -IL -H "Accept: text/markdown" https://your-domain.com/docs/
```
