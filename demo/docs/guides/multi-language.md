---
title: Multi-Language (i18n) & Mirror Structure
description: Complete guide on configuring multi-language wikis with mirror subfolders, language switcher, and scoped search.
tags: [i18n, localization, languages, router, search]
---

# Multi-Language (i18n) Architecture & Guide 🌐

VertiWiki provides native, zero-backend multi-language support. You can author and serve documentation in multiple languages with dynamic client-side language switching, isolated MiniSearch indexing, and zero server-side build steps.

---

## 1. Directory Mirror Hierarchy

VertiWiki follows a clean mirror subfolder structure:
* **Default Language (e.g. English)**: Lives at the root directory (`index.md`, `navigation.md`, `docs/...`).
* **Additional Languages (e.g. French, Romanian)**: Live in mirror subfolders named after their ISO language code (`fr/`, `ro/`, etc.).

```text
my-wiki/
├── config.json
├── navigation.md              <-- Default navigation menu (EN)
├── index.md                   <-- Default home page (EN)
├── features.md                <-- (EN)
├── docs/
│   ├── getting-started/
│   │   └── installation.md    <-- (EN)
│   └── guides/
│       └── authoring.md       <-- (EN)
│
├── fr/                        <-- French Mirror
│   ├── navigation.md          <-- French navigation menu
│   ├── index.md               <-- French home page
│   ├── features.md            <-- French features
│   └── docs/
│       ├── getting-started/
│       │   └── installation.md
│       └── guides/
│           └── authoring.md
│
└── ro/                        <-- Romanian Mirror
    ├── navigation.md          <-- Romanian navigation menu
    ├── index.md               <-- Romanian home page
    ├── features.md            <-- Romanian features
    └── docs/
        ├── getting-started/
        │   └── installation.md
        └── guides/
            └── authoring.md
```

---

## 2. Configuration (`config.json`)

To enable multi-language support, define the `locales` array in your `config.json`:

```json
{
  "title": "VertiWiki",
  "enableLanguageChooser": true,
  "locales": [
    { "code": "en", "label": "English", "isDefault": true },
    { "code": "fr", "label": "Français", "prefix": "fr" },
    { "code": "ro", "label": "Română", "prefix": "ro" }
  ]
}
```

### Locale Configuration Properties:
* `code`: Standard ISO language code (`en`, `fr`, `ro`, `de`, `es`, `ja`, etc.).
* `label`: Human-readable name displayed in the language dropdown menu.
* `prefix` *(optional)*: Subfolder path prefix for this language (e.g. `"fr"`).
* `isDefault` *(optional)*: Set to `true` for the primary language hosted at root.

---

## 3. Dynamic Hash Router & Route Preservation

When switching languages via the header dropdown, the VertiWiki router automatically converts the active route to the target locale while preserving the document and section anchor:

* `#/docs/architecture/overview.md#pipeline` $\xrightarrow{\text{Switch to French}}$ `#/fr/docs/architecture/overview.md#pipeline`
* `#/ro/features.md#tabs` $\xrightarrow{\text{Switch to English}}$ `#/features.md#tabs`

---

## 4. Locale-Scoped Search (MiniSearch)

When multi-language is enabled, `MiniSearch` automatically indexes documents with their associated `locale`. When a user searches for keywords in the search dialog (`⌘K` or `/`), results are automatically scoped to the active language, eliminating cross-language result clutter.
