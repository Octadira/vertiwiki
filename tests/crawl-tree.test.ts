import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderCrawlTreeHtml } from '../src/core/crawl-tree';
import { NavigationItem } from '../src/core/types';
import { Router } from '../src/core/router';

describe('Static Bot Crawl Tree Engine', () => {
  it('renders a valid semantic navigation tree from navigation items', () => {
    const items: NavigationItem[] = [
      { title: 'Welcome', href: 'index.md' },
      {
        title: 'Guides',
        href: 'docs/guides/index.md',
        children: [
          { title: 'Deployment', href: 'docs/guides/deployment.md' },
          { title: 'Authoring', href: 'docs/guides/authoring.md' }
        ]
      },
      { title: 'GitHub Repo', href: 'https://github.com/Octadira/vertiwiki', isExternal: true }
    ];

    const html = renderCrawlTreeHtml(items);

    expect(html).toContain('<nav class="verti-crawl-tree" aria-label="Documentation Navigation Index">');
    expect(html).toContain('<a href="index.md">Welcome</a>');
    expect(html).toContain('<a href="docs/guides/deployment.md">Deployment</a>');
    expect(html).toContain('<a href="https://github.com/Octadira/vertiwiki" target="_blank" rel="noopener noreferrer">GitHub Repo</a>');
    expect(html).toContain('</nav>');
  });

  it('escapes special characters to prevent HTML injection', () => {
    const maliciousItems: NavigationItem[] = [
      { title: '<script>alert(1)</script>', href: 'test.md" onclick="alert(2)' }
    ];

    const html = renderCrawlTreeHtml(maliciousItems, { ariaLabel: '<Custom "Label">' });

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('test.md&quot; onclick=&quot;alert(2)');
    expect(html).toContain('aria-label="&lt;Custom &quot;Label&quot;&gt;"');
  });

  it('supports visuallyHidden option for unobtrusive bot-friendly indexing', () => {
    const items: NavigationItem[] = [{ title: 'Home', href: 'index.md' }];
    const html = renderCrawlTreeHtml(items, { visuallyHidden: true, id: 'bot-crawl-tree' });

    expect(html).toContain('id="bot-crawl-tree"');
    expect(html).toContain('position:absolute');
    expect(html).toContain('clip:rect(0,0,0,0)');
  });

  it('handles empty navigation items gracefully', () => {
    const html = renderCrawlTreeHtml([]);
    expect(html).toContain('<nav class="verti-crawl-tree" aria-label="Documentation Navigation Index">');
    expect(html).toContain('</nav>');
  });
});

describe('Router Query Parameter Handling for Crawl Redirection', () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    (globalThis as any).window = {
      location: {
        hash: '',
        search: '',
        origin: 'https://verti.wiki',
        pathname: '/docs/'
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
  });

  it('routes to normalized page when ?page= query parameter is present without hash', () => {
    const onRouteChanged = vi.fn().mockResolvedValue(undefined);
    window.location.search = '?page=docs/guides/sitemap-seo.md';

    const router = new Router('index.md', onRouteChanged);
    router.init();

    expect(window.location.hash).toBe('#/docs/guides/sitemap-seo.md');
  });

  it('routes to normalized page when ?p= query parameter is present without hash', () => {
    const onRouteChanged = vi.fn().mockResolvedValue(undefined);
    window.location.search = '?p=docs/getting-started/installation.md';

    const router = new Router('index.md', onRouteChanged);
    router.init();

    expect(window.location.hash).toBe('#/docs/getting-started/installation.md');
  });

  it('routes to default page when no hash and no search query params exist', () => {
    const onRouteChanged = vi.fn().mockResolvedValue(undefined);
    window.location.search = '';

    const router = new Router('index.md', onRouteChanged);
    router.init();

    expect(window.location.hash).toBe('#/index.md');
  });
});

