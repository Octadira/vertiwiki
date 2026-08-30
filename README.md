# 🧠 VertiWiki 0.2.6 :badge[AI & AEO Ready]{type=success}

> **The 100% Client-Side, Zero-Backend, Zero-Build Markdown Wiki & Documentation Engine for 2026 and Beyond.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2+-646CFF.svg)](https://vitejs.dev/)
[![Version](https://img.shields.io/badge/version-0.2.6-teal.svg)](https://github.com/octadira/vertiwiki/releases)
[![Live Demo](https://img.shields.io/badge/Demo-verti.wiki-emerald.svg)](https://verti.wiki)

[**🌐 Live Demo & Official Website**](https://verti.wiki) • [**📖 Documentation**](https://verti.wiki/#docs/getting-started/quick-start.md) • [**📦 Releases**](https://github.com/Octadira/vertiwiki/releases)

VertiWiki is a fast, modern client-side documentation engine. It runs completely in the browser via client-side JavaScript, rendering Markdown documents on the fly with **zero backend servers, zero databases, and zero server-side build steps required for content updates**.

---

## ✨ Features (2026+)

* 📦 **Single-File Distribution**: Ship a single standalone `vertiwiki.html` (or `index.html`) alongside your `.md` files.
* 🎨 **Modular Theme Engine**: Standalone theme files in `themes/` (e.g. `themes/obsidian.json`) with zero build steps and dynamic Google Fonts.
* 🤖 **Answer Engine Optimization (AEO)**: Dynamic Schema.org JSON-LD graph generation, `llms.txt`, and 1-click **Copy for AI** prompt exporter.
* 🏷️ **Jekyll / Astro Frontmatter**: Native YAML metadata support with automatic smart fallback deduction.
* 📑 **Interactive Markdown Suite**: Code tabs (`::: tabs`), collapsible FAQs (`::: details`), and image lightbox zoom.
* 🔀 **Prev / Next Article Navigation**: Auto-generated sequential reading cards.
* 📊 **Universal Analytics**: Dynamic zero-recompile tracking for GA4, GTM, Plausible, Cloudflare, Umami, and Matomo.
* 🚀 **Modern Web Stack**: Built with **Vite 6**, **TypeScript 5.7+**, and targeting **Node 24+**.
* 🛡️ **Guaranteed Security**: Full XSS protection via [DOMPurify](https://github.com/cure53/DOMPurify) and zero use of `eval()`.
* ⚡ **Instant Offline Search**: Client-side full-text search with fuzzy matching powered by **MiniSearch** (`⌘K` or `/`).
* 📐 **KaTeX Math & Mermaid.js**: Fast LaTeX math equations and interactive diagrams in pure Markdown.
* 📢 **GFM Alerts & Callouts**: GitHub-style `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!IMPORTANT]`, `> [!CAUTION]`.
* 🧭 **Dynamic TOC & Scrollspy**: Real-time Table of Contents powered by `IntersectionObserver`.

---

## 🚀 Quick Start

### 1. Requirements
* **Node.js**: `>= 22` (Recommended: Node 24 LTS)
* **Package Manager**: `npm`

### 2. Install & Start Development Server
```bash
# Clone and install dependencies
npm install

# Start local dev server with hot reload
npm run dev
```

### 3. Build Single-File Release
```bash
# Build standalone bundle
npm run build
```
This generates `dist/vertiwiki.html` and `dist/index.html`. You can drop either file into any folder containing Markdown files (`index.md`, `navigation.md`, `config.json`, `themes/`) and open it directly or serve it via static hosting.

---

## 📁 File Structure

```
.
├── config.json         # Wiki configuration (title, theme, analytics, features)
├── themes/             # Dedicated custom theme JSON files (e.g. obsidian.json)
├── navigation.md       # Sidebar navigation structure
├── index.md            # Home page content
├── 404.md              # Fallback not found page
├── llms.txt            # AI discovery index (llmstxt.org)
├── robots.txt          # Crawler permissions for AI bots
├── dist/
│   ├── index.html      # Standalone single-file build
│   └── vertiwiki.html # Standalone distribution file
└── src/
    ├── core/           # Parser, Router, Config, Pipeline
    ├── plugins/        # AEO, Analytics, Search, Math, Mermaid, Callouts, Badges, Tabs, Details, Lightbox
    └── ui/             # Layout, Themes, TOC, Search Modal, PrevNext
```
