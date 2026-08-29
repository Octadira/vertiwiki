# Plugin Development API

VertiWiki 0.2.4 features an extensible, async-first **Pipeline Architecture** allowing developers to create custom plugins and extensions easily.

---

## 🧩 Built-in Plugins in VertiWiki 0.2.4

VertiWiki ships with 13 built-in plugins registered in the processing pipeline:

| Plugin Name | Module | Hook Phases | Description |
| :--- | :--- | :--- | :--- |
| `callouts` | `src/plugins/callouts.ts` | `beforeParse` | GitHub GFM alerts (`> [!NOTE]`, `> [!TIP]`, etc.) |
| `code-highlight` | `src/plugins/code-highlight.ts` | `afterRender` | Prism.js syntax highlighting & 1-click code copying |
| `math` | `src/plugins/math.ts` | `afterRender` | KaTeX inline and block LaTeX math rendering |
| `mermaid` | `src/plugins/mermaid.ts` | `afterRender` | Interactive SVG diagrams via Mermaid.js |
| `media` | `src/plugins/media.ts` | `beforeParse`, `afterRender` | Responsive YouTube and HTML5 video embeddings |
| `badge` | `src/plugins/badge.ts` | `beforeParse` | Inline colored badges (`:badge[Text]{type=success}`) |
| `analytics` | `src/plugins/analytics.ts` | `afterRender` | Universal zero-recompile pageview analytics |
| `tabs` | `src/plugins/tabs.ts` | `beforeParse`, `afterRender` | Interactive code & content tabs (`::: tabs ... :::`) |
| `details` | `src/plugins/details.ts` | `beforeParse` | Collapsible accordions and FAQs (`::: details ... :::`) |
| `lightbox` | `src/plugins/lightbox.ts` | `afterRender` | Fullscreen image and diagram zoom overlay |
| `nav-accordion` | `src/plugins/nav-accordion.ts` | `afterRender` | Smart auto-expanding sidebar accordion navigation |
| `sitemap` | `src/plugins/sitemap.ts` | `beforeParse`, `afterRender` | Interactive visual sitemap grid with live search (`::: sitemap :::`) |
| `aeo` | `src/plugins/aeo.ts` | `afterRender` | Dynamic Schema.org JSON-LD and meta tags for AI crawlers |

---

## 🧩 Plugin Interface Definition

Every plugin implements the `VertiWikiPlugin` interface:

```typescript
import { VertiWikiConfig } from '../core/types';

export interface PluginContext {
  filePath: string;
  config: VertiWikiConfig;
  container: HTMLElement;
}

export type BeforeParseHook = (markdown: string, context: PluginContext) => Promise<string> | string;
export type AfterParseHook = (html: string, context: PluginContext) => Promise<string> | string;
export type AfterRenderHook = (context: PluginContext) => Promise<void> | void;

export interface VertiWikiPlugin {
  name: string;
  beforeParse?: BeforeParseHook;
  afterParse?: AfterParseHook;
  afterRender?: AfterRenderHook;
}
```

---

## 🛠️ Hook Lifecycle Phases

1. **`beforeParse(markdown, context)`**:
   * Runs before the Markdown parser converts text to HTML.
   * Use this to replace custom shortcodes, macros, or transform markdown text (e.g. badge directives, tabs, details, sitemap).
2. **`afterParse(html, context)`**:
   * Runs after Marked and DOMPurify finish generating sanitized HTML.
   * Use this to manipulate or inject HTML elements before mounting.
3. **`afterRender(context)`**:
   * Runs after the HTML has been rendered into the DOM (`context.container`).
   * Use this to attach interactive event listeners, initialize canvas/SVG renderers (e.g. Mermaid, KaTeX), or third-party widgets.

---

## 🚀 Concrete Example: The Visual Sitemap Plugin

Here is how `src/plugins/sitemap.ts` is implemented:

```typescript
import { VertiWikiPlugin } from '../core/pipeline';
import { parseNavigationMarkdown } from './sitemap';

export const sitemapPlugin: VertiWikiPlugin = {
  name: 'sitemap',
  beforeParse: (markdown) => {
    // Replace ::: sitemap ::: with DOM anchor
    return markdown.replace(/:::\s*sitemap[\s\S]*?:::/g, () => {
      return '\n<div class="verti-sitemap-root" data-sitemap="true"></div>\n';
    });
  },
  afterRender: async (context) => {
    const placeholders = context.container.querySelectorAll('.verti-sitemap-root');
    if (placeholders.length === 0) return;

    const navRes = await fetch(context.config.navigationFile);
    const navText = await navRes.text();
    const items = parseNavigationMarkdown(navText);

    // Render interactive cards and attach live search filtering...
  }
};
```

---

## 🎯 Live Demo: How to Use Badges in Markdown

You can write badges anywhere in your Markdown documents:

* Status: :badge[v0.2.4]{type=primary}
* Build: :badge[Passing]{type=success}
* Caution: :badge[Review Needed]{type=warning}
* Deprecated: :badge[Deprecated]{type=danger}
* Feature: :badge[Experimental]{type=purple}
* Tag: :badge[Documentation]{type=info}
