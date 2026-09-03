---
title: VertiWiki Documentation Hub
description: Complete reference guide for VertiWiki — the 100% client-side, zero-backend Markdown wiki engine.
tags: [vertiwiki, documentation, wiki, markdown, client-side]
---

# 📚 VertiWiki Documentation Hub

Welcome to the **VertiWiki** comprehensive documentation. VertiWiki is a fast, modern **client-side documentation engine** that runs entirely in the browser — **zero backend servers, zero databases, zero build steps**.

---

## 🚀 Getting Started

New to VertiWiki? Start here:

- **[[getting-started/introduction]]** — Overview and core concepts
- **[[getting-started/quick-start]]** — 5-minute hands-on setup
- **[[getting-started/installation]]** — Installation flavors and deployment options

---

## 📖 Core Concepts

Understand how VertiWiki works under the hood:

- **[[concepts/architecture]]** — System architecture and lifecycle stages
- **[[concepts/pipeline-and-parser]]** — Markdown pipeline, BeforeParse/AfterParse/AfterRender hooks
- **[[concepts/routing-and-fetching]]** — Client-side hash routing and path resolution
- **[[concepts/plugins-system]]** — Suite of built-in extensions and custom plugins

---

## ⚙️ Configuration

Fine-tune VertiWiki to your needs:

- **[[configuration/overview]]** — All configuration options and analytics integrations
- **[[configuration/themes-and-styling]]** — Theme system, JSON schemas, and visual presets
- **[[configuration/i18n-and-locales]]** — Multi-language routing and locale prefixes

---

## 📚 Guides

Step-by-step operational walkthroughs:

- **[[guides/authoring-content]]** — Wikilinks, GFM callouts, KaTeX, Mermaid, media embedding
- **[[guides/deployment]]** — Static hosting, CDN deployment, Docker, GitHub Pages
- **[[guides/development]]** — Local development server, testing, and build commands
- **[[guides/search-and-aeo]]** — MiniSearch in-memory indexing and AEO metadata
- **[[guides/troubleshooting]]** — Common error patterns and diagnostic solutions

---

## 🔍 API Reference

Verbatim TypeScript interfaces and schemas:

- **[[reference/configuration-schema]]** — Complete `config.json` TypeScript interface
- **[[reference/plugin-api]]** — Plugin interface and extension hooks
- **[[reference/theme-schema]]** — Complete JSON theme schema with examples

---

## 📊 Feature Highlights

- ✅ **Single-File Distribution** — Deploy as `vertiwiki.html` or `index.html`
- ✅ **Native Wikilinks** — `[[page]]`, `[[page|alias]]`, `[[page#anchor]]`
- ✅ **Modular Themes** — Theme files in `themes/` with dynamic Google Fonts
- ✅ **Answer Engine Optimization (AEO)** — Schema.org JSON-LD, `llms.txt`, AI export
- ✅ **Instant Offline Search** — Fuzzy full-text search with MiniSearch
- ✅ **Math & Diagrams** — KaTeX math, Mermaid.js interactive diagrams
- ✅ **GFM Alerts** — `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`
- ✅ **Code Tabs & Details** — `::: tabs`, `::: details` syntax
- ✅ **Image Lightbox** — Click to zoom with lightbox modal
- ✅ **Prev/Next Navigation** — Auto-generated sequential reading cards
- ✅ **Universal Analytics** — GA4, GTM, Plausible, Cloudflare, Umami, Matomo

---

## 🔗 External Resources

- **[Live Demo](https://verti.wiki)** — See VertiWiki in action
- **[GitHub Repository](https://github.com/Octadira/vertiwiki)** — Source code and releases
- **[NPM Package](https://www.npmjs.com/package/vertiwiki)** — Install via npm
- **[Contributing Guide](./CONTRIBUTING.md)** — How to contribute

---

## 📌 Quick Links

| | |
|---|---|
| 🎯 **Use Case** | Building documentation sites, knowledge bases, internal wikis |
| 💻 **Tech Stack** | TypeScript 5.7+, Vite 6.2+, Node 24+ |
| 📦 **Distribution** | Single-file HTML or alongside Markdown files |
| 🔒 **Security** | XSS protection via DOMPurify, zero `eval()` |
| ⚡ **Performance** | Client-side rendering, zero server load |

---

**Last Updated**: September 2026 | **Version**: 0.6.0 | **License**: MIT
