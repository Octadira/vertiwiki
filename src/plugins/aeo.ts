import { VertiWikiConfig } from '../core/types';
import { ParsedMarkdown } from '../core/parser';

export class AEOEngine {
  private config: VertiWikiConfig;

  constructor(config: VertiWikiConfig) {
    this.config = config;
    this.ensureBaseMetaTags();
  }

  private ensureBaseMetaTags(): void {
    // 1. Link to LLMs.txt if not present
    if (!document.querySelector('link[rel="llms-txt"]')) {
      const link = document.createElement('link');
      link.rel = 'llms-txt';
      link.href = 'llms.txt';
      document.head.appendChild(link);
    }
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
