import { describe, it, expect } from 'vitest';
import { escapeHtml, sanitizeUrl } from '../src/core/escape';

describe('Escape and Sanitization Utility', () => {
  describe('escapeHtml', () => {
    it('escapes standard HTML characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
      expect(escapeHtml("Tom & 'Jerry'")).toBe('Tom &amp; &#39;Jerry&#39;');
    });

    it('handles null, undefined and non-string inputs', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
      expect(escapeHtml(123)).toBe('123');
    });

    it('leaves safe strings unmodified', () => {
      expect(escapeHtml('Hello World!')).toBe('Hello World!');
    });
  });

  describe('sanitizeUrl', () => {
    it('blocks dangerous protocols', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('about:blank');
      expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBe('about:blank');
      expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('about:blank');
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('about:blank');
    });

    it('allows safe URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
      expect(sanitizeUrl('http://example.com/path?foo=bar')).toBe('http://example.com/path?foo=bar');
      expect(sanitizeUrl('#/guide.md')).toBe('#/guide.md');
      expect(sanitizeUrl('/docs/index.html')).toBe('/docs/index.html');
    });
  });
});
