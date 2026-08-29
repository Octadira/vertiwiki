import { VertiWikiConfig } from '../core/types';
import { VertiWikiPlugin } from '../core/pipeline';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    plausible?: (event: string, options?: any) => void;
    _paq?: any[];
  }
}

class UniversalAnalyticsManager {
  private initialized = false;
  private gaId: string | null = null;
  private gtmId: string | null = null;
  private plausibleDomain: string | null = null;
  private cloudflareToken: string | null = null;
  private umamiWebsiteId: string | null = null;
  private umamiScriptUrl: string | null = null;
  private matomoUrl: string | null = null;
  private matomoSiteId: string | null = null;

  public init(config: VertiWikiConfig): void {
    if (this.initialized) return;

    this.gaId = config.googleAnalyticsId?.trim() || null;
    this.gtmId = config.gtmId?.trim() || null;
    this.plausibleDomain = config.plausibleDomain?.trim() || null;
    this.cloudflareToken = config.cloudflareToken?.trim() || null;
    this.umamiWebsiteId = config.umamiWebsiteId?.trim() || null;
    this.umamiScriptUrl = config.umamiScriptUrl?.trim() || 'https://cloud.umami.is/script.js';
    this.matomoUrl = config.matomoUrl?.trim() || null;
    this.matomoSiteId = config.matomoSiteId?.trim() || null;

    // 1. Google Analytics 4 (GA4)
    if (this.gaId) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(this.gaId)}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer?.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', this.gaId, {
        send_page_view: false // Managed manually for SPA hash routes
      });
    }

    // 2. Google Tag Manager (GTM)
    if (this.gtmId) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(this.gtmId)}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
    }

    // 3. Plausible Analytics (Privacy-Friendly)
    if (this.plausibleDomain) {
      const script = document.createElement('script');
      script.defer = true;
      script.setAttribute('data-domain', this.plausibleDomain);
      script.src = 'https://plausible.io/js/script.hash.js';
      document.head.appendChild(script);
    }

    // 4. Cloudflare Web Analytics
    if (this.cloudflareToken) {
      const script = document.createElement('script');
      script.defer = true;
      script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      script.setAttribute('data-cf-beacon', JSON.stringify({ token: this.cloudflareToken }));
      document.head.appendChild(script);
    }

    // 5. Umami Analytics (Modern Self-Hosted / Cloud Analytics)
    if (this.umamiWebsiteId) {
      const script = document.createElement('script');
      script.defer = true;
      script.src = this.umamiScriptUrl;
      script.setAttribute('data-website-id', this.umamiWebsiteId);
      document.head.appendChild(script);
    }

    // 6. Matomo Analytics
    if (this.matomoUrl && this.matomoSiteId) {
      window._paq = window._paq || [];
      window._paq.push(['trackPageView']);
      window._paq.push(['enableLinkTracking']);

      const u = this.matomoUrl.endsWith('/') ? this.matomoUrl : `${this.matomoUrl}/`;
      window._paq.push(['setTrackerUrl', `${u}matomo.php`]);
      window._paq.push(['setSiteId', this.matomoSiteId]);

      const script = document.createElement('script');
      script.async = true;
      script.src = `${u}matomo.js`;
      document.head.appendChild(script);
    }

    this.initialized = true;
  }

  public trackPageView(filePath: string, pageTitle: string): void {
    if (!this.initialized) return;

    const pagePath = `#!${filePath}`;
    const pageUrl = window.location.href;

    // GA4
    if (this.gaId && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: pageUrl,
        page_path: pagePath
      });
    }

    // GTM
    if (this.gtmId && window.dataLayer) {
      window.dataLayer.push({
        event: 'vertiwiki_pageview',
        page_title: pageTitle,
        page_location: pageUrl,
        page_path: pagePath
      });
    }

    // Plausible
    if (this.plausibleDomain && typeof window.plausible === 'function') {
      window.plausible('pageview', { u: pageUrl });
    }

    // Matomo
    if (this.matomoUrl && window._paq) {
      window._paq.push(['setCustomUrl', pageUrl]);
      window._paq.push(['setDocumentTitle', pageTitle]);
      window._paq.push(['trackPageView']);
    }
  }
}

export const analytics = new UniversalAnalyticsManager();

export const analyticsPlugin: VertiWikiPlugin = {
  name: 'analytics',
  afterRender: (context) => {
    analytics.trackPageView(context.filePath, document.title);
  }
};
