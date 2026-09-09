# Changelog

## VertiWiki 0.9.0 "Ichi" (September 2026) :badge[Latest]{type=success}

### 🏛️ Modular Layout Engine, Decoupled Presets & Standalone Pro Themes
- **Extensible Layout Engine (`data-layout`)**: Introduced modular layout modes (`default`, `book`, `handbook`, `api`, `hub`) toggled declaratively via `config.json` or per-page Frontmatter (`layout: book`, `layout: api`), fully powered by modern CSS Grid and Flexbox with zero runtime JavaScript bloat.
- **Reading Ergonomics for Non-Technical Docs (`contentWidth: "readable"`)**: Added an editorial reading mode limiting prose width to 68ch with relaxed line-height (1.8), optimized for employee handbooks, onboarding guides, academic essays, and digital books.
- **Developer UI Toggles (`enableAiCopy: false`)**: Enabled clean suppression of developer-specific UI actions (such as "Copy for AI") for non-technical audiences (HR, company wikis, customer support manuals).
- **Header Navigation Links (`headerLinks`)**: Added configuration support for custom links and call-to-action buttons in the top navbar (`.verti-header-right`), facilitating seamless white-labeling and integration with SaaS platforms.
- **Synchronized Code & Content Tabs**: Switching a tab (e.g. `cURL`, `Python`, or OS platforms) now automatically synchronizes all matching tabs across the page and saves user preferences to `localStorage`.
- **Core Theme Decoupling**: Streamlined the bundled theme engine to a single canonical **`default` (Modern Monochrome & Slate)** preset, and decoupled former presets (`terracotta`, `emerald`, `nord`, `dracula`, `amethyst`, `editorial`) into standalone, auto-resolving JSON files in `themes/`.
- **Standalone Commercial Pro Themes (`pro-themes/`)**:
  - `company-handbook`: Tailored for employee onboarding, company policies, and SOPs with pastel callouts and checklist styling.
  - `minimal-book`: Literary, distraction-free reading theme with Lora serif typography and book chapter dividers.
  - `api-pro`: 3-column sticky split layout with HTTP method badges and compact parameter tables.
  - `developer-hub`: Enterprise developer portal layout with Bento-grid card sections and glassmorphism navbar.

---

## VertiWiki 0.8.4 (September 2026)

### 🔄 Universal Human Reader Redirection & Content Negotiation Engine
- **Defensive Engine Fetching (`src/main.ts`)**: Enforced explicit `Accept: text/markdown, text/plain, */*` headers across all internal engine fetch operations (`fetchMarkdownResource`, localized navigation manifest loader, and 404 handler). Completely shields the single-file application against browser document navigation header pollution, eliminating server redirect loops.
- **Production-Ready Vercel Recipe (`deploy/vercel/vercel.json`)**: Added human browser redirection (`Accept: text/html`) routing direct `.md` hits and clean URLs into VertiWiki hash routes (`/#/...`), while preserving raw Markdown content delivery for AI agents (`Accept: text/markdown`) and genuine HTTP 404 status codes. Set `trailingSlash: false` for strict documentation path stability.
- **Universal Multi-Cloud Modernization (`deploy/`)**: Upgraded deployment recipes across Netlify (`netlify.toml`), Cloudflare Pages (`worker-snippet.js`), Nginx (`vertiwiki.conf`), Apache (`.htaccess`), and AWS CloudFront Function (`cloudfront-function.js`) to provide simultaneous human reader redirection and autonomous AI agent Content Negotiation.
- **Documentation & Deployment Recipes (`deploy/README.md`, `sitemap-seo.md`)**: Expanded official deployment guides with detailed Root (Scenario A) and Subfolder `/docs/` (Scenario B) configurations, and updated the SEO/AEO sitemap guide with Vercel deployment instructions.

---

## VertiWiki 0.8.3 (September 2026)

### 🎨 Theme-Harmonized Code Cards & UI Background Fixes
- **Theme-Adaptive Code Block Cards**: Eliminated legacy hardcoded `#2d2d2d` background on code wrappers. Code cards now dynamically inherit `--verti-code-bg` (`--muted`), rendering crisp, light-themed cards on Light Mode and tailored dark-tinted cards on Dark Mode matching the active theme (Terracotta, Emerald, Dracula, Nord).
- **High-Contrast Syntax Highlighting Tokens**: Introduced dual-mode Prism syntax highlighting tokens offering >7:1 WCAG AAA contrast ratios on Light Mode and vibrant pastel palettes on Dark Mode.
- **Critical CSS Body Background Remediation**: Scoped critical skeleton styles strictly to `.verti-loading-shell` and removed global `html, body` background overrides. Explicitly declared `background-color: var(--verti-bg-base)` across `body`, `.verti-main-container`, `.verti-content-wrapper`, and `.verti-toc-sidebar` to ensure 100% full-screen theme consistency on all presets.
- **Runtime Critical Style Cleanup**: Automatically unmounts `#verti-critical-css` from `<head>` upon layout initialization to eliminate any style contamination.

---

## VertiWiki 0.8.2 (September 2026)

### 🤖 AgentDocsSpec (AFDocs) Compliance & AI Agent Directives
- **In-Page AI Agent Discovery Directive**: Updated static (`index.html`) and runtime (`src/plugins/aeo.ts`) agent discovery directives (`.verti-agent-directive`) to strictly conform with AgentDocsSpec regex requirements (`<a href="./llms.txt">/llms.txt</a>`), guaranteeing instantaneous index discovery by AI crawlers and automated scoring tools.
- **Deployment Templates Content Negotiation**: Enhanced server deployment configurations (`deploy/vercel/vercel.json`, `deploy/cloudflare/worker-snippet.js`) with explicit directory handling for `/docs` and `/docs/` when clients request `Accept: text/markdown`, routing directly to `/docs/index.md`.
- **AEO Unit Test Suite**: Added automated test coverage in `tests/aeo.test.ts` validating HTML directive compliance against AgentDocsSpec `LINK_PATTERN` and `TEXT_PATTERN` regexes.

---

## VertiWiki 0.8.1 (September 2026)

### ⚡ Adaptive Critical Skeleton Screen & In-Memory Cache Architecture
- **Critical Adaptive Skeleton UI (`index.html`)**: Introduced an inline zero-shift skeleton screen with GPU-accelerated shimmer animations that automatically harmonizes with the user's system theme (`@media (prefers-color-scheme: dark)` and `light`). Completely eliminates the flash of unstyled/unrendered content (FOUC) while keeping Cumulative Layout Shift (CLS) at 0.
- **Semantic Search Engine & Bot Crawl Landmark (`.verti-sr-only`)**: Encapsulated the static bot crawl tree (`<nav class="verti-crawl-tree">`) using W3C-compliant accessible styling, ensuring 100% link discoverability for Googlebot, Bingbot, and AI crawlers (Claude, GPT, Perplexity) without any cloaking penalties.
- **In-Memory Resource Cache (`src/main.ts`)**: Added a high-performance in-memory cache (`Map<string, string>`) for visited Markdown documents and localized navigation trees, delivering instantaneous (0 ms) subsequent navigation transitions across the wiki.
- **Parallelized Network Fetching (`Promise.all`)**: Re-architected `loadPage` to download localized navigation manifests and target Markdown documents simultaneously, slashing perceived load times by over 50%.
- **Documentation Modernization (`README.md`)**: Comprehensive overhaul bringing the documentation repository up to date with the latest features, correct isolated demo architecture, and cloud deployment recipes.

---

## VertiWiki 0.8.0 (September 2026)

### 🌳 Static Bot Crawl Tree & Search Engine Indexing Architecture
- **Static Bot Crawl Tree Engine (`src/core/crawl-tree.ts`)**: Built-in semantic HTML tree generator (`<nav class="verti-crawl-tree">`) producing valid `<a href="...">` anchor links. Directly resolves Google Search Console's "Discovered - currently not indexed" (*Descoperită – nu este indexată*) issue by removing the "orphan URLs" penalty on zero-backend Markdown SPAs.
- **Query Parameter Routing (`?page=`, `?p=`, `?doc=`)**: Added automatic search query param parsing in `Router.init()`, enabling seamless server-side Content Negotiation and web server rewrites (Nginx, Cloudflare) that redirect direct `.md` hits into the interactive VertiWiki application.
- **HTML Starter Shell Enhancement**: Replaced minimal loading placeholder links in `index.html` with a complete, structured Static Bot Crawl Tree covering all articles for instantaneous bot discovery prior to JavaScript execution.
- **XML Sitemaps & SEO Guide Overhaul (`demo/docs/guides/sitemap-seo.md`)**:
  - Removed invalid hash-in-sitemap examples per RFC 3986 and Googlebot standards.
  - Documented strict sitemap hygiene (excluding error pages `404.md`, `llms.txt`, and duplicate `README.md` aliases).
  - Added production-ready Nginx and Cloudflare Workers recipes for human browser Content Negotiation.
- **Test Suite Expansion**: Added `tests/crawl-tree.test.ts` bringing automated test coverage to 18 test suites and 96 unit tests.

---

## VertiWiki 0.7.0 (September 2026)

### 🛡️ Core Security Hardening & Zero-XSS Guarantee
- **DOM-Based XSS Remediation**: Secured the 404 route error handler, breadcrumbs navigation generator, search result modal snippets, and visual sitemap plugin using a centralized `escapeHtml` utility.
- **Mermaid Diagram Strict Security**: Upgraded Mermaid engine configuration to `securityLevel: 'strict'` and enforced `DOMPurify.sanitize()` on all rendered SVG diagrams.
- **Iframe Source Hardening**: Enforced origin validation on iframe elements within `MarkdownParser`, restricting embeds to secure protocols.

### ⚡ KaTeX Font Optimization (~1.1 MB Standalone Bundle Reduction)
- **Modern WOFF2 Font Pruning**: Added `optimizeKatexFontsPlugin` to the Vite build pipeline, pruning obsolete `.woff` and `.ttf` formats from KaTeX `@font-face` rules. Reduced standalone CSS payload from 1.50 MB to 408 KB (-73%) and overall `dist/vertiwiki.html` size from 5.13 MB to 4.02 MB.

### 🧹 Design System Standard & Legacy Namespace Purge
- **Pure `.verti-*` Namespace**: Completely eliminated all legacy `cortex-*` and `omni-*` classes and selectors across all components and plugins.
- **Purged Legacy CSS Variables**: Removed all deprecated `--cortex-*` and `--omni-*` fallback tokens from `theme.css`.
- **Runtime Reliability**: Converted `LightboxManager` to lazy initialization on demand and unified Markdown fallback fetching.

---

## VertiWiki 0.6.3 (September 2026)

### 🐞 Directory Trailing Slash Normalization & Hash Route Integrity
- **Vercel Trailing Slash Fix**: Enforced `"trailingSlash": true` in `deploy/vercel/vercel.json`, preventing Vercel Edge 308 redirects from stripping directory trailing slashes and corrupting browser address bars from `https://www.verti.wiki/docs/#/` into `/docs#/`.
- **Directory Markdown AI Content Negotiation**: Added directory rewrite support (`/:path*/` $\rightarrow$ `/:path*/index.md`) across Vercel, Netlify, Apache, and AWS CloudFront when `Accept: text/markdown` is requested.
- **Universal Multi-Host Hardening (`deploy/`)**:
  - **Netlify**: Explicitly enabled `[build.processing.html] pretty_urls = true` to guarantee directory trailing slash normalization.
  - **Apache**: Added explicit `DirectorySlash On` and directory index detection (`REQUEST_FILENAME -d`) to `.htaccess`.
  - **AWS CloudFront**: CloudFront Function now issues an explicit 308 redirect for extensionless directory-like paths before requesting S3 keys.
  - **Cloudflare Worker**: Added 308 redirect normalization for extensionless directory paths before passing through to origin.
- **Client-Side Defensive Router & AEO Normalization**:
  - Added `normalizeDirectoryUrl` in `src/core/router.ts` with dedicated unit test coverage.
  - At engine bootstrap in `src/main.ts`, if the application is opened on a directory path without a trailing slash (e.g. `/docs#/`), the URL is normalized via `history.replaceState` without a full page reload, ensuring correct RFC-compliant relative fetch resolution (`config.json`, `index.md`).
  - Guaranteed trailing slash preservation in dynamic Schema.org JSON-LD BreadcrumbList generation in `src/plugins/aeo.ts`.

---

## VertiWiki 0.6.2 (September 2026)

### 🌐 Universal Portability & Path-Agnostic Architecture
- **Path-Agnostic Core Directives**: Replaced fixed path references in `index.html` with relative URLs (`llms.txt`, `index.md`), ensuring the standalone single-file engine (`dist/vertiwiki.html`) resolves correctly anywhere it is deployed (domain root `/`, subfolders `/docs/`, `/wiki/`, GitHub Pages, or offline `file:///`).
- **Relative Default Configuration**: Updated `DEFAULT_CONFIG.llmsTxtUrl` from `'/llms.txt'` to `'llms.txt'`, harmonizing it with `homePage: 'index.md'` and `navigationFile: 'navigation.md'`.
- **Universal Hosting Recipes (`deploy/`)**: Overhauled all deployment configurations (`vercel.json`, `netlify.toml`, `cloudflare/worker-snippet.js`, `_redirects`, `_headers`, `nginx/vertiwiki.conf`, `apache/.htaccess`, `aws/cloudfront-function.js`) to eliminate hardcoded `/docs` path assumptions:
  - Full support for AI Content Negotiation (`Accept: text/markdown`) across domain root `/` and any arbitrary subpath `/:path*`.
  - Added universal Single Page Application (SPA) fallbacks to prevent 404 errors on clean extensionless URLs.
  - Added root vs. subfolder deployment guidance in `deploy/README.md`.

---

## VertiWiki 0.6.1 (September 2026)

### 🐞 Favicon Rendering & Progressive Enhancement Fix
- **Universal Progressive Enhancement Favicons**: Inlined high-contrast 32x32 PNG, scalable vector SVG with `sizes="any"`, and `apple-touch-icon` as Data URIs directly in `<head>`, eliminating network dependencies and resolving missing icons on Google Chrome, Apple Safari, and Chromium browsers.
- **Standalone Single-File Preservation**: Replaced external asset extraction with inlined Data URIs, guaranteeing the favicon renders immediately in standalone `dist/vertiwiki.html` across all environments (offline, `file://`, subfolder deployments, and static hosts).
- **Public Fallback Assets**: Added `public/favicon.ico`, `public/favicon.png`, and `public/favicon.svg` to satisfy automatic root speculative browser requests and prevent 404 caching on localhost dev servers.
- **Bundle String Replace Bug Fix**: Fixed a critical pattern substitution bug in `vite.config.ts` (`scriptToEndOfBodyPlugin`) by using a callback function in `String.prototype.replace()`, preventing regex pattern syntax from duplicating DOCTYPE tags and corrupting the bundled JavaScript.
- **Dynamic Favicon Configuration**: Added optional `favicon?: string;` property to `VertiWikiConfig`, allowing users to dynamically customize the favicon through `config.json`.

---

## VertiWiki 0.6.0 (September 2026)

### 📁 Subfolder Content Roots & Isolated Demo Fixtures
- **Subfolder Documentation Hosting**: VertiWiki natively supports hosting documentation in subdirectories (e.g. `demo/` or `content/`) with automatic base directory resolution during language switching and dynamic navigation tree loading.
- **Isolated Demo Fixtures**: All demo documentation, multi-language test files (`demo/fr/`), and sample markdown content are cleanly isolated in `demo/`, keeping the repository root dedicated to core engine source and configuration.

### 🧪 Comprehensive Unit Test Suite (100% Coverage)
- **100% Core & Plugin Test Coverage**: Expanded automated testing from 7 test suites (27 tests) to 15 test suites (74 unit tests) covering `Pipeline`, `MarkdownParser`, `Router`, and all built-in plugins (`badge`, `callouts`, `details`, `tabs`, `wikilinks`, `math`, `media`, `sitemap`, `analytics`, `nav-accordion`, `lightbox`).
- **Heading Slug Collision Fix**: Corrected slug generation logic in `MarkdownParser` to guarantee clean, incremental anchor IDs (`overview-1`, `overview-2`) without nested hyphen chaining.

---

## VertiWiki 0.5.1 (September 2026)

### 🐞 Mermaid Diagrams Contrast & Dark Theme Harmonization
- **Theme-Aware Diagram Tokens**: Mermaid node shapes (`rect`, `circle`, `polygon`) now dynamically map to `--verti-bg-subtle` and `--verti-border`, eliminating the clash of light pastel boxes on dark backgrounds.
- **Node Label Text Contrast**: Fixed specificity issue where `.verti-article p` forced white text over light boxes; diagram text and labels now inherit `--verti-text-primary` with guaranteed >10:1 contrast on all dark themes.
- **Dynamic Theme Mode Detection**: `mermaidPlugin` dynamically initializes with `theme: 'dark'` or `theme: 'default'` based on active document theme and system preference.
- **Connectors, Markers & Sequence Diagrams**: Harmonized stroke and marker colors with `--verti-text-secondary` and added complete theme token support for Sequence Diagrams, State Diagrams, and Class Diagrams.

---

## VertiWiki 0.5.0 (September 2026)

### 🎨 Custom Theme Inheritance (`extends`) & Defensive Normalization
- **Theme Inheritance (`extends`)**: Custom themes can now extend built-in presets (e.g. `extends: "dracula"`, `extends: "github-dark"`) or other custom themes, selectively overriding only specific CSS variables.
- **Defensive Theme Normalization**: Safely validates and normalizes partial or malformed theme configurations with system fallbacks, preventing broken styles.
- **Cycle & Depth Protection**: Robust cycle detection and maximum inheritance depth limits to prevent infinite recursion during theme resolution.

### 🤖 Agent Docs Discovery (`AgentDocsSpec`) & Configurable `llmsTxtUrl`
- **Configurable `llmsTxtUrl`**: Added `llmsTxtUrl` property to `config.json` and runtime defaults (defaults to `/llms.txt`).
- **AI Agent Discovery Header Directives**: The AEO plugin dynamically injects `<meta name="agent-docs" content="...">` and `<link rel="help" ...>` in `<head>` to guide autonomous AI agents and web crawlers to structured documentation.

---

## VertiWiki 0.4.1 (September 2026)

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
