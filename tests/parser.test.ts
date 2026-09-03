import { describe, it, expect, vi } from 'vitest';
import DOMPurify from 'dompurify';
import { slugify, cleanTitle, parseFrontmatter, MarkdownParser } from '../src/core/parser';

describe('Markdown Parser Utilities', () => {
  it('slugify converts text into URL-safe anchors', () => {
    expect(slugify('Hello World 2026!')).toBe('hello-world-2026');
    expect(slugify('  Guides & Architecture / API  ')).toBe('guides-architecture-api');
    expect(slugify('---Trimming Leading & Trailing---')).toBe('trimming-leading-trailing');
    expect(slugify('Special Characters @#%*')).toBe('special-characters');
  });

  it('cleanTitle strips HTML, badges, markdown formatting, and links', () => {
    expect(cleanTitle('# Welcome to **VertiWiki**')).toBe('Welcome to VertiWiki');
    expect(cleanTitle('Release 0.5.1 :badge[Latest]{type=success}')).toBe('Release 0.5.1');
    expect(cleanTitle('See [Our Docs](docs/index.md) now!')).toBe('See Our Docs now!');
    expect(cleanTitle('Title with <span class="verti-badge">Badge</span> and <script>alert(1)</script>')).toBe('Title with and alert(1)');
  });

  it('parseFrontmatter extracts YAML key-values and separates markdown body', () => {
    const raw = `---
title: Custom Title
description: A short guide to VertiWiki
tags: [alpha, beta, gamma]
author: Adrian
date: "2026-03-01"
---

# Real Content Starts Here
This is the body.`;

    const { frontmatter, body } = parseFrontmatter(raw);
    expect(frontmatter.title).toBe('Custom Title');
    expect(frontmatter.description).toBe('A short guide to VertiWiki');
    expect(frontmatter.tags).toBe('alpha, beta, gamma');
    expect(frontmatter.author).toBe('Adrian');
    expect(frontmatter.date).toBe('2026-03-01');
    expect(body.trim()).toBe('# Real Content Starts Here\nThis is the body.');
  });

  it('parseFrontmatter returns empty object when frontmatter is omitted', () => {
    const raw = `# Just A Heading\n\nNo frontmatter here.`;
    const { frontmatter, body } = parseFrontmatter(raw);
    expect(Object.keys(frontmatter).length).toBe(0);
    expect(body).toBe(raw);
  });
});

describe('MarkdownParser Core Engine', () => {
  const parser = new MarkdownParser();

  it('extracts title and description from frontmatter when present', () => {
    const md = `---
title: Frontmatter Title
description: Frontmatter description text here.
---
# Ignored H1`;

    const parsed = parser.parse(md);
    expect(parsed.title).toBe('Frontmatter Title');
    expect(parsed.description).toBe('Frontmatter description text here.');
  });

  it('extracts title from the first H1 if frontmatter title is missing', () => {
    const md = `## H2 First\n# First H1 Heading\n# Second H1`;
    const parsed = parser.parse(md);
    expect(parsed.title).toBe('First H1 Heading');
  });

  it('extracts description from the first paragraph if frontmatter description is missing', () => {
    const md = `# Title\n\nVertiWiki is an ultra-fast, zero-backend, single-file Markdown wiki engine.`;
    const parsed = parser.parse(md);
    expect(parsed.description).toBe('VertiWiki is an ultra-fast, zero-backend, single-file Markdown wiki engine.');
  });

  it('generates unique heading IDs with slug collision resolution', () => {
    const md = `
# Overview
Some text.
## Overview
Sub-overview.
### Overview
Nested overview.
`;
    const parsed = parser.parse(md);
    expect(parsed.html).toContain('id="overview"');
    expect(parsed.html).toContain('id="overview-1"');
    expect(parsed.html).toContain('id="overview-2"');
  });

  it('delegates to DOMPurify.sanitize with safe tags and attributes whitelist', () => {
    const sanitizeSpy = vi.fn().mockImplementation((html: string) => {
      return html.replace(/<script[\s\S]*?<\/script>/gi, '');
    });
    DOMPurify.sanitize = sanitizeSpy;

    const maliciousMd = `# Malicious Page\n<script>alert(1)</script>\nSafe text.`;
    const parsed = parser.parse(maliciousMd);

    expect(sanitizeSpy).toHaveBeenCalled();
    expect(sanitizeSpy).toHaveBeenCalledWith(
      expect.stringContaining('Malicious Page'),
      expect.objectContaining({
        ADD_TAGS: expect.arrayContaining(['iframe', 'details', 'summary', 'svg', 'math'])
      })
    );
    expect(parsed.html).not.toContain('<script>');
  });

  it('renders standard Markdown elements into semantic HTML', () => {
    const md = `
- Item 1
- Item 2

| Col 1 | Col 2 |
| ----- | ----- |
| Val A | Val B |
`;
    const parsed = parser.parse(md);
    expect(parsed.html).toContain('<ul>');
    expect(parsed.html).toContain('<li>Item 1</li>');
    expect(parsed.html).toContain('<table>');
    expect(parsed.html).toContain('<th>Col 1</th>');
    expect(parsed.html).toContain('<td>Val A</td>');
  });
});
