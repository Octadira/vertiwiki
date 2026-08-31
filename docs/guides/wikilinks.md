---
title: Wikilinks & Cross-Referencing
description: Master fast bidirectional document cross-linking in VertiWiki using double-bracket [[wikilinks]] syntax, aliases, and section anchors.
author: VertiWiki Contributors
date: 2026-08-31
tags: [wikilinks, obsidian, navigation, cross-referencing, gfm]
---

# Wikilinks & Cross-Referencing :badge[Core Plugin]{type=primary} :badge[Core Plugin]{type=success}

VertiWiki provides native, zero-build client-side support for **Wikilinks** (`[[...]]`). This syntax allows authors, technical writers, and PKM (Personal Knowledge Management) users to quickly interlink markdown documents without having to author verbose CommonMark link syntax.

---

## ⚡ Quick Syntax Overview

| Syntax | Target Resolution | Generated Link Label |
| :--- | :--- | :--- |
| `[[features]]` | `features.md` | `features` |
| `[[features\|Interactive Features]]` | `features.md` | `Interactive Features` |
| `[[docs/guides/authoring]]` | `docs/guides/authoring.md` | `authoring` |
| `[[docs/guides/authoring\|Authoring Guide]]` | `docs/guides/authoring.md` | `Authoring Guide` |
| `[[math_diagrams#mermaid]]` | `math_diagrams.md#mermaid` | `math_diagrams #mermaid` |
| `[[math_diagrams#mermaid\|Mermaid Flowcharts]]` | `math_diagrams.md#mermaid` | `Mermaid Flowcharts` |

---

## 📖 Detailed Usage Examples

### 1. Basic Document Links
To create a link to another document in your wiki, wrap the document filename (with or without `.md`) in double brackets:

```markdown
Learn more about our design system in [[themes]].
```
* Renders as: Learn more about our design system in [themes](themes.md).

### 2. Custom Labels & Aliases (`|`)
When you want the link text to differ from the target filename, use a pipe delimiter (`|`):

```markdown
Check out the [[features|Modern 2026 Features]] available in this engine.
```
* Renders as: Check out the [Modern 2026 Features](features.md) available in this engine.

### 3. Deep Section Anchors (`#`)
You can link directly to specific headings inside any document:

```markdown
Read the [[math_diagrams#mermaid-flowcharts-and-diagrams|Mermaid Diagrams Section]].
```
* Renders as: Read the [Mermaid Diagrams Section](math_diagrams.md#mermaid-flowcharts-and-diagrams).

### 4. Subfolder Relative Cross-Links
For documents organized in nested directories, provide the relative path:

```markdown
Refer to the [[docs/architecture/overview|Core Architecture Overview]] or [[docs/getting-started/installation|Installation Guide]].
```

---

## 🛡️ Code Block Isolation & Zero False Positives

The built-in Wikilinks pre-processor automatically protects code blocks. Any `[[wikilink]]` written inside:
* Fenced code blocks (```` ```...``` ```` or `~~~...~~~`)
* Inline code spans (`` `...` ``)

...will remain untouched as literal text, preventing unintended link generation when documenting code examples.

---

## 🧠 Obsidian & PKM Vault Interoperability

If you author documentation or maintain research vaults in **Obsidian**, **Logseq**, or **Roam Research**:
1. VertiWiki natively understands the standard `[[target|alias]]` vault cross-reference format.
2. You can drop your markdown vault folders directly into a VertiWiki repository.
3. No intermediate export or static generation step is required—all wikilinks resolve instantly in the browser at runtime!
