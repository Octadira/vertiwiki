---
title: Introduction to VertiWiki
description: Understand what VertiWiki is, its core philosophy, and why you should use it.
tags: [vertiwiki, introduction, philosophy, zero-backend]
---

# 🧠 Introduction to VertiWiki

## What is VertiWiki?

VertiWiki is a **100% client-side, zero-backend Markdown wiki and documentation engine** designed for the modern web. It renders Markdown documents completely in your browser via JavaScript—**no server, no database, no build steps needed for content updates**.

### The Core Philosophy

1. **Simplicity First**: Drop a single HTML file alongside your Markdown documents. No complex tooling, no CI/CD pipelines.
2. **Zero Backend**: Everything runs in the browser. No servers to maintain, no databases to manage, no API infrastructure.
3. **Pure Markdown**: Write in standard Markdown with zero proprietary syntax (except optional Wikilinks and GFM extensions).
4. **Privacy by Default**: All processing happens locally. No data is sent to external servers unless you explicitly enable analytics.
5. **AI-Ready**: Built-in Answer Engine Optimization (AEO), `llms.txt` support, and one-click AI prompt export.

---

## Key Features at a Glance

| Feature | Benefit |
|---------|---------|
| **Single-File Distribution** | Deploy as `vertiwiki.html` — no npm, no build |
| **Native Wikilinks** | `[[page]]`, `[[page\|alias]]` linking (Obsidian-compatible) |
| **Instant Search** | Offline fuzzy full-text search with `⌘K` |
| **Modular Themes** | Theme files in `themes/` folder, no recompile |
| **Math & Diagrams** | KaTeX equations, Mermaid.js graphs |
| **GFM Alerts** | `> [!NOTE]`, `> [!WARNING]` callouts |
| **Analytics** | GA4, GTM, Plausible, Umami, Matomo integration |
| **AEO Support** | Schema.org JSON-LD, `llms.txt`, AI export buttons |

---

## Who Should Use VertiWiki?

✅ **Perfect for:**
- Internal documentation and knowledge bases
- Open-source project documentation
- Blog platforms and digital gardens
- Technical reference guides
- Educational course materials
- Personal wikis (Obsidian, Notion alternative)

❌ **Not ideal for:**
- Highly dynamic content requiring real-time collaboration
- User authentication and access control
- Multi-user editing workflows
- Real-time data synchronization

---

## VertiWiki vs. Traditional Wiki/Documentation Tools

| Aspect | VertiWiki | Traditional Wiki | Static Site Generator |
|--------|-----------|-----------------|----------------------|
| **Backend Required** | ❌ No | ✅ Yes | ❌ No |
| **Build Step** | ❌ No (for content) | ✅ Yes | ✅ Yes |
| **Deployment Complexity** | 🟢 Simple | 🔴 Complex | 🟡 Medium |
| **Markdown Editing** | ✅ Yes | 🔴 Often Proprietary | ✅ Yes |
| **Client-Side Rendering** | ✅ Yes | ❌ No | ❌ No |
| **Offline Use** | ✅ Yes | ❌ No | ✅ Yes |
| **Privacy** | 🟢 Local Processing | 🔴 Cloud Storage | 🟢 Local Processing |
| **AI/AEO Ready** | ✅ Native Support | 🔴 Manual | 🟡 Possible |

---

## How VertiWiki Works (High Level)

```
┌─────────────────────────────────────┐
│   Browser (Client-Side Only)        │
├─────────────────────────────────────┤
│                                     │
│  1. User opens vertiwiki.html       │
│  2. JavaScript initializes          │
│  3. Router reads URL hash (#/docs)  │
│  4. Fetches corresponding .md file  │
│  5. Markdown parser renders HTML    │
│  6. Plugins enhance (math, code)    │
│  7. Display to user                 │
│                                     │
│  ✅ No server calls                 │
│  ✅ No database queries             │
│  ✅ Instant offline access          │
│                                     │
└─────────────────────────────────────┘
```

---

## Next Steps

1. **[[getting-started/quick-start]]** — Get up and running in 5 minutes
2. **[[getting-started/installation]]** — Explore deployment options
3. **[[concepts/architecture]]** — Deep dive into how VertiWiki works
4. **[[guides/authoring-content]]** — Learn Markdown and wikilinks syntax

---

## Support & Community

- 🐛 **Report Issues**: [GitHub Issues](https://github.com/Octadira/vertiwiki/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Octadira/vertiwiki/discussions)
- 📝 **Contributing**: See [[CONTRIBUTING.md]] for contribution guidelines
- 📮 **Contact**: Reach out via GitHub or email

---

**Version**: 0.6.1 | **License**: MIT | **Updated**: September 2026
