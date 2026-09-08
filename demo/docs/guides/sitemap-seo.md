---
title: XML Sitemaps, SEO & Bot Indexing Guide
description: Best practices for search engine indexing (Googlebot, Bingbot), avoiding the GSC Discovered - currently not indexed trap, and deploying XML sitemaps for VertiWiki.
tags: [sitemap, seo, aeo, googlebot, indexing, search-console]
---

# XML Sitemaps, Search Engine Indexing & Bot Crawl Trees

This guide explains how **XML Sitemaps (`sitemap.xml`)** and **Search Engine Crawlers (Googlebot, Bingbot, PerplexityBot)** interact with VertiWiki, how to avoid common indexing pitfalls in Google Search Console, and how to structure your wiki for maximum search and answer engine visibility.

---

## 🧭 Visual Sitemap vs. XML Sitemap

In VertiWiki, there are two distinct types of sitemaps designed for different consumers:

| Type | Target Audience | Technology | Purpose |
| :--- | :--- | :--- | :--- |
| **Visual Sitemap** | Human visitors | Client-side `::: sitemap` plugin | Interactive directory cards, counts, and live filtering. |
| **XML Sitemap** | Search engines & crawlers | Static `sitemap.xml` at domain root | Formal machine-readable URL catalog submitted to Google Search Console / Bing. |

---

## ⚠️ The Hash Fragment (`#`) Search Engine Trap

Because VertiWiki operates as a zero-backend client-side single-page application (SPA), in-app navigation utilizes hash routes (e.g. `https://yourdomain.com/docs/#/guides/deployment.md`).

> [!CAUTION]
> **Never put URL fragments (`#`) in `sitemap.xml`!**
> 1. Under **RFC 3986**, URL fragments (`#`) are strictly client-side identifiers and are **never sent over HTTP** to the web server.
> 2. The official **[sitemaps.org protocol](https://www.sitemaps.org/protocol.html)** and **Googlebot specifications** explicitly state that search engine crawlers strip fragment identifiers.
> 3. If you place `https://yourdomain.com/docs/#/features.md` in `sitemap.xml`, Googlebot strips everything after `#`, converting every entry into `https://yourdomain.com/docs/` and discarding the rest as duplicate URLs.

---

## 🔍 Understanding "Discovered – currently not indexed" (GSC)

A common issue reported in Google Search Console for static and markdown documentation engines is **"Discovered – currently not indexed"** (*Descoperită – nu este indexată*), where the "Last crawl" timestamp remains `1970-01-01` (meaning Googlebot has never actually crawled the page).

### Why does this happen?

1. **Non-HTML MIME Type (`.md` / `.txt`)**:
   Googlebot prioritizes web documents served as `text/html`. Raw Markdown (`.md`) and text (`llms.txt`) files receive low crawl budget priority unless strongly reinforced by incoming HTML links.
2. **Orphan URLs (Zero Inbound HTML Links)**:
   Googlebot determines crawl priority primarily from inbound links (`<a href="...">`). In a pure client-side SPA with an empty initial HTML container (`<div id="verti-app"></div>`), Googlebot's initial HTTP fetch finds zero static links. URLs listed only in `sitemap.xml` are classified as **orphan URLs** and queued with minimal priority.
3. **Sitemap Noise & Pollution**:
   Including error pages (such as `docs/404.md` or localized `404.md`), agent configuration files (`llms.txt`), or duplicate pages (e.g. `README.md` alongside `index.md`) degrades Googlebot's trust score for your sitemap, causing it to defer crawling.

---

## 🌳 The Solution: VertiWiki's Static Bot Crawl Tree

To eliminate the "orphan URLs" penalty without requiring a server-side build step or complex backend, VertiWiki includes a **Static Bot Crawl Tree** directly in `index.html`.

### How it works:

1. In the starter `index.html` (and inside `<noscript>` and `.verti-loading-shell`), VertiWiki embeds semantic `<a href="...">` anchor tags pointing directly to all articles:

   ```html
   <!-- VertiWiki Static Bot Crawl Tree -->
   <nav class="verti-crawl-tree" aria-label="Documentation Navigation Index">
     <h3>Getting Started</h3>
     <ul>
       <li><a href="index.md">Welcome to VertiWiki</a></li>
       <li><a href="docs/getting-started/installation.md">Installation Guide</a></li>
       <li><a href="features.md">Modern Features</a></li>
     </ul>
   </nav>
   ```

2. When Googlebot or Bingbot makes the initial HTTP request to your wiki root (`/docs/`), it immediately discovers real anchor links to all articles.
3. The pages in `sitemap.xml` are no longer orphan URLs; they have established inbound internal link equity, prompting Googlebot to crawl and index them.
4. When a human user opens the page with JavaScript enabled, the client-side router and theme engine bootstrap in less than 1 ms, replacing the static loading shell with the interactive VertiWiki application.

---

## 📄 Clean `sitemap.xml` Best Practices

When generating `sitemap.xml` for VertiWiki:

### 1. What to INCLUDE:
* The wiki root URL (e.g. `https://yourdomain.com/docs/`).
* Real canonical documentation files (e.g. `https://yourdomain.com/docs/installation.md`).
* Genuine `<lastmod>` dates matching your file modification times.

### 2. What to EXCLUDE:
* ❌ **Never include error pages**: Remove `404.md`, `fr/404.md`, `ro/404.md`.
* ❌ **Never include `llms.txt` in web sitemaps**: Reference `llms.txt` via `robots.txt` and `<link rel="llms-txt">`, not in web SERP sitemaps.
* ❌ **Never include duplicate aliases**: If you have `index.md`, exclude `README.md`.
* ❌ **Never use URL hashes (`#`)**: Exclude `#/...` fragments.

### Example: Production-Ready `sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Wiki Root Application -->
  <url>
    <loc>https://yourdomain.com/docs/</loc>
    <lastmod>2026-09-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Core Articles -->
  <url>
    <loc>https://yourdomain.com/docs/index.md</loc>
    <lastmod>2026-09-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/docs/features.md</loc>
    <lastmod>2026-09-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/docs/guides/deployment.md</loc>
    <lastmod>2026-09-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## 🔄 Content Negotiation & Human Reader Redirection

If search engines index raw `.md` URLs (e.g. `https://yourdomain.com/docs/guides/deployment.md`), a human user clicking a Google result might see raw monospaced text instead of the VertiWiki interface.

VertiWiki's router supports query parameters (`?page=...`, `?p=...`, `?doc=...`) to solve this seamlessly:

### Server-Level Content Negotiation (Nginx Example)

Configure Nginx to inspect the `Accept` header:
* If a browser requests a `.md` file with `Accept: text/html`, rewrite it to `index.html?page=...` so the VertiWiki UI renders.
* If an AI agent, crawler, or `curl` requests with `Accept: text/markdown` or `*/*`, serve the raw Markdown file directly.

```nginx
# Nginx Content Negotiation for VertiWiki
location ~* ^/docs/(.+\.md)$ {
    # If the client is a human browser requesting HTML, route into VertiWiki
    if ($http_accept ~* "text/html") {
        rewrite ^/docs/(.+\.md)$ /docs/?page=$1 last;
    }
    # Otherwise, serve raw Markdown for AI agents and scrapers
    default_type text/markdown;
    try_files $uri =404;
}
```

### Cloudflare Pages / Workers Example

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const accept = request.headers.get('Accept') || '';

    // Route human browser visits on *.md into VertiWiki viewer
    if (url.pathname.endsWith('.md') && accept.includes('text/html')) {
      const pagePath = url.pathname.replace(/^\/docs\//, '');
      return Response.redirect(`${url.origin}/docs/#/${pagePath}`, 302);
    }

    return fetch(request);
  }
};
```

### Vercel Example (`vercel.json`)

Configure `vercel.json` in your project root to redirect human browser requests (`Accept: text/html`) to the VertiWiki hash route:

```json
{
  "redirects": [
    {
      "source": "/docs/(.*\\.md)",
      "has": [
        {
          "type": "header",
          "key": "accept",
          "value": ".*text\\/html.*"
        }
      ],
      "destination": "/docs/#/$1",
      "permanent": false
    }
  ]
}
```

---

## 🤖 AEO & AI Engine Synergy (`llms.txt`)

For AI search engines and answer engines (Perplexity, ChatGPT, Claude):

1. **`robots.txt`**: Ensure all AI crawlers are granted permission:
   ```text
   User-agent: *
   Allow: /

   User-agent: GPTBot
   Allow: /

   User-agent: ClaudeBot
   Allow: /

   User-agent: PerplexityBot
   Allow: /

   Sitemap: https://yourdomain.com/sitemap.xml
   ```
2. **`llms.txt`**: Place an `llms.txt` file at your domain root adhering to the `llmstxt.org` specification.
3. **JSON-LD Schema.org**: VertiWiki automatically injects `TechArticle` and `BreadcrumbList` microdata into the document `<head>` on every route transition.
