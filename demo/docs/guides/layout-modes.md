---
title: Modular Layouts & Non-Technical Documentation
description: Guide on using VertiWiki's modular layout engine for employee handbooks, literary books, and API documentation.
---

# Modular Layouts & Non-Technical Documentation

Starting with VertiWiki **0.9.0**, the engine includes a zero-bloat, modular layout engine that adapts to **technical** and **non-technical** documentation alike.

---

## 🏛️ Available Layout Modes

You can set the layout globally in `config.json` via `"layoutMode"` or per-page in Markdown frontmatter:

```markdown
---
layout: handbook
contentWidth: readable
---
```

| Layout | Focus | Key Behavior |
| :--- | :--- | :--- |
| **`default`** | Technical Wiki | 3-column classic layout (Sidebar, Article, Table of Contents). |
| **`handbook`** | Non-Technical / HR | Warm typography, friendly spacing, onboarding checklist support, no developer clutter. |
| **`book`** | Literary / Academic | Centered reading column, hidden TOC, generous line-height, elegant typography. |
| **`api`** | REST APIs / SDKs | Expands content wrapper for sticky 3-column split code rails. |
| **`hub`** | Platform Portals | Bento-grid cards for multi-product directories. |

---

## 📖 Reading Ergonomics for Non-Technical Docs

When publishing employee handbooks, HR policies, user manuals, or digital books:

### 1. Optimal Reading Width (`contentWidth: "readable"`)
On modern widescreen displays, reading lines exceeding 80 characters causes visual fatigue. By setting:
```json
"contentWidth": "readable"
```
VertiWiki constrains prose to the golden editorial measure of **`68ch`** (~68 characters per line) with relaxed `1.8` line-height.

### 2. Clean UI Controls (`enableAiCopy: false`)
For non-developer teams, developer buttons like "Copy for AI" are unnecessary. Disabling it in `config.json`:
```json
"enableAiCopy": false
```
cleanly hides the button, keeping the interface focused solely on reading and navigation.

---

## 🤝 Onboarding Checklists in Action

Non-technical documentation often involves step-by-step onboarding workflows. VertiWiki supports interactive task checklists natively:

- [x] Sign company employment contract
- [x] Set up corporate email & 2FA authentication
- [ ] Complete workplace safety and security training
- [ ] Review vacation & time-off policies in the employee portal

---

## ⚡ Synchronized Code & Content Tabs

When documenting multi-language SDKs or multi-platform procedures, VertiWiki automatically synchronizes tabs across the page:

::: tabs
== cURL
```bash
curl -X GET https://api.example.com/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```
== Python
```python
import requests

response = requests.get(
    "https://api.example.com/v1/users",
    headers={"Authorization": "Bearer YOUR_TOKEN"}
)
print(response.json())
```
== Node.js
```javascript
const res = await fetch('https://api.example.com/v1/users', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});
const data = await res.json();
console.log(data);
```
:::

> [!TIP]
> Switching the tab above to **Python** will automatically switch any other tab labeled **Python** on the entire page, and remember your choice for your next visit!

---

## 🌐 Header Navigation Links (`headerLinks`)

For SaaS companies, enterprise intranets, or public wikis, you can easily add top navigation links in `config.json`:

```json
{
  "headerLinks": [
    { "title": "Main Platform", "href": "https://company.com", "isExternal": true },
    { "title": "API Status", "href": "https://status.company.com" },
    { "title": "Sign In", "href": "https://app.company.com/login", "type": "button" }
  ]
}
```
