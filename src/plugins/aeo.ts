import { VertiWikiConfig } from '../core/types';
import { ParsedMarkdown } from '../core/parser';

export class AEOEngine {
  private config: VertiWikiConfig;

  constructor(config: VertiWikiConfig) {
    this.config = config;
    this.ensureBaseMetaTags();
  }

  private ensureBaseMetaTags(): void {
    if (typeof document === 'undefined') return;

    const isDisabled = this.config.llmsTxtUrl === null || this.config.llmsTxtUrl === '';
    const targetUrl = this.config.llmsTxtUrl || 'llms.txt';

    // 1. Link to LLMs.txt
    let link = document.querySelector<HTMLLinkElement>('link[rel="llms-txt"]');
    if (isDisabled) {
      if (link) link.remove();
    } else {
      if (!link) {
        link = document.createElement('link');
        link.rel = 'llms-txt';
        document.head.appendChild(link);
      }
      link.href = targetUrl;
    }

    // 2. In-Page AI Agent Discovery Directive (AgentDocsSpec llms-txt-directive-html)
    this.ensureAgentDirective(isDisabled, targetUrl);
  }

  private ensureAgentDirective(isDisabled: boolean, targetUrl: string): void {
    if (typeof document === 'undefined') return;

    let directiveEl = document.querySelector<HTMLElement>('.verti-agent-directive');

    if (isDisabled) {
      if (directiveEl) directiveEl.remove();
      return;
    }

    if (!directiveEl) {
      directiveEl = document.createElement('div');
      directiveEl.className = 'verti-agent-directive';
      directiveEl.setAttribute('aria-hidden', 'false');
      directiveEl.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      if (document.body) {
        document.body.insertBefore(directiveEl, document.body.firstChild);
      }
    }

    directiveEl.innerHTML = `<p>For AI coding agents: A complete documentation index is available at <a href="${targetUrl}">${targetUrl}</a>. Raw documentation pages are served as Markdown at corresponding *.md URLs or via Accept: text/markdown.</p>`;
  }

  public updatePageMetadata(filePath: string, parsed: ParsedMarkdown): void {
    const pageTitle = parsed.title ? `${parsed.title} — ${this.config.title}` : this.config.title;
    const description = parsed.description || `${parsed.title} documentation on ${this.config.title}`;
    const fullUrl = window.location.href;

    // 1. Update <meta name="description">
    this.setMetaTag('name', 'description', description);

    // 2. OpenGraph Meta Tags
    this.setMetaTag('property', 'og:title', pageTitle);
    this.setMetaTag('property', 'og:description', description);
    this.setMetaTag('property', 'og:type', 'article');
    this.setMetaTag('property', 'og:url', fullUrl);
    this.setMetaTag('property', 'og:site_name', this.config.title);

    // 3. Twitter Card Tags
    this.setMetaTag('name', 'twitter:card', 'summary');
    this.setMetaTag('name', 'twitter:title', pageTitle);
    this.setMetaTag('name', 'twitter:description', description);

    // 4. Link to Raw Markdown File (for AI Search Engines & LLMs)
    let mdLink = document.querySelector<HTMLLinkElement>('link[rel="alternate"][type="text/markdown"]');
    if (!mdLink) {
      mdLink = document.createElement('link');
      mdLink.rel = 'alternate';
      mdLink.type = 'text/markdown';
      document.head.appendChild(mdLink);
    }
    mdLink.href = filePath;
    mdLink.title = parsed.title;

    // 5. Generate Dynamic JSON-LD (Schema.org) Graph
    this.updateJsonLd(filePath, parsed, description, fullUrl);
  }

  private updateJsonLd(filePath: string, parsed: ParsedMarkdown, description: string, url: string): void {
    let scriptEl = (
      document.getElementById('verti-aeo-jsonld') ||
      document.getElementById('cortex-aeo-jsonld') ||
      document.getElementById('omni-aeo-jsonld')
    ) as HTMLScriptElement;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'verti-aeo-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    // Build BreadcrumbList elements
    const pathParts = filePath.split('/');
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: window.location.origin + window.location.pathname + `#/${this.config.homePage}`
      }
    ];

    let accumPath = '';
    pathParts.forEach((part, index) => {
      accumPath = accumPath ? `${accumPath}/${part}` : part;
      const isLast = index === pathParts.length - 1;
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: index + 2,
        name: isLast ? (parsed.title || part) : part.replace(/[-_]/g, ' '),
        item: window.location.origin + window.location.pathname + `#/${accumPath}`
      });
    });

    // Clean text snippet for AI entity extraction
    const cleanSnippet = parsed.rawBody
      .replace(/[#*`_~[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 800);

    const schemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${window.location.origin}/#website`,
          url: window.location.origin,
          name: this.config.title,
          description: this.config.footerText ? this.config.footerText.replace(/<[^>]*>/g, '') : this.config.title
        },
        {
          '@type': 'TechArticle',
          '@id': `${url}#article`,
          url: url,
          headline: parsed.title,
          description: description,
          articleBody: cleanSnippet,
          inLanguage: 'en',
          isPartOf: { '@id': `${window.location.origin}/#website` },
          author: parsed.author ? { '@type': 'Person', name: parsed.author } : { '@type': 'Organization', name: this.config.title },
          datePublished: parsed.date || new Date().toISOString().split('T')[0],
          keywords: parsed.tags && parsed.tags.length > 0 ? parsed.tags.join(', ') : undefined
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: breadcrumbItems
        }
      ]
    };

    scriptEl.textContent = JSON.stringify(schemaGraph, null, 2);
  }

  private setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string): void {
    let tag = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrValue);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }
}
