# Theme Engine & Design System

The VertiWiki theme engine is built on modern **CSS Custom Properties (Design Tokens)** compatible with standard Tailwind CSS v4 and shadcn/ui architectures.

---

## 🎨 Core Design Tokens

VertiWiki defines a universal set of CSS custom properties mapped across all themes and dark/light modes:

| Variable | Description | Example (Light) | Example (Dark) |
| :--- | :--- | :--- | :--- |
| `--background` | Main page background | `#faf9f5` | `#262624` |
| `--foreground` | Main body text color | `#3d3929` | `#f1f1ef` |
| `--card` | Background for cards, dialogs, navbar | `#ffffff` | `#2c2c2b` |
| `--primary` | Main accent / brand color | `#c96442` | `#d97757` |
| `--secondary` | Secondary buttons / surface accents | `#e9e6dc` | `#2c2c2b` |
| `--muted` | Subtle backgrounds (code, breadcrumbs, tags) | `#ede9de` | `#1b1b19` |
| `--muted-foreground` | Muted / secondary text | `#6e6d68` | `#b7b5a9` |
| `--border` | Dividers, table borders, card borders | `#dad9d4` | `#3e3e38` |
| `--accent` | Active hover highlights | `#e9e6dc` | `#34332e` |
| `--sidebar` | Left navigation sidebar background | `#f5f4ee` | `#1f1e1d` |
| `--font-sans` | Sans-serif typography stack | `Geist, system-ui, sans-serif` | `Geist, system-ui, sans-serif` |
| `--radius` | Border radius token | `0.75rem` | `0.75rem` |

---

## 🎭 Base Theme & Decoupled Presets Catalog

Starting with VertiWiki **0.9.0**, the engine bundles a single, canonical, ultra-clean base preset:

1. **`default` (Modern Monochrome & Slate)**:
   * Minimalist documentation aesthetic inspired by Shadcn/UI and Vercel. Features high-contrast monochrome design tokens (`#ffffff` light, `#09090b` dark, `#18181b` accents, and crisp system typography).

### 🎨 Modular Presets in `themes/`
All other presets are decoupled into dedicated, auto-resolving JSON files in the `themes/` directory:
* **`themes/obsidian.json`**: Deep carbon slate with glowing neon cyan accents (`#00eefc`) and Geist typography.
* **`themes/terracotta.json`**: Warm clay & sepia tones with Outfit typography.
* **`themes/emerald.json`**: Crisp teal and vibrant emerald green.
* **`themes/nord.json`**: Cool arctic ice palette with frozen blues.
* **`themes/dracula.json`**: High-contrast dark theme with vibrant purples and neon pinks.
* **`themes/amethyst.json`**: Electric violet and magenta cyberpunk style.
* **`themes/editorial.json`**: Literary serif typography on sepia paper.

---

## 🏛️ Modular Layout Engine (`data-layout`)

VertiWiki includes an extensible layout engine for **technical** and **non-technical** documentation:

| Layout Mode | Intended Use Case | Behavior & Characteristics |
| :--- | :--- | :--- |
| `default` | Classic Documentation Wiki | Standard 3-column layout (Sidebar + Content + Table of Contents). |
| `book` | Books, Novels, Essays, Academic Papers | Centered reading column, hidden TOC sidebar, elegant reading margins. |
| `handbook` | Employee Onboarding, Company Policies, SOPs | Non-technical width, friendly padding, optimized for HR and Operations. |
| `api` | REST APIs, SDK References | Expands content wrapper for dual-pane and sticky 3-column code rails. |
| `hub` | Developer Portals, Multi-Product Platforms | Bento-grid card sections and glassmorphism navbar. |

### Configuration Example
```json
{
  "themePreset": "default",
  "layoutMode": "handbook",
  "contentWidth": "readable",
  "enableAiCopy": false,
  "headerLinks": [
    { "title": "Platform", "href": "https://company.com", "isExternal": true },
    { "title": "Sign In", "href": "https://app.company.com/login", "type": "button" }
  ]
}
```

---

## 📖 Reading Ergonomics for Non-Technical Documentation

For employee handbooks, onboarding guides, legal documents, and literary writing:
* **`contentWidth: "readable"`**: Enforces the golden editorial standard of `68ch` (~68 characters per line) with relaxed `1.8` line-height, eliminating eye fatigue on wide monitors.
* **`enableAiCopy: false`**: Hides developer-centric "Copy for AI" buttons to present a clean, friendly document for general audiences.

---

## ⚡ Standalone Commercial Pro Themes (`pro-themes/`)

Pre-crafted commercial theme packages ready for enterprise deployment:
1. **`pro-themes/company-handbook/`**: Soft sage/slate palette, checklist styling (`- [x]`), friendly pastel callouts.
2. **`pro-themes/minimal-book/`**: Distraction-free reading with Lora serif typography and book chapter dividers.
3. **`pro-themes/api-pro/`**: Stripe & Mintlify-grade 3-column layout with synchronized code tabs and HTTP method badges.
4. **`pro-themes/developer-hub/`**: Enterprise developer portal with Bento-grid card tiles.
    "themes/obsidian.json"
  ]
}
```

* `"themePreset"`: ID of the active default theme (`obsidian`, `terracotta`, `emerald`, `nord`, etc.).
* `"defaultTheme"`: `'auto'` (follows user OS dark/light preference), `'light'`, or `'dark'`.
* `"customThemes"`: Array of file paths to dedicated `.json` theme files in the `themes/` folder.

---

## 🔤 Configuring Fonts & Typography

VertiWiki allows you to customize the typography for any theme preset:

### 1. Font Properties
* **`fontSans`**: The main sans-serif font family used for body text, headings, and menus.
* **`fontMono`**: Monospace font family for code blocks and inline `<code>`.
* **`fontSerif`**: Serif font family for editorial / literary themes.
* **`fontUrl`**: *(Optional)* Direct link to an external Google Font or Web Font stylesheet. When specified, VertiWiki automatically loads the font into `<head>` dynamically!

---

## 🛠️ Adding Custom Themes

### Method 1: Dedicated File in `themes/` (Recommended)

Create a dedicated `.json` file inside `themes/` (e.g. `themes/sunset.json`):

```json
{
  "id": "sunset",
  "name": "Sunset Coral",
  "previewColor": "#f97316",
  "fontUrl": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap",
  "light": {
    "fontSans": "'Plus Jakarta Sans', sans-serif",
    "primary": "#f97316",
    "primaryForeground": "#ffffff",
    "background": "#fffbf5",
    "foreground": "#27272a",
    "card": "#ffffff",
    "cardForeground": "#27272a",
    "secondary": "#ffedd5",
    "secondaryForeground": "#7c2d12",
    "muted": "#fef3c7",
    "mutedForeground": "#78716c",
    "accent": "#ffedd5",
    "accentForeground": "#7c2d12",
    "border": "#fed7aa",
    "sidebar": "#fffbf5",
    "sidebarForeground": "#27272a",
    "sidebarBorder": "#fed7aa",
    "radius": "0.75rem"
  },
  "dark": {
    "fontSans": "'Plus Jakarta Sans', sans-serif",
    "primary": "#fb923c",
    "primaryForeground": "#000000",
    "background": "#181411",
    "foreground": "#fafaf9",
    "card": "#231d18",
    "cardForeground": "#fafaf9",
    "secondary": "#2e241c",
    "secondaryForeground": "#fafaf9",
    "muted": "#1e1814",
    "mutedForeground": "#a8a29e",
    "accent": "#2e241c",
    "accentForeground": "#fb923c",
    "border": "#3d2e24",
    "sidebar": "#14100d",
    "sidebarForeground": "#fafaf9",
    "sidebarBorder": "#3d2e24",
    "radius": "0.75rem"
  }
}
```

And in `config.json`:
```json
{
  "themePreset": "sunset",
  "customThemes": [
    "themes/sunset.json"
  ]
}
```

### Method 2: In TypeScript Source (`src/ui/themes/presets.ts`)

```typescript
import { defineTheme } from './presets';

export const customTheme = defineTheme({
  id: 'custom-theme',
  name: 'Custom Theme',
  previewColor: '#3b82f6',
  light: { /* colors */ },
  dark: { /* colors */ }
});
```

---

## 📄 Per-Page Theme Overrides

Any page can force a specific theme using YAML frontmatter:

```markdown
---
theme: obsidian
---

# Page in Obsidian Palette
When opened, VertiWiki instantly applies the Obsidian Framework theme!
```
