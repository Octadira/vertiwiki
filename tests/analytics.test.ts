import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { analytics, analyticsPlugin } from '../src/plugins/analytics';
import { DEFAULT_CONFIG } from '../src/core/config';
import { PluginContext } from '../src/core/pipeline';

describe('analyticsPlugin & UniversalAnalyticsManager', () => {
  let createdScripts: any[] = [];
  let originalDocument: any;
  let originalWindow: any;

  beforeEach(() => {
    createdScripts = [];
    originalDocument = (global as any).document;
    originalWindow = (global as any).window;

    const mockDocument: any = {
      head: {
        appendChild: (child: any) => {
          createdScripts.push(child);
        }
      },
      title: 'Sample Page',
      createElement: (tag: string) => ({
        tagName: tag.toUpperCase(),
        src: '',
        async: false,
        defer: false,
        setAttribute: vi.fn(),
        attributes: {}
      })
    };

    (global as any).document = mockDocument;
    (global as any).window = {
      location: { href: 'http://localhost/#/test.md' }
    };
  });

  afterEach(() => {
    (global as any).document = originalDocument;
    (global as any).window = originalWindow;
    (analytics as any).initialized = false;
  });

  it('injects Google Analytics 4 (GA4) script and initializes gtag dataLayer', () => {
    analytics.init({
      ...DEFAULT_CONFIG,
      googleAnalyticsId: 'G-XXXXXXXXXX'
    });

    expect(createdScripts.length).toBe(1);
    expect(createdScripts[0].src).toContain('id=G-XXXXXXXXXX');
    expect((global as any).window.dataLayer).toBeDefined();
    expect(typeof (global as any).window.gtag).toBe('function');
  });

  it('injects Plausible script with data-domain', () => {
    analytics.init({
      ...DEFAULT_CONFIG,
      plausibleDomain: 'docs.verti.wiki'
    });

    expect(createdScripts.length).toBe(1);
    expect(createdScripts[0].src).toContain('plausible.io/js/script.hash.js');
    expect(createdScripts[0].setAttribute).toHaveBeenCalledWith('data-domain', 'docs.verti.wiki');
  });

  it('injects Umami analytics script with data-website-id', () => {
    analytics.init({
      ...DEFAULT_CONFIG,
      umamiWebsiteId: '12345-67890'
    });

    expect(createdScripts.length).toBe(1);
    expect(createdScripts[0].src).toBe('https://cloud.umami.is/script.js');
    expect(createdScripts[0].setAttribute).toHaveBeenCalledWith('data-website-id', '12345-67890');
  });

  it('triggers pageview tracking on route changes via afterRender hook', () => {
    const trackSpy = vi.spyOn(analytics, 'trackPageView').mockImplementation(() => {});

    const context: PluginContext = {
      filePath: 'docs/guide.md',
      rawMarkdown: '',
      config: { ...DEFAULT_CONFIG },
      container: {} as any
    };

    analyticsPlugin.afterRender!(context);
    expect(trackSpy).toHaveBeenCalledWith('docs/guide.md', 'Sample Page');
  });
});
