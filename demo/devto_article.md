---
title: Why I Built VertiWiki: A Zero-Backend, Single-File Markdown Wiki Engine
published: true
tags: webdev, javascript, opensource, markdown
canonical_url: https://verti.wiki
---

When building project documentation, knowledge bases, or internal wikis, developers typically face a choice between two paradigms:

1. **Static Site Generators (SSGs)** like Docusaurus, VitePress, or MkDocs. These generate great static HTML, but require a local Node/Python runtime and a CI/CD build step every time a markdown file is updated.
2. **Database-backed CMS Wikis** like Wiki.js or BookStack. These offer instant editing, but require databases, backend daemons, and ongoing server maintenance.

I wanted a third option: **the simplicity of raw Markdown files on disk, combined with instant client-side rendering and zero backend requirements.**

That led to **[VertiWiki](https://verti.wiki)**.

---

## The Architecture: Single-File Distribution

VertiWiki is distributed as a single standalone HTML file (`vertiwiki.html` or `index.html`). 

Using **Vite 6** and `vite-plugin-singlefile`, all application logic, routing, stylesheets, and third-party libraries are bundled directly into that one file:

- **Markdown Parser:** `marked`
- **Security:** `DOMPurify` (sanitizing every HTML output before injection)
- **Syntax Highlighting:** `prismjs`
- **Math & Diagrams:** `katex` & `mermaid`
- **Search Engine:** `minisearch` (in-memory client-side fuzzy search)

### Example Directory Structure

```text
.
├── index.html          <-- Standalone VertiWiki bundle
├── config.json         <-- Wiki title, theme, analytics config
├── navigation.md       <-- Sidebar navigation hierarchy
├── index.md            <-- Home page
└── docs/               <-- Your raw markdown files
```

---

## Zero Build Step for Content

Because the engine runs in the browser, you never need to run `npm run build` when authoring or updating content:

1. Edit or add any `.md` file in your repository or server folder.
2. Refresh the browser.
3. The client fetches the raw Markdown via standard `fetch()`, executes the plugin pipeline, sanitizes the HTML, and renders it dynamically on the fly.

---

## Client-Side Offline Search

Traditional static sites either build massive static search index JSON files at compile time or rely on third-party search APIs (like Algolia).

VertiWiki indexes documents dynamically into **MiniSearch** on the client. Pressing `⌘K` or `/` opens an instant fuzzy-search modal that scans article titles and body content with zero network calls.

---

## Open Source & Getting Started

VertiWiki is 100% open source under the **MIT License**.

- **GitHub Repository:** [github.com/Octadira/vertiwiki](https://github.com/Octadira/vertiwiki)
- **Live Demo & Docs:** [verti.wiki](https://verti.wiki)

You can grab the latest `vertiwiki.html` from the GitHub Releases, drop it into your folder of markdown files, and host it anywhere (Nginx, Caddy, Cloudflare Pages, GitHub Pages, or an S3 bucket).

Let me know what you think in the comments!
