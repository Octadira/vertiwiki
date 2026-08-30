# Theme Engine & Design System

The VertiWiki 0.2.6 theme engine is built on modern **CSS Custom Properties (Design Tokens)** compatible with standard Tailwind CSS v4 and shadcn/ui architectures.

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

## 🎭 Built-in Themes Catalog

VertiWiki includes 8 built-in theme presets:

1. **`obsidian` (Obsidian Framework)**:
   * Deep carbon slate (`#10141a`, `#161B22`) with glowing neon cyan accents (`#00eefc`) and Geist typography.
2. **`terracotta` (Warm Terracotta)**:
   * Warm clay & sepia tones, Outfit typography (`#c96442`, `#faf9f5` / `#262624`, `#d97757`).
3. **`emerald` (Forest Emerald)**:
   * Crisp teal and vibrant emerald green (`#075e54`, `#25d366`, `#f0f2f5` / `#0b141a`, `#00a884`).
4. **`default` (Modern Indigo)**:
   * Minimalist documentation aesthetic inspired by VitePress and Tailwind UI.
5. **`nord` (Nord Arctic)**:
   * Cool arctic ice palette with frozen blues and muted slates.
6. **`dracula` (Dracula Midnight)**:
   * Classic high-contrast dark theme with vibrant purples and neon pinks.
7. **`amethyst` (Amethyst Cyber)**:
   * Electric purple, magenta, and cyberpunk accents.
8. **`editorial` (Editorial Serif)**:
   * Warm sepia paper background with elegant serif typography.

---

## ⚙️ Configuration & Theming Options

In `config.json`, you can customize the theme behavior:

```json
{
  "themePreset": "obsidian",
  "defaultTheme": "dark",
  "enableThemeChooser": true,
  "customThemes": [
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
