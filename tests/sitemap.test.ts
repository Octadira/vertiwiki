import { describe, it, expect } from 'vitest';
import { parseNavigationMarkdown, sitemapPlugin } from '../src/plugins/sitemap';

describe('sitemapPlugin & Navigation Parser', () => {
  it('parses structured navigation markdown into grouped items', () => {
    const navMd = `
# Getting Started
* [Welcome](index.md)
* [Installation](docs/installation.md)

# Guides
* [Authoring](docs/authoring.md)
* [External GitHub](https://github.com/Octadira/vertiwiki)
`;

    const items = parseNavigationMarkdown(navMd, 'navigation.md');
    expect(items.length).toBe(2);

    // Section 1
    expect(items[0].title).toBe('Getting Started');
    expect(items[0].children?.length).toBe(2);
    expect(items[0].children?.[0].title).toBe('Welcome');
    expect(items[0].children?.[0].href).toBe('index.md');
    expect(items[0].children?.[0].isExternal).toBe(false);

    // Section 2
    expect(items[1].title).toBe('Guides');
    expect(items[1].children?.length).toBe(2);
    expect(items[1].children?.[1].title).toBe('External GitHub');
    expect(items[1].children?.[1].href).toBe('https://github.com/Octadira/vertiwiki');
    expect(items[1].children?.[1].isExternal).toBe(true);
  });

  it('resolves relative paths with baseFilePath directory prefix', () => {
    const navMd = `
# Subfolder Section
* [Guide](guide.md)
`;
    const items = parseNavigationMarkdown(navMd, 'demo/navigation.md');
    expect(items[0].children?.[0].href).toBe('demo/guide.md');
  });

  it('transforms ::: sitemap ::: syntax into root placeholder container', () => {
    const md = '# Site Directory\n\n::: sitemap\n:::';
    const result = sitemapPlugin.beforeParse!(md, {} as any) as string;
    expect(result).toContain('<div class="verti-sitemap-root" data-sitemap="true"></div>');
  });
});
