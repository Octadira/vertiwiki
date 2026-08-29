---
title: XML Sitemaps & SEO Guide
description: How to generate and deploy sitemap.xml for VertiWiki using online generators and best practices for SPA search engine indexing.
tags: [sitemap, seo, aeo, googlebot, indexing]
---

# XML Sitemaps & Search Engine Indexing

This guide explains how **XML Sitemaps (`sitemap.xml`)** work for VertiWiki, how to generate them using free online tools without building or coding, and how to configure them for maximum visibility in Google, Bing, and AI search engines (ChatGPT, Perplexity, Claude).

---

## 🧭 Visual Sitemap vs. XML Sitemap

In VertiWiki, there are two complementary types of sitemaps:

| Type | Purpose | Audience | Technology |
| :--- | :--- | :--- | :--- |
| **Visual Sitemap** | Interactive directory tree & live search in documentation | Human readers & users | Built-in `::: sitemap` plugin (100% client-side) |
| **XML Sitemap** | Formal machine-readable URL catalog (`sitemap.xml`) | Search engine bots (Googlebot, Bingbot, Perplexity) | Static `sitemap.xml` file hosted on your web server |

---

## ⚠️ The SPA / Hash Route (`#!`) Challenge

Because VertiWiki is a **zero-backend, client-side SPA (Single-Page Application)**, routes are represented with URL hashes (e.g. `https://yourdomain.com/vertiwiki.html#!docs/guides/authoring.md`).

> [!IMPORTANT]
> Standard / basic HTML scrapers do **not** execute JavaScript and ignore URL fragments (`#`). Therefore, when using online sitemap generators, you must use tools that either:
> 1. **Support JavaScript rendering** (Headless Browser crawler), OR
> 2. **Convert a list of URLs directly to XML** (Recommended — takes 10 seconds!).

---

## 🛠️ Method 1: Generate `sitemap.xml` from URL List (Fastest & 100% Reliable)

The easiest and most reliable method is using a free **List-to-XML Sitemap Generator**:

### Step 1: Copy your list of URLs
Based on your `navigation.md` and domain (e.g. `https://docs.mycompany.com/`):

```text
https://docs.mycompany.com/vertiwiki.html
https://docs.mycompany.com/vertiwiki.html#!index.md
https://docs.mycompany.com/vertiwiki.html#!features.md
https://docs.mycompany.com/vertiwiki.html#!themes.md
https://docs.mycompany.com/vertiwiki.html#!sitemap.md
https://docs.mycompany.com/vertiwiki.html#!docs/getting-started/installation.md
https://docs.mycompany.com/vertiwiki.html#!docs/guides/authoring.md
https://docs.mycompany.com/vertiwiki.html#!docs/guides/deployment.md
https://docs.mycompany.com/vertiwiki.html#!docs/guides/sitemap-seo.md
https://docs.mycompany.com/vertiwiki.html#!docs/architecture/overview.md
https://docs.mycompany.com/vertiwiki.html#!docs/architecture/theme-engine.md
https://docs.mycompany.com/vertiwiki.html#!docs/api/plugins.md
https://docs.mycompany.com/vertiwiki.html#!Changelog.md
https://docs.mycompany.com/vertiwiki.html#!docs/versioning-and-roadmap.md
```

### Step 2: Paste into a free Online Converter
Use any of these free web tools:
* **[Online XML Sitemap Generator](https://www.xml-sitemaps.com/)** (Text input mode)
* **[Free Sitemap Generator (Web-Tool)](https://codebeautify.org/xml-sitemap-generator)**
* **[Convert CSV / Text to XML Sitemap](https://www.convertcsv.com/csv-to-xml.htm)**

### Step 3: Download and save as `sitemap.xml`

---

## 🤖 Method 2: Free Online JavaScript SPA Crawlers

If you want an online crawler to discover your pages automatically:

1. **[Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)** (Free up to 500 URLs):
   * Set *Configuration &rarr; Spider &rarr; Rendering &rarr; JavaScript*.
   * Enter your VertiWiki URL.
   * Click *Sitemaps &rarr; XML Sitemap &rarr; Export*.
2. **[Octopus.do / Slickplan](https://octopus.do/)**: Visual sitemap scraper with SPA support.

---

## 📄 Example: Valid `sitemap.xml` for VertiWiki

Here is a ready-to-use template you can save directly as `sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/vertiwiki.html</loc>
    <lastmod>2026-08-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/vertiwiki.html#!features.md</loc>
    <lastmod>2026-08-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/vertiwiki.html#!themes.md</loc>
    <lastmod>2026-08-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/vertiwiki.html#!sitemap.md</loc>
    <lastmod>2026-08-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/vertiwiki.html#!docs/getting-started/installation.md</loc>
    <lastmod>2026-08-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/vertiwiki.html#!docs/architecture/overview.md</loc>
    <lastmod>2026-08-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

---

## 🚀 How to Deploy `sitemap.xml`

1. **Place `sitemap.xml` at the root of your website** alongside `vertiwiki.html` and `robots.txt`.
2. **Reference it in `robots.txt`**:
   ```text
   User-agent: *
   Allow: /

   Sitemap: https://yourdomain.com/sitemap.xml
   ```
3. **Submit to Search Consoles**:
   * **Google Search Console**: Go to *Sitemaps* &rarr; Add `sitemap.xml` &rarr; Submit.
   * **Bing Webmaster Tools**: Go to *Sitemaps* &rarr; Submit sitemap URL.

---

## ⚡ AEO (Answer Engine Optimization) Synergy

When `sitemap.xml` is deployed alongside VertiWiki's built-in AEO features:

1. **`robots.txt` + `sitemap.xml`**: Directs AI crawlers (GPTBot, ClaudeBot, PerplexityBot) to all available pages.
2. **`llms.txt`**: Provides an LLM-tailored overview adhering to the `llmstxt.org` standard.
3. **Dynamic Schema.org JSON-LD**: Automatically generated by VertiWiki's `aeo.ts` plugin for each article (`TechArticle`, `BreadcrumbList`, `WebSite`).
