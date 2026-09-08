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
    const isHtmlRequested = acceptHeader.includes('text/html');

    // 1. If the client explicitly requests Markdown (AI Agents, Crawlers, Curl)
    if (isMarkdownRequested) {
      let path = url.pathname;

      // Handle root directory
      if (path === '' || path === '/') {
        url.pathname = '/index.md';
        return fetch(url.toString(), request);
      }

      // Handle documentation hub directory without trailing slash
      if (path === '/docs') {
        url.pathname = '/docs/index.md';
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

    // 2. If client is a human browser requesting HTML, route into VertiWiki viewer
    if (isHtmlRequested) {
      const path = url.pathname;
      if (path.endsWith('.md')) {
        if (path.startsWith('/docs/')) {
          const docRel = path.replace(/^\/docs\//, '');
          return Response.redirect(`${url.origin}/docs/#/${docRel}`, 302);
        }
        return Response.redirect(`${url.origin}/#/${path.replace(/^\//, '')}`, 302);
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
