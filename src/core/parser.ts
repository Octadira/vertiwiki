import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface ParsedMarkdown {
  html: string;
  frontmatter: Record<string, string>;
  title: string;
  description: string;
  author?: string;
  date?: string;
  tags?: string[];
  rawBody: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cleanTitle(raw: string): string {
  if (!raw) return '';
  return raw
    // Remove rendered badge spans
    .replace(/<span[^>]*class="[^"]*(?:verti|cortex|omni)-badge[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '')
    // Remove markdown badge syntax if not yet transformed
    .replace(/:badge\[[^\]]+\](?:\{type=[^}]+\})?/gi, '')
    // Remove any remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown formatting characters
    .replace(/[*_`~#]/g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseFrontmatter(markdown: string): { frontmatter: Record<string, string>; body: string } {
  const frontmatter: Record<string, string> = {};
  let body = markdown;

  const fmMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (fmMatch) {
    const rawFm = fmMatch[1];
    body = markdown.substring(fmMatch[0].length);

    rawFm.split(/\r?\n/).forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.substring(0, colonIdx).trim();
        let val = line.substring(colonIdx + 1).trim();
        
        // Handle array syntax e.g. tags: [a, b, c]
        if (val.startsWith('[') && val.endsWith(']')) {
          val = val.substring(1, val.length - 1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).join(', ');
        } else {
          val = val.replace(/^["']|["']$/g, '');
        }

        if (key) {
          frontmatter[key] = val;
        }
      }
    });
  }

  return { frontmatter, body };
}

export class MarkdownParser {
  constructor() {
    marked.setOptions({
      gfm: true,
      breaks: true
    });
  }

  public parse(rawMarkdown: string): ParsedMarkdown {
    const { frontmatter, body } = parseFrontmatter(rawMarkdown);

    // 1. Extract first H1 for title if not in frontmatter
    let title = frontmatter.title ? cleanTitle(frontmatter.title) : '';
    if (!title) {
      const h1Match = body.match(/^#\s+(.+)$/m);
      if (h1Match) {
        title = cleanTitle(h1Match[1]);
      }
    }

    // 2. Extract description from frontmatter or first paragraph
    let description = frontmatter.description || '';
    if (!description) {
      const paragraphs = body.split(/\r?\n\r?\n/);
      for (const p of paragraphs) {
        const clean = cleanTitle(p.replace(/^#+\s+.*/, ''));
        if (clean.length > 20) {
          description = clean.length > 160 ? `${clean.substring(0, 157)}...` : clean;
          break;
        }
      }
    }

    const tags = frontmatter.tags ? frontmatter.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    // Custom marked renderer for headings
    const renderer = new marked.Renderer();
    const usedSlugs = new Set<string>();

    renderer.heading = function({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const plainText = text.replace(/<[^>]*>/g, '').trim();
      let slug = slugify(plainText) || `heading-${depth}`;
      let counter = 1;
      while (usedSlugs.has(slug)) {
        slug = `${slug}-${counter++}`;
      }
      usedSlugs.add(slug);

      return `\n<h${depth} id="${slug}" class="verti-heading cortex-heading omni-heading">${text}</h${depth}>\n`;
    };

    const dirtyHtml = marked.parse(body, { renderer }) as string;

    // Secure DOMPurify configuration allowing safe tags for KaTeX, Mermaid, SVGs, and Iframes
    const cleanHtml = DOMPurify.sanitize(dirtyHtml, {
      ADD_TAGS: [
        'iframe',
        'math',
        'annotation',
        'semantics',
        'mtext',
        'mn',
        'mo',
        'mi',
        'mspace',
        'mover',
        'munder',
        'munderover',
        'msup',
        'msub',
        'msubsup',
        'mfrac',
        'mroot',
        'msqrt',
        'mtable',
        'mtr',
        'mtd',
        'mlabeledtr',
        'details',
        'summary',
        'button',
        'svg',
        'path',
        'rect',
        'circle',
        'line',
        'polyline',
        'polygon',
        'g',
        'nav'
      ],
      ADD_ATTR: [
        'allowfullscreen',
        'frameborder',
        'target',
        'rel',
        'display',
        'xmlns',
        'aria-hidden',
        'aria-label',
        'viewBox',
        'd',
        'fill',
        'stroke',
        'stroke-width',
        'stroke-linecap',
        'stroke-linejoin',
        'data-tab-target',
        'data-tabs-id',
        'open'
      ]
    });

    return {
      html: cleanHtml,
      frontmatter,
      title: title || 'VertiWiki',
      description: description || 'Documentation powered by VertiWiki',
      author: frontmatter.author,
      date: frontmatter.date,
      tags,
      rawBody: body
    };
  }
}
