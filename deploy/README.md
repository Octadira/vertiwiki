# 🚀 VertiWiki Official Deployment Recipes

This directory provides production-ready hosting configurations for **VertiWiki** across all major cloud providers, CDN edge networks, and web servers.

---

## 🧭 Which Recipe Should I Use?

| Platform | Location | Core Capabilities |
|---|---|---|
| **Vercel** | [`vercel/vercel.json`](./vercel/vercel.json) | Content negotiation (`Accept: text/markdown`), genuine 404 preservation, CORS, UTF-8 MIME types |
| **Cloudflare Pages** | [`cloudflare/`](./cloudflare/) | MIME & CORS `_headers`, and edge `worker-snippet.js` for Markdown Content Negotiation |
| **Netlify** | [`netlify/netlify.toml`](./netlify/netlify.toml) | `Accept: text/markdown` condition redirects, CORS, genuine 404 status codes |
| **AWS (S3 + CloudFront)** | [`aws/`](./aws/) | CloudFront Function for viewer-request rewrite, private S3 bucket policy |
| **Nginx** | [`nginx/vertiwiki.conf`](./nginx/vertiwiki.conf) | Fast `$http_accept` map, UTF-8 MIME types, native 404 `try_files` |
| **Apache** | [`apache/.htaccess`](./apache/.htaccess) | `mod_rewrite` rules with `HTTP:Accept` inspection, genuine 404 handling |
| **GitHub Pages** | [`github-pages/404.html`](./github-pages/404.html) | Zero-config static hosting via hash routing |

---

## 🏛️ Architectural Principles for Documentation Hosting

VertiWiki is a **100% static, single-file, zero-backend Markdown wiki and documentation engine**. Unlike traditional web applications or SSG frameworks (Astro, Nextra, Docusaurus), VertiWiki operates under distinct architectural principles:

### 1. Hash Routing for Humans
VertiWiki utilizes client-side hash routing (`#/guide.md` or `index.html#/guide.md`). When a user refreshes their browser at `https://example.com/#/guide.md`, the browser requests only `https://example.com/` from the server; the fragment `#/guide.md` is processed locally in JavaScript.
- **Zero server-side rewrite requirement**: VertiWiki runs out-of-the-box on raw static storage (S3, GitHub Pages, USB drives, `file:///`) without requiring any server configuration.

### 2. The Catch-All SPA Anti-Pattern (CRITICAL)
In traditional SPA development (React, Vue), developers often add catch-all rewrites (`/* -> /index.html 200`). **On a documentation site, this is a dangerous anti-pattern:**
- ❌ **Soft 404s**: When an agent, search engine, or user requests a broken or deleted URL (e.g. `/docs/old-deleted-page`), a catch-all rewrite returns `index.html` with **HTTP 200 OK** instead of **HTTP 404 Not Found**.
- ❌ **AEO & SEO Degradation**: Automated evaluators (such as `afdocs` / AgentDocsSpec) and search engines (Google, Bing) penalize Soft 404s heavily, failing URL stability checks.
- ❌ **Content Parity Failures**: When crawlers inspect clean URLs expecting specific documentation, serving an application shell or marketing landing page causes massive content mismatch penalties.

> **The Golden Rule of Documentation Recipes**:
> Enable Content Negotiation for `Accept: text/markdown`, but **never** use a blind catch-all rewrite to `index.html`. Allow the web server to return a genuine **HTTP 404** for any resource that does not exist.

---

## ⚡ Capabilities Provided by These Recipes

1. **AI Agent Content Negotiation**:
   When autonomous AI agents (Claude Code, Cursor, Aider, OpenCode) send `Accept: text/markdown`, the server serves the raw `.md` file with `Content-Type: text/markdown; charset=utf-8`.
2. **Permissive CORS**:
   AI crawlers, web LLMs, and third-party tools can fetch documentation markdown files and `llms.txt` without encountering cross-origin restrictions (`Access-Control-Allow-Origin: *`).
3. **Genuine HTTP 404 Error Preservation**:
   Ensures missing or deleted URLs correctly return HTTP status 404, preventing Soft 404 penalties.
4. **Correct MIME Types & UTF-8 Encoding**:
   Guarantees that `.md`, `.txt`, and `.json` files are served with proper character sets across all browsers.

---

## 🛠️ How to Deploy

### Scenario A: Standalone Root Deployment (Default)
If you are hosting VertiWiki as a dedicated standalone site (e.g. `wiki.mycompany.com` or `docs.myproject.org`):
1. Place `index.html` (the standalone `dist/vertiwiki.html` bundle), `config.json`, `navigation.md`, `index.md`, and your documentation files directly in your repository root.
2. Copy the recipe from the corresponding directory (`deploy/vercel/vercel.json`, `deploy/netlify/netlify.toml`, etc.) into your repository root.
3. Deploy! The recipes are pre-configured to handle root-level Content Negotiation and 404s out of the box.

### Scenario B: Subfolder Deployment (`/docs/` or `/wiki/`)
If you are hosting VertiWiki in a subfolder alongside another website (e.g. a marketing landing page at `/` and documentation at `/docs/`):

#### 1. Vercel (`vercel.json`):
Prefix the rewrite sources and destinations with your subfolder:
```json
"rewrites": [
  {
    "source": "/docs",
    "has": [{ "type": "header", "key": "accept", "value": ".*text\\/markdown.*" }],
    "destination": "/docs/index.md"
  },
  {
    "source": "/docs/",
    "has": [{ "type": "header", "key": "accept", "value": ".*text\\/markdown.*" }],
    "destination": "/docs/index.md"
  },
  {
    "source": "/docs/:path((?!assets\\/|themes\\/|.*\\.[a-zA-Z0-9]+$).*)",
    "has": [{ "type": "header", "key": "accept", "value": ".*text\\/markdown.*" }],
    "destination": "/docs/:path.md"
  }
]
```

#### 2. Netlify (`netlify.toml`):
```toml
[[redirects]]
  from = "/docs/"
  to = "/docs/index.md"
  status = 200
  conditions = {Headers = {Accept = "text/markdown"}}

[[redirects]]
  from = "/docs"
  to = "/docs/index.md"
  status = 200
  conditions = {Headers = {Accept = "text/markdown"}}
```

#### 3. Nginx (`vertiwiki.conf`):
```nginx
location /docs/ {
    if ($wants_markdown) {
        rewrite ^/docs/?$ /docs/index.md last;
        rewrite ^/docs/(.+)/$ /docs/$1/index.md last;
        rewrite ^/docs/([^.]+)$ /docs/$1.md last;
    }
    try_files $uri $uri/ =404;
}
```

#### 4. Apache (`.htaccess`):
```apache
RewriteCond %{HTTP:Accept} text/markdown [NC]
RewriteRule ^docs/?$ docs/index.md [L]

RewriteCond %{HTTP:Accept} text/markdown [NC]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.md -f
RewriteRule ^docs/(.*)$ docs/$1.md [L]
```
