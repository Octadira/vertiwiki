---
title: Modern Features (2026+)
description: Explore the rich interactive components available in VertiWiki including Code Tabs, Accordions, Lightbox, Math, Diagrams, and Search.
tags: [features, tabs, accordion, lightbox, aeo]
---

# Modern Features in VertiWiki :badge[v0.2.4]{type=primary} :badge[Interactive]{type=success}

VertiWiki brings a powerful suite of 2026+ web platform improvements, interactive Markdown components, and answer engine optimizations.

---

## 📑 1. Multi-Language Code Tabs & Switcher

You can present multi-package or multi-language instructions using clean, animated tab groups:

::: tabs
== npm
```bash
# Install with standard npm
npm install vertiwiki
```
== pnpm
```bash
# Install with pnpm (fast & disk efficient)
pnpm add vertiwiki
```
== yarn
```bash
# Install with yarn
yarn add vertiwiki
```
== bun
```bash
# Install with bun
bun add vertiwiki
```
:::

You can also use tabs for programming languages:

::: tabs
== TypeScript
```typescript
interface WikiConfig {
  title: string;
  themePreset: string;
}

const config: WikiConfig = { title: "VertiWiki", themePreset: "obsidian" };
```
== Python
```python
def get_wiki_config() -> dict:
    return {"title": "VertiWiki", "theme": "obsidian"}
```
== Rust
```rust
struct WikiConfig {
    title: String,
    theme: String,
}
```
:::

---

## 📂 2. Collapsible Details & FAQ Accordions

Easily hide complex details or organize FAQs using accordion blocks:

::: details How do zero-recompile themes work without page reloads?
VertiWiki utilizes native CSS Custom Properties (Design Tokens) and dynamically switches the `data-theme-preset` attribute on the `<html>` root element. The browser recalculates colors instantly at the GPU compositor layer in **under 1 millisecond**!
:::

::: details:open Which AI answer engines are supported?
Thanks to the built-in **AEO (Answer Engine Optimization)** module, VertiWiki generates real-time Schema.org JSON-LD semantic graphs (`TechArticle`, `BreadcrumbList`) and serves `llms.txt`, making it 100% optimized for **ChatGPT Search, Perplexity AI, Claude, Google Gemini, and Microsoft Copilot**.
:::

---

## 🏷️ 3. Colored Badges & Status Tags

Add inline status indicators and category tags anywhere in your text:

* :badge[v0.2.2]{type=primary} Primary Brand Tag
* :badge[Success]{type=success} Build Passing / Active
* :badge[Warning]{type=warning} Under Review
* :badge[Danger]{type=danger} Deprecated API
* :badge[Purple]{type=purple} Experimental AI
* :badge[Info]{type=info} General Tag

---

## 🔍 4. Image & Diagram Lightbox Zoom

Click on any image or diagram below to open it in a full-screen, high-resolution **Lightbox modal** with dark blurred backdrop:

![VertiWiki Architecture Overview](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80)

---

## 🔀 5. Previous & Next Page Navigation

Scroll to the bottom of this article to see the **← Previous Page** and **Next Page →** navigation cards, calculated automatically from `navigation.md`!

---

## 🗺️ 6. Interactive Visual Sitemap

Embed a full, responsive directory tree of your entire documentation on any page with real-time live search:

```markdown
::: sitemap
:::
```

Check out the dedicated [Visual Sitemap Page](sitemap.md) to see it in action!
