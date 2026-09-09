# 🎨 VertiWiki Theme System :badge[OKLCH Color Space]{type=purple} :badge[Instant Switching]{type=success}

VertiWiki comes with a powerful, **100% offline, zero-reload theme engine** based on modern CSS custom properties and standard Tailwind / shadcn design tokens.

---

## 🎨 Base Theme & Decoupled Presets

VertiWiki features a modular, zero-bloat theme system:

### 1. Built-in Base Theme:
* ⚡ **`default` (Modern Monochrome & Slate)**: High-contrast, minimalist documentation aesthetic inspired by Shadcn/UI and Vercel (`#ffffff` / `#09090b`), bundled directly into the core engine with zero external requests.

### 2. Modular Presets in `themes/`:
* ⚡ **Obsidian Framework (`themes/obsidian.json`)**: Neon cyan on deep carbon slate with Geist typography.
* 🍂 **Warm Terracotta (`themes/terracotta.json`)**: Warm sepia and terracotta clay with Outfit typography.
* 🌲 **Forest Emerald (`themes/emerald.json`)**: Fresh teal & emerald green with clean lines.
* ❄️ **Nord Arctic (`themes/nord.json`)**: Polar ice palette with muted blues and snow whites.
* 🧛 **Dracula Midnight (`themes/dracula.json`)**: High-contrast purple and pink aesthetic.
* 🔮 **Amethyst Cyber (`themes/amethyst.json`)**: Electric violet and neon magenta.
* 📜 **Editorial Serif (`themes/editorial.json`)**: Warm literary serif typography on sepia paper.

### 3. Commercial Standalone Pro Themes in `pro-themes/`:
* 🤝 **Company Handbook (`pro-themes/company-handbook/`)**: Warm, friendly theme for HR onboarding, SOPs, and company policies.
* 📖 **Minimal Book (`pro-themes/minimal-book/`)**: Distraction-free reading with Lora serif typography for books, essays, and courses.
* ⚡ **API Reference Pro (`pro-themes/api-pro/`)**: Stripe & Mintlify-grade 3-column split layout for REST APIs and SDKs.
* 🚀 **Developer Hub (`pro-themes/developer-hub/`)**: Multi-product platform portal with Bento-grid card sections.

---

## ⚙️ Enabling / Disabling the UI Theme Chooser

You can enable or disable the palette icon dropdown in the Header via `config.json`:

```json
{
  "enableThemeChooser": true,
  "themePreset": "obsidian",
  "defaultTheme": "dark"
}
```

* Set `"enableThemeChooser": false` if you want a fixed, enforced theme for your site.
* Set `"themePreset": "obsidian"` (or any theme ID) to define the default palette.

---

## 🔤 Configuring Fonts & Typography

VertiWiki allows you to customize the typography for any theme:

* **`fontSans`**: Main sans-serif font family used across the wiki (e.g. `"Geist, system-ui, sans-serif"`, `"Inter, sans-serif"`).
* **`fontMono`**: Monospace font family for code blocks and inline `<code>` (e.g. `"JetBrains Mono, monospace"`, `"ui-monospace, monospace"`).
* **`fontSerif`**: Serif font family for editorial / literary themes (e.g. `"Georgia, serif"`).
* **`fontUrl`**: *(Optional)* URL of an external Google Font stylesheet. VertiWiki loads it dynamically in the browser with zero build steps!

---

## 🛠️ How to Create Custom Themes

You can create and add your own custom themes in three easy ways:

### Method A: Dedicated Theme Files in `themes/` (Recommended)

To keep your `config.json` clean and concise, store custom themes as standalone `.json` files in the `themes/` directory:

1. Create a file `themes/my-brand.json`:
```json
{
  "id": "my-brand",
  "name": "My Brand Theme",
  "icon": "✨",
  "previewColor": "#ff5722",
  "fontUrl": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  "light": {
    "background": "#ffffff",
    "foreground": "#111827",
    "card": "#ffffff",
    "cardForeground": "#111827",
    "primary": "#ff5722",
    "primaryForeground": "#ffffff",
    "secondary": "#f3f4f6",
    "secondaryForeground": "#1f2937",
    "muted": "#f3f4f6",
    "mutedForeground": "#6b7280",
    "accent": "#ff5722",
    "accentForeground": "#ffffff",
    "border": "#e5e7eb",
    "sidebar": "#f9fafb",
    "sidebarForeground": "#111827",
    "sidebarBorder": "#e5e7eb",
    "fontSans": "Inter, sans-serif",
    "radius": "0.5rem"
  },
  "dark": {
    "background": "#0f172a",
    "foreground": "#f8fafc",
    "card": "#1e293b",
    "cardForeground": "#f8fafc",
    "primary": "#ff7043",
    "primaryForeground": "#0f172a",
    "secondary": "#334155",
    "secondaryForeground": "#f8fafc",
    "muted": "#1e293b",
    "mutedForeground": "#94a3b8",
    "accent": "#ff7043",
    "accentForeground": "#0f172a",
    "border": "#334155",
    "sidebar": "#0b1120",
    "sidebarForeground": "#f8fafc",
    "sidebarBorder": "#334155",
    "fontSans": "Inter, sans-serif",
    "radius": "0.5rem"
  }
}
```

2. Reference it cleanly in `config.json`:
```json
{
  "themePreset": "my-brand",
  "customThemes": [
    "themes/my-brand.json"
  ]
}
```

---

### Method B: Inline Definition in `config.json`

You can also define custom themes directly inside `config.json`:

```json
{
  "themePreset": "my-brand",
  "customThemes": [
    {
      "id": "my-brand",
      "name": "My Brand Theme",
      "previewColor": "#ff5722",
      "light": { ... },
      "dark": { ... }
    }
  ]
}
```

---

### Method C: TypeScript Definition (`src/ui/themes/presets.ts`)

Using the `defineTheme()` helper inside the source code:

```typescript
import { defineTheme } from './presets';

export const myTheme = defineTheme({
  id: 'cyber-neon',
  name: 'Cyber Neon',
  icon: '⚡',
  previewColor: '#00ffcc',
  light: {
    background: '#f0fdfa',
    foreground: '#134e4a',
    card: '#ffffff',
    cardForeground: '#134e4a',
    primary: '#0d9488',
    primaryForeground: '#ffffff',
    secondary: '#ccfbf1',
    secondaryForeground: '#115e59',
    muted: '#ccfbf1',
    mutedForeground: '#5eead4',
    accent: '#14b8a6',
    accentForeground: '#ffffff',
    border: '#99f6e4',
    sidebar: '#ffffff',
    sidebarForeground: '#134e4a',
    sidebarBorder: '#99f6e4',
    fontSans: 'Space Grotesk, sans-serif',
    radius: '0.75rem'
  },
  dark: {
    background: '#042f2e',
    foreground: '#f0fdfa',
    card: '#115e59',
    cardForeground: '#f0fdfa',
    primary: '#2dd4bf',
    primaryForeground: '#042f2e',
    secondary: '#134e4a',
    secondaryForeground: '#f0fdfa',
    muted: '#115e59',
    mutedForeground: '#99f6e4',
    accent: '#5eead4',
    accentForeground: '#042f2e',
    border: '#134e4a',
    sidebar: '#022c22',
    sidebarForeground: '#f0fdfa',
    sidebarBorder: '#134e4a',
    fontSans: 'Space Grotesk, sans-serif',
    radius: '0.75rem'
  }
});
```

---

## 📄 Per-Page Theme Overrides

You can force a specific theme on an individual document by setting the `theme` property in the frontmatter:

```markdown
---
theme: obsidian
---

# Page with Obsidian Theme
This page automatically switches to the Obsidian Framework palette when visited!
```
