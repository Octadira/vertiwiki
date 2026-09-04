# 🚀 VertiWiki Official Deployment Recipes

This directory provides production-ready hosting configurations for **VertiWiki** across all major cloud providers and web servers.

---

## 🧭 Which Recipe Should I Use?

| Platform | Location | Features Provided |
|---|---|---|
| **Vercel** | [`vercel/vercel.json`](./vercel/vercel.json) | Content negotiation (`Accept: text/markdown`), SPA routing, CORS, MIME types |
| **Cloudflare Pages** | [`cloudflare/`](./cloudflare/) | Custom `_headers`, `_redirects`, and optional Worker snippet |
| **Netlify** | [`netlify/netlify.toml`](./netlify/netlify.toml) | `Accept` header condition redirects, CORS, SPA fallback |
| **AWS (S3 + CloudFront)** | [`aws/`](./aws/) | CloudFront Function for viewer-request rewrite, private S3 bucket policy |
| **Nginx** | [`nginx/vertiwiki.conf`](./nginx/vertiwiki.conf) | Fast `$http_accept` map, UTF-8 MIME types, SPA `try_files` |
| **Apache** | [`apache/.htaccess`](./apache/.htaccess) | `mod_rewrite` rules with `HTTP:Accept` inspection |
| **GitHub Pages** | [`github-pages/404.html`](./github-pages/404.html) | Zero-config hash routing, optional SPA 404 handler |

---

## ⚡ Universal Capabilities Enabled by These Recipes

1. **AI Agent Content Negotiation**:
   When AI agents (Claude Code, Cursor, OpenCode, Aider) send `Accept: text/markdown`, the server serves the raw `.md` file with `Content-Type: text/markdown; charset=utf-8`.
2. **Permissive CORS**:
   AI scrapers and web apps can fetch markdown documentation and `/llms.txt` without encountering cross-origin restrictions.
3. **Clean URLs & SPA Fallback**:
   Allows user navigation without the `#` character when hosted on platforms supporting server-side rewrites.
4. **Zero-Config Fallback**:
   On simple static hosts (raw S3, USB drives, `file://`), VertiWiki continues to run 100% out of the box via hash routing (`#/guide.md`) without needing any of these recipes.

---

## 💡 Root vs. Subfolder Deployment & Trailing Slashes

- **Trailing Slash Guarantee**:
  When deploying VertiWiki in a directory (such as `/docs/`), web servers and CDNs must preserve or enforce the trailing slash (`/docs/` instead of `/docs`). If a host strips the trailing slash (such as Vercel with `"trailingSlash": false`), incoming requests like `/docs/#/` get 308-redirected to `/docs#/`. This breaks RFC-compliant relative resource resolution (`fetch('config.json')`) and generates malformed URL bars.
  All recipes in this directory explicitly enforce trailing slashes on directory routes (for example, `"trailingSlash": true` in `vercel.json`, `pretty_urls = true` in `netlify.toml`, `DirectorySlash On` in Apache, and CloudFront/Cloudflare 308 normalization).

- **Subfolder Rewrites**:
  All recipes in this directory are configured by default for **root domain deployment** (`/`). If you host VertiWiki inside a subfolder alongside another website (such as `/docs/` or `/wiki/`), prefix the respective rules with your subfolder path (for example, change `/:path*` to `/docs/:path*` and `/index.html` to `/docs/index.html`).
