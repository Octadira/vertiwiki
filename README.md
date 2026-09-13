# 🧠 VertiWiki 0.10.0 "Épure"

> The next-generation, 100% static, single-file Markdown wiki & documentation engine built for 2026 and beyond.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-purple.svg)](https://vitejs.dev/)
[![Single File HTML](https://img.shields.io/badge/Bundle-Single--File-emerald.svg)](dist/vertiwiki.html)
[![Version](https://img.shields.io/badge/version-0.10.0-teal.svg)](https://github.com/Octadira/vertiwiki/releases)
[![Tests](https://img.shields.io/badge/tests-110%20passed-brightgreen.svg)](#-automated-testing)
[![AI & AEO Ready](https://img.shields.io/badge/AI_%26_AEO-Ready-2ea44f.svg)](#-answer-engine-optimization-aeo)
[![Live Demo](https://img.shields.io/badge/Demo-verti.wiki-emerald.svg)](https://verti.wiki)

[**🌐 Live Demo & Official Website**](https://verti.wiki) • [**📖 Documentation**](https://verti.wiki/#docs/getting-started/quick-start.md) • [**📦 Releases**](https://github.com/Octadira/vertiwiki/releases) • [**🚀 Deployment Recipes**](./deploy)

VertiWiki is a lightning-fast, modern client-side documentation engine. It runs 100% in the browser via client-side JavaScript, rendering Markdown documents on the fly with **zero backend servers, zero databases, and zero server-side build steps required for content updates**.

---

## ✨ Features (2026+)

* 📦 **Single-File Distribution**: Ship a single standalone `vertiwiki.html` (or `index.html`) alongside standard `.md` files.
* 🏛️ **Modular Layout Engine (`data-layout`)**: Switch between `default`, `book`, `handbook`, `api`, and `hub` layouts globally in `config.json` or per-page via Frontmatter (`layout: book`, `layout: api`), powered by zero-bloat CSS Grid.
* 📖 **Reading Ergonomics for Non-Technical Docs (`contentWidth: "readable"`)**: Set optimal 68ch line length with relaxed 1.8 line height for company policies, employee onboarding, digital books, and long-form essays.
* 🌳 **Static Bot Crawl Tree & Zero-Orphan SEO**: Built-in semantic HTML crawl tree (`<nav class="verti-crawl-tree">`) producing clean anchor links to resolve Google Search Console's "Discovered - currently not indexed" penalty on zero-backend SPAs.
* 🔀 **Server-Side Content Negotiation & Query Routing**: Native URL query parameter routing (`?page=`, `?p=`, `?doc=`) and HTTP Content Negotiation (`Accept: text/markdown`) with production-ready recipes for all major hosts.
* 🌐 **Native Multi-Language (i18n) & Subfolder Mirrors**: Configurable locales in `config.json` (`locales: [...]`), dynamic subfolder mirroring (`fr/`, `ro/`), language switcher dropdown, and locale-scoped search.
* 🔗 **Native Wikilinks & PKM Interoperability**: Built-in client-side support for `[[page]]`, `[[page|alias]]`, and `[[page#anchor]]` with intelligent code fence protection and Obsidian vault compatibility.
* 🎨 **Decoupled Standalone Themes & Inheritance**: Bundled engine ships with a single canonical **Modern Monochrome & Slate** preset, while rich themes (`terracotta`, `emerald`, `nord`, `dracula`, `amethyst`, `editorial`, `obsidian`, `onyx-ops`) resolve as decoupled JSON files in `themes/`.
* ⚡ **Optimized Standalone Footprint**: Built-in KaTeX WOFF2 font pruning reduces CSS payload by 73% and brings the standalone single-file distribution to ~4.0 MB.
* 🤖 **Answer Engine Optimization (AEO)**: Dynamic Schema.org JSON-LD breadcrumb graphs, `<meta name="agent-docs">`, `llms.txt` integration, and 1-click **Copy for AI** prompt exporter (toggleable for non-technical docs via `enableAiCopy`).
* 🛡️ **Guaranteed Zero-XSS Security**: Complete XSS protection via [DOMPurify](https://github.com/cure53/DOMPurify), centralized HTML escaping, iframe origin validation, and zero use of `eval()`.
* ⚡ **Instant Offline Search**: Client-side full-text search with fuzzy matching and locale scoping powered by **MiniSearch** (`⌘K` or `/`).
* 📐 **KaTeX Math & Mermaid.js**: Fast LaTeX math equations and theme-aware interactive diagrams with complete `<foreignObject>` text node preservation and automatic dark/light contrast harmonization.
* 📑 **Interactive Markdown Suite & Synced Tabs**: Code tabs (`::: tabs`) with synchronized switching across the document, collapsible FAQs (`::: details`), image lightbox zoom, and GFM alerts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, etc.).
* 🗂️ **Directory Indexing & Trailing Slash Normalization**: Automatic index resolution (`dir/` $\rightarrow$ `dir/index.md`), sibling fallbacks (`dir.md`), and defensive address bar normalization.
* 🧭 **Dynamic TOC & Scrollspy**: Real-time Table of Contents powered by `IntersectionObserver`.
* 📊 **Universal Analytics**: Dynamic zero-recompile tracking for GA4, GTM, Plausible, Cloudflare, Umami, and Matomo.
* 🧪 **Automated Testing Suite**: 19 test suites and 110 unit tests powered by **Vitest**.

---

## 🚀 Quick Start

### 1. Requirements
* **Node.js**: `>= 22` (Recommended: Node 24 LTS)
* **Package Manager**: `npm`

### 2. Install & Start Development Server
```bash
# Clone repository and install dependencies
npm install

# Start local dev server with hot reload
npm run dev
```

### 3. Run Automated Unit Tests
```bash
# Execute test suite with Vitest
npm test
```

### 4. Build Standalone Single-File Release
```bash
# Compile standalone single-file bundles
npm run build
```
This generates `dist/vertiwiki.html` and `dist/index.html`. You can drop either file into any folder containing Markdown files (`index.md`, `navigation.md`, `config.json`, `themes/`) and open it directly or serve it via any static hosting.

### 5. Preview Production Bundle
```bash
# Preview production build locally
npm run preview
```

---

## 📁 Repository Structure

```
verti-wiki/
├── config.json             # Wiki configuration (title, theme, locales, features)
├── index.html              # Core application entry point & bot crawl tree
├── vite.config.ts          # Vite 6 build configuration & KaTeX font optimization
├── tsconfig.json           # TypeScript 5.7+ compiler configuration
├── package.json            # Project dependencies and npm scripts
│
├── demo/                   # Isolated test suite and demo fixtures
│   ├── index.md            # Demo home page
│   ├── navigation.md       # Demo navigation tree
│   ├── 404.md              # Fallback not found page
│   ├── llms.txt            # AI discovery index (llmstxt.org)
│   ├── robots.txt          # Crawler permissions for AI bots
│   ├── docs/               # Demo documentation guides & articles
│   └── fr/                 # Multi-language mirror fixture (French)
│
├── deploy/                 # Production deployment recipes & server configurations
│   ├── vercel/             # Vercel Edge configuration with trailing slash fix
│   ├── cloudflare/         # Cloudflare Pages headers & Edge Worker snippet
│   ├── netlify/            # Netlify redirects & headers
│   ├── nginx/              # Nginx configuration with $http_accept map
│   ├── apache/             # Apache .htaccess configuration
│   ├── aws/                # AWS CloudFront Function & S3 policy
│   └── github-pages/       # GitHub Pages 404 fallback routing
│
├── dist/                   # Standalone single-file production builds
│   ├── index.html          # Standalone single-file build
│   └── vertiwiki.html      # Standalone distribution file
│
├── src/                    # TypeScript source code
│   ├── core/               # Parser, Router, Config, Pipeline, Crawl Tree
│   ├── plugins/            # AEO, Analytics, Search, Math, Mermaid, Wikilinks, Tabs...
│   └── ui/                 # Layout, Themes, TOC, Search Modal, PrevNext, Language Chooser
│
├── tests/                  # Automated unit test suite (Vitest)
│   ├── config.test.ts      # Configuration loading and fallback tests
│   ├── crawl-tree.test.ts  # Semantic bot crawl tree generation tests
│   ├── layout-engine.test.ts # Layout modes, header links, and synced tabs tests
│   ├── parser.test.ts      # Markdown parsing and slugification tests
│   ├── router-i18n.test.ts # Locale routing and path normalization tests
│   ├── security.test.ts    # Zero-XSS and iframe security tests
│   └── ...                 # 19 test suites covering all plugins and modules
│
└── themes/                 # Dedicated custom theme JSON definitions
    ├── amethyst.json       # Deep purple & violet theme
    ├── apple-minimal.json  # Clean Cupertino aesthetic
    ├── dracula.json        # Classic dark vampire theme
    ├── editorial.json      # Warm literary reading theme
    ├── emerald.json        # Modern forest green theme
    ├── genome-teal.json    # Biotech-inspired teal theme
    ├── nord.json           # Arctic ice & blue theme
    ├── obsidian.json       # Obsidian-inspired theme
    ├── onyx-ops.json       # Dark high-contrast operations theme
    ├── signal-docs.json    # High-visibility developer docs theme
    └── terracotta.json     # Warm clay & rust theme
```

---

## 🌐 Deployment & Architectural Principles

VertiWiki operates under modern architectural principles designed for both human readers and autonomous AI agents:

1. **Hash Routing for Humans**: Human navigation uses client-side hash routes (`#/docs/guide.md`). The web server only serves `index.html`; routing is resolved client-side with zero server rewrites required.
2. **Content Negotiation for AI Agents**: When autonomous agents (Claude Code, Cursor, Aider, OpenCode) send `Accept: text/markdown`, the server serves the raw `.md` file with `Content-Type: text/markdown; charset=utf-8`.
3. **Never Use Blanket SPA Rewrites**: Catch-all rewrites (`/* -> index.html 200`) create harmful Soft 404s and fail AEO/SEO stability audits. Genuine HTTP 404 status codes must always be preserved for non-existent files.

Official, pre-configured recipes are located in [`deploy/`](./deploy).

---

## 🧪 Automated Testing

VertiWiki includes an extensive test suite verifying Markdown parsing, plugin hooks, locale handling, path resolution, crawl trees, layout modes, and XSS sanitization:

```bash
npm test
```

All 19 test suites and 108 unit tests must pass before compiling production releases.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
