---
title: Welcome to VertiWiki
description: 100% static, single-file, zero-backend Markdown wiki and documentation engine for 2026 and beyond.
tags: [wiki, markdown, documentation, static]
---

# Welcome to VertiWiki :badge[v0.8.3]{type=primary} :badge[AI & AEO Ready]{type=success}

> **Zero Backend &bull; Zero Server Build &bull; Single-File Wiki & Docs Engine for 2026 and Beyond**

---

> [!NOTE]
> You are currently viewing the modernized **VertiWiki 0.8.3** engine. It renders pure Markdown directly in your browser with zero build steps needed on the server, featuring zero-FOUC adaptive skeleton loading and instant in-memory page caching.

---

## Why VertiWiki?

VertiWiki combines the simplicity of Markdown with modern web capabilities:

* **Zero Backend & Zero Build**: Works on any static hosting (GitHub Pages, Netlify, Cloudflare Pages, S3, Vercel) or straight from a local USB drive.
* **Instant Perceived Speed**: Zero-FOUC critical skeleton screen with GPU-accelerated shimmer animations and 0 ms in-memory page caching.
* **Static Bot Crawl Tree & Zero-Orphan SEO**: Built-in semantic crawl trees with RFC-compliant anchors to resolve Google Search Console's "Discovered - currently not indexed" penalty on client SPAs.
* **AEO & LLM Ready**: AgentDocsSpec discovery directive (`llms-txt-directive-html`), Schema.org JSON-LD graphs, Jekyll-style frontmatter, configurable `llms.txt`, and 1-click **Copy for AI**.
* **Native Wikilinks & PKM Interop**: Full `[[page]]`, `[[page|alias]]`, and `[[page#anchor]]` support with Obsidian vault compatibility.
* **Native Multi-Language (i18n)**: Subfolder language mirroring (`fr/`, `ro/`), SVG globe switcher, and locale-scoped instant full-text search.
* **Single-File Distribution**: The entire engine is bundled into a standalone `vertiwiki.html` file (~4.0 MB with pruned WOFF2 fonts).
* **Universal Analytics**: Zero-recompile tracking for GA4, GTM, Plausible, Cloudflare, Umami, and Matomo.
* **Multi-Theme Engine**: 7 presets (including Warm Terracotta and Forest Emerald), standalone JSON themes (`themes/`), theme inheritance (`extends`), and instant palette chooser.
* **Interactive Markdown Suite**: Code tabs (`::: tabs`), collapsible FAQs (`::: details`), image lightbox zoom, and automatic prev/next navigation cards.
* **Full-Text Offline Search**: Instant client-side indexer with fuzzy search (`⌘K` or `/`).
* **Dark / Light Mode**: Seamless theme switching with OKLCH colors and system preference detection.

---

## Quick Example: Markdown Callouts

VertiWiki natively supports GitHub-style GFM alerts:

> [!NOTE]
> Helpful information and context for the user.

> [!TIP]
> Pro-tips and best practices to boost efficiency.

> [!IMPORTANT]
> Crucial instructions that users must not overlook.

> [!WARNING]
> Warnings and breaking changes.

> [!CAUTION]
> Potentially risky actions.

---

## Interactive Code Tabs

::: tabs
== npm
```bash
npm install vertiwiki
```
== pnpm
```bash
pnpm add vertiwiki
```
== yarn
```bash
yarn add vertiwiki
```
:::

---

## What to explore next?

* 🚀 [Modern Features & Interactive Components](features.md)
* 🎨 [Themes & Design Tokens Guide](themes.md)
* 🛠️ [Architecture Overview](docs/architecture/overview.md)
* 📝 [Authoring Guide](docs/guides/authoring.md)
