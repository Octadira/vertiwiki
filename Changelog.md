# Changelog

## VertiWiki 0.4.1 (September 2026) :badge[Latest]{type=success}

### 🐞 Bug Fixes & Navigation Resiliency
- **Localized Navigation Link Resolution**: `parseNavigationMarkdown` automatically resolves relative links in localized subfolder navigation files (`ro/navigation.md`, `fr/navigation.md`) to point strictly to the active language route instead of defaulting to English.
- **Accordion State Preservation on Language Switch**: Navigation accordion groups now evaluate normalized route paths, keeping the active section expanded and highlighting the active link when switching between languages.
- **Prev/Next Navigation Multi-Language Support**: Correctly matches active document paths across localized mirrors for seamless previous/next navigation.
- **Double Prefix Protection**: `resolvePath` safely checks for existing locale base directory prefixes to prevent double-prefixing.

---

## VertiWiki 0.4.0 (August 2026)

### 🌐 Native Multi-Language (i18n) & Mirror Architecture
- **Zero-Backend Multi-Language Support**: Configurable locales in `config.json` (`locales: [...]`) with dynamic subfolder mirroring (`fr/`, `ro/`, etc.).
- **Smart Locale Hash Router**: Router dynamically detects active language prefixes from hash paths (`#/fr/...` vs `#/ro/...`) and preserves current document paths when switching languages.
- **Language Chooser Dropdown**: Modern SVG globe switcher in the header with active checkmarks and outside-click dismissal, appearing automatically when $\ge 2$ languages are configured.
- **Locale-Scoped Search**: MiniSearch automatically indexes and scopes queries to the active language, eliminating cross-language result clutter.
- **Automated Vitest Test Suite**: Added comprehensive unit test coverage for path normalization, locale detection, language switching, and search index scoping.

---

## VertiWiki 0.3.0 (August 2026)

### 🔗 Native Wikilinks (`[[...]]`) & Bidirectional Cross-Referencing
- **Zero-Build Wikilinks**: Built-in support for double-bracket links `[[target]]`, `[[target|alias]]`, and `[[target#anchor|alias]]` resolving client-side without any build step.
- **Code Block & Inline Code Isolation**: Intelligently protects fenced code blocks (```` ```...``` ````) and inline backticks (`` `...` ``) from accidental wikilink expansion.
- **Obsidian & PKM Vault Interoperability**: Seamlessly author and drop Obsidian/Logseq vaults directly into VertiWiki.
- **Comprehensive Documentation**: Added dedicated [Wikilinks Guide](docs/guides/wikilinks.md), interactive demos in [Modern Features](features.md), and sidebar integration in [Navigation](navigation.md).

---

## VertiWiki 0.2.8 (August 2026)

### 🗂️ Automatic Directory Indexing (`index.md`) & Smart Fallbacks
- **Directory Index Resolution**: Navigating to `#/docs/sub-docs/` or `#/docs/sub-docs` automatically resolves and renders `docs/sub-docs/index.md`.
- **Intelligent Sibling Fallback**: Automatic seamless fallback between `dir/index.md` and `dir.md` without 404 errors.
- **Smart Navigation Sync**: Active sidebar state and breadcrumbs properly match directory and file routes.
- **Relative Folder Linking**: Automatically transforms relative markdown folder links (`./sub-docs/`) to client hash index routes.

---

## VertiWiki 0.2.7 (August 2026)

### 🔀 Path Hash Routing Migration (`#/`) & Incremental Release Pipeline
- **Clean Modern URL Routing**: Migrated default hash routing from legacy hashbang (`#!`) to standard path hash (`#/path/to/page.md`).
- **100% Backward Compatibility**: Router seamlessly resolves legacy bookmarks with `#!` and `#` without broken links.
- **Deep Anchor Linking**: Robust section anchor handling (`#/docs/guide.md#heading`) preventing scroll clashes with table of contents and internal page anchors.
- **Synchronized Open-Source Pipeline**: Enhanced distribution sync script to preserve Git history and only commit modified files to GitHub.

---

## VertiWiki 0.2.6 (August 2026)

### 🐛 HTML & Badge Title Sanitization in Document Header, Metadata & TOC
- **Clean Document & Browser Tab Titles**: Fixed bug where `:badge[...]` tags inside first H1 headings leaked literal HTML span elements (`<span class="verti-badge...`) into `document.title`, browser tabs, OpenGraph metadata, Twitter cards, and Schema.org JSON-LD headline tags.
- **TOC Heading Sanitization**: Fixed Table of Contents element extraction to properly strip visual badges from heading links.
- **Enhanced Footer Link**: Embedded primary link to `https://verti.wiki` directly into footer branding text.

---

## VertiWiki 0.2.5 (August 2026)

### 🏷️ Static Fallback Title vs. Dynamic Configuration Documentation
- **Dynamic Runtime vs. Static `<title>` Documentation**: Clarified engine title handling across `docs/guides/deployment.md` and `docs/guides/sitemap-seo.md`. Explains how standalone distribution bundles dynamically override page titles at runtime via `config.json` while production builds for non-JS crawlers can customize the static `<title>` in `index.html`.
- **Synchronized Documentation Standards**: Aligned SEO guides and deployment references with multi-repository sync protocols.

---

## VertiWiki 0.2.4 (August 2026)

### 🤖 Semantic No-JS Fallback & AI Crawler Discoverability
- **Pre-seeded Semantic HTML Fallback**: Embedded human-readable and bot-readable HTML shell inside `#verti-app` before client-side hydration, eliminating empty page extractions on HTTP GET scrapers and non-JS clients.
- **Dedicated `<noscript>` Navigation**: Clear, structured fallback navigation listing direct Markdown links and AI index endpoints when JavaScript execution is disabled.
- **AI & LLM Discovery Meta Tags**: Added `<link rel="alternate" type="text/markdown" href="index.md">` and `<link rel="help" type="text/plain" href="llms.txt">` in `<head>` for automated crawler detection.
- **Synchronized Build Sync**: Automated single-file distribution sync across `dist/` and `website/`.

---

## VertiWiki 0.2.3 (August 2026)

### 🎨 Modular External Theme Files & Clean Configuration
- **Modular Theme Files**: Custom themes can now live in standalone `.json` files inside the `themes/` folder (e.g. `themes/obsidian.json`) and be referenced in `config.json` via `"customThemes": ["themes/obsidian.json"]`.
- **Streamlined `config.json`**: Reduced configuration size from 70+ lines down to a clean ~20 lines by separating color palettes into dedicated theme files.
- **Polymorphic Theme Loader**: Asynchronously resolves external theme files, single file path strings, and legacy inline theme objects with robust fallback error handling.
- **Interactive Visual Sitemap Plugin**: Built-in `::: sitemap` directive generating an instant, responsive card tree of the entire wiki with real-time live search filtering.
- **Pure `verti-` Architecture**: Clean namespace across all CSS variables (`--verti-*`), DOM containers (`#verti-app`), UI components, and all 13 plugins with full backward compatibility.

---

## VertiWiki 0.2.2 (August 2026)

### ⚡ Header Brand & Accordion Navigation
- **Flexible Brand Display**: Support for logo-only, text-only, or both logo and title in header via `brandDisplay: "both" | "logo" | "title"`.
- **Collapsible Sidebar Accordions**: Smart accordion folders in navigation tree with auto-expansion of active article branch (`collapsibleNavigation: true`).
- **Obsidian Framework Theme**: Full support for custom zero-recompile themes with dynamic Google Fonts injection.
- **Product Landing Showcase**: Standalone developer landing page and distribution suite in `website/`.

---

## VertiWiki 0.2.1 (August 2026)

### 📑 Interactive Markdown Components Suite
- **Code & Content Tabs**: Added support for tabbed switchers (`::: tabs ... :::`).
- **Collapsible FAQs & Accordions**: Added support for collapsible detail blocks (`::: details ... :::`).
- **Image & Diagram Lightbox**: Fullscreen zoom overlay on image and diagram click with dark blurred backdrop and Escape shortcut.
- **Prev / Next Page Navigation**: Automatic sequential article pagination cards at the bottom of each page.

### 🤖 Answer Engine Optimization (AEO) & LLM Readiness
- **Dynamic Zero-Build Schema.org JSON-LD**: Injects and updates `TechArticle`, `BreadcrumbList`, and `WebSite` semantic graphs in `<head>`.
- **Jekyll & Astro Style Frontmatter**: Native YAML metadata parsing with smart automatic deduction.
- **1-Click "Copy for AI" Action**: Context exporter button for prompt-ready copy into ChatGPT, Claude, and Perplexity.
- **`llms.txt` & AI `robots.txt`**: Standard documentation discovery index conforming to `llmstxt.org`.
- **Universal Multi-Provider Analytics**: Dynamic tracking for GA4, GTM, Plausible, Cloudflare, Umami, and Matomo.

---

## VertiWiki 0.2.0 (August 2026)

### 🚀 Complete Architecture Rewrite
- Greenfield modern rewrite replacing legacy MDwiki with **Vite 6, TypeScript 5.7+, Node 22+**, and ESM.
- **Single-File Distribution**: Inlines all styles, icons, fonts, and logic into `dist/vertiwiki.html`.
- **Zero-XSS Security**: Complete sanitizer integration with **DOMPurify**.
- **Client-Side Search**: Instant in-memory fuzzy search via **MiniSearch** with `⌘K` modal.
- **KaTeX & Mermaid Integration**: Native LaTeX math expressions and diagram generation.
- **Dynamic Theme Engine**: 7 built-in theme presets with automatic dark/light synchronization.
