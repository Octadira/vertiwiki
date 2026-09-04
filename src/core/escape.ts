/**
 * Utility functions for HTML escaping and URL sanitization.
 */

const HTML_ESCAPE_LOOKUP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Escapes special HTML characters to prevent XSS.
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"']/g, match => HTML_ESCAPE_LOOKUP[match] || match);
}

/**
 * Validates and sanitizes a URL to ensure it does not use dangerous protocols like javascript: or data:
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  // Strip control characters
  const sanitized = trimmed.replace(/[\u0000-\u001F\u007F-\u009F\s]+/g, '');
  
  // Check for dangerous schemes
  const lower = sanitized.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:text/html')
  ) {
    return 'about:blank';
  }

  return trimmed;
}
