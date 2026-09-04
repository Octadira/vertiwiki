/**
 * Cloudflare Worker / Cloudflare Snippet for VertiWiki
 * 
 * Intercepts incoming requests. If an AI coding agent or crawler sends
 * 'Accept: text/markdown', rewrites clean documentation URLs to their
 * corresponding '*.md' files, enabling zero-config Content Negotiation.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const acceptHeader = request.headers.get('Accept') || '';
    const isMarkdownRequested = acceptHeader.includes('text/markdown');

    // If the client explicitly requests Markdown
    if (isMarkdownRequested) {
      let path = url.pathname;

      // Handle root directory
      if (path === '' || path === '/') {
        url.pathname = '/index.md';
        return fetch(url.toString(), request);
      }

      // Handle trailing slash directory requests
      if (path.endsWith('/')) {
        url.pathname = `${path}index.md`;
        return fetch(url.toString(), request);
      }

      // Handle extensionless subpaths (exclude static assets & themes)
      if (!path.includes('.') && !path.startsWith('/assets') && !path.startsWith('/themes')) {
        url.pathname = `${path}.md`;
        return fetch(url.toString(), request);
      }
    }

    // Ensure trailing slash on directory-like requests to prevent browser /docs#/ malformation
    if (!url.pathname.endsWith('/') && !url.pathname.includes('.') && !url.pathname.startsWith('/assets') && !url.pathname.startsWith('/themes')) {
      url.pathname = `${url.pathname}/`;
      return Response.redirect(url.toString(), 308);
    }

    // Default: pass through to origin / static assets
    return fetch(request);
  }
};
