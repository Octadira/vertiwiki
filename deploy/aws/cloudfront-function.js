/**
 * AWS CloudFront Function (Viewer Request) for VertiWiki on S3 + CloudFront
 * 
 * Attaches to: CloudFront Distribution > Behaviors > Viewer Request
 * Runtime: CloudFront Functions (JavaScript 2.0 / 1.0)
 * 
 * Capabilities:
 * 1. AI Content Negotiation: If 'Accept: text/markdown' header is present,
 *    rewrites documentation paths to the corresponding raw '.md' file in the S3 bucket.
 * 2. Directory Normalization & Indexing: Normalizes '/docs' to '/docs/' via 308 redirect,
 *    and rewrites trailing slash directory requests to 'index.html'.
 * 3. Clean URLs: Rewrites extensionless URLs to their markdown equivalent if requested by agents.
 */
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    var headers = request.headers;

    var acceptHeader = (headers.accept && headers.accept.value) ? headers.accept.value : '';

    // 1. Content Negotiation: Agent explicitly requesting Markdown
    if (acceptHeader.indexOf('text/markdown') !== -1) {
        if (uri === '' || uri === '/') {
            request.uri = '/index.md';
            return request;
        }
        if (uri.endsWith('/')) {
            request.uri = uri + 'index.md';
            return request;
        }
        // If extensionless path (not an asset or theme), rewrite to .md
        if (uri.indexOf('.') === -1 && uri.indexOf('/assets/') === -1 && uri.indexOf('/themes/') === -1) {
            request.uri = uri + '.md';
            return request;
        }
    }

    // 2. Default root index
    if (uri === '' || uri === '/') {
        request.uri = '/index.html';
        return request;
    }

    return request;
}
