import './ui/styles/main.css';
import { loadConfig } from './core/config';
import { Router, RouteInfo, normalizeDirectoryUrl } from './core/router';
import { MarkdownParser } from './core/parser';
import { Pipeline } from './core/pipeline';
import { Layout } from './ui/layout';
import { ThemeManager } from './ui/theme';
import { ThemeChooserDropdown } from './ui/theme-chooser';
import { LanguageChooserDropdown } from './ui/language-chooser';
import { TableOfContents } from './ui/toc';
import { SearchEngine } from './plugins/search';
import { SearchModal } from './ui/search-modal';
import { NavigationItem, LocaleConfig } from './core/types';
import { escapeHtml } from './core/escape';

// Plugins
import { calloutsPlugin } from './plugins/callouts';
import { codeHighlightPlugin } from './plugins/code-highlight';
import { mathPlugin } from './plugins/math';
import { mermaidPlugin } from './plugins/mermaid';
import { mediaPlugin } from './plugins/media';
import { badgePlugin } from './plugins/badge';
import { analytics, analyticsPlugin } from './plugins/analytics';
import { AEOEngine } from './plugins/aeo';
import { tabsPlugin } from './plugins/tabs';
import { detailsPlugin } from './plugins/details';
import { lightboxPlugin } from './plugins/lightbox';
import { navAccordionPlugin } from './plugins/nav-accordion';
import { sitemapPlugin, parseNavigationMarkdown } from './plugins/sitemap';
import { wikilinksPlugin } from './plugins/wikilinks';
import { PrevNextNavigation } from './ui/prev-next';
import { resolveFavicon, applyFavicon } from './core/favicon';

async function bootstrap() {
  // Normalize URL if opened without trailing slash on a directory path (e.g. /docs#/ -> /docs/#/)
  if (typeof window !== 'undefined' && window.location && window.location.pathname) {
    const rawPath = window.location.pathname;
    const normalized = normalizeDirectoryUrl(rawPath, window.location.search, window.location.hash);
    if (normalized !== `${rawPath}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(null, '', `${window.location.origin}${normalized}`);
    }
  }

  const config = await loadConfig();

  const faviconUrl = await resolveFavicon(config);
  applyFavicon(faviconUrl);

  const themeManager = new ThemeManager(
    config.defaultTheme,
    config.themePreset,
    config.resolvedThemes || [],
    config.enableThemeChooser !== false
  );
  const layout = new Layout(config);
  const parser = new MarkdownParser();
  const pipeline = new Pipeline();
  const searchEngine = new SearchEngine();
  const aeoEngine = new AEOEngine(config);

  let currentRawMarkdown = '';
  let currentParsedTitle = '';
  let currentParsedDesc = '';

  // Setup AI / LLM Context Copy Action
  layout.setupAICopyButton(() => {
    const url = window.location.href;
    return `---
Title: ${currentParsedTitle || document.title}
Source URL: ${url}
Description: ${currentParsedDesc || ''}
---

${currentRawMarkdown}`;
  });

  // Register Built-in Plugins
  pipeline.registerPlugin(calloutsPlugin);
  pipeline.registerPlugin(codeHighlightPlugin);
  pipeline.registerPlugin(mathPlugin);
  pipeline.registerPlugin(mermaidPlugin);
  pipeline.registerPlugin(mediaPlugin);
  pipeline.registerPlugin(badgePlugin);
  pipeline.registerPlugin(analyticsPlugin);
  pipeline.registerPlugin(tabsPlugin);
  pipeline.registerPlugin(detailsPlugin);
  pipeline.registerPlugin(lightboxPlugin);
  pipeline.registerPlugin(navAccordionPlugin);
  pipeline.registerPlugin(sitemapPlugin);
  pipeline.registerPlugin(wikilinksPlugin);

  // Setup Previous / Next Page Navigation
  const prevNextNav = new PrevNextNavigation(layout.contentArticle.parentElement!);

  // Initialize Analytics (if configured in config.json)
  analytics.init(config);

  // Initialize Router
  const router = new Router(config.homePage, loadPage, config.locales || []);

  // Setup Theme Palette Dropdown Chooser
  if (config.enableThemeChooser !== false) {
    const headerRight = document.querySelector<HTMLElement>('.verti-header-right');
    if (headerRight) {
      new ThemeChooserDropdown(headerRight, themeManager);
    }
  }

  // Setup Language Chooser Dropdown
  let langDropdown: LanguageChooserDropdown | null = null;
  if (config.enableLanguageChooser !== false && config.locales && config.locales.length > 1) {
    const headerRight = document.querySelector<HTMLElement>('.verti-header-right');
    if (headerRight) {
      langDropdown = new LanguageChooserDropdown(headerRight, router, config.locales);
    }
  }

  // Setup Theme Toggle Button (Light/Dark mode)
  const themeToggleBtn = document.querySelector('.verti-theme-toggle');
  themeToggleBtn?.addEventListener('click', () => {
    themeManager.toggleMode();
  });

  // Setup Search Modal
  let searchModal: SearchModal | null = null;
  if (config.enableSearch) {
    searchModal = new SearchModal(
      (query) => {
        const currentLocale = router.getCurrentLocale();
        return searchEngine.search(query, currentLocale?.code);
      },
      (selected) => {
        router.navigate(selected.path);
      }
    );

    const searchBtns = document.querySelectorAll('.verti-search-btn, .verti-mobile-search-btn');
    searchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        searchModal?.open();
      });
    });
  }

  // Setup Table of Contents
  const toc = new TableOfContents(layout.tocContainer, (anchor) => {
    router.scrollToAnchor(anchor);
  });

  // Dynamic Navigation Loader per Locale
  let currentLoadedLocaleKey: string | null = null;
  let navigationItems: NavigationItem[] = [];

  async function loadNavigationForLocale(locale: LocaleConfig | null, currentActivePath?: string): Promise<void> {
    const localeKey = locale ? locale.code : 'default';
    if (currentLoadedLocaleKey === localeKey && navigationItems.length > 0) {
      return;
    }

    currentLoadedLocaleKey = localeKey;
    const navDir = config.navigationFile.includes('/')
      ? config.navigationFile.substring(0, config.navigationFile.lastIndexOf('/'))
      : '';
    const navFileName = config.navigationFile.includes('/')
      ? config.navigationFile.substring(config.navigationFile.lastIndexOf('/') + 1)
      : config.navigationFile;

    let navFile = config.navigationFile;
    if (locale && locale.prefix && !locale.isDefault) {
      if (locale.prefix.startsWith(`${navDir}/`)) {
        navFile = `${locale.prefix}/${navFileName}`;
      } else if (navDir) {
        navFile = `${navDir}/${locale.prefix}/${navFileName}`;
      } else {
        navFile = `${locale.prefix}/${navFileName}`;
      }
    }

    try {
      let navResponse = await fetch(navFile);
      if (!navResponse.ok && navFile !== config.navigationFile) {
        // Fallback to default navigation file if localized one doesn't exist
        navResponse = await fetch(config.navigationFile);
        navFile = config.navigationFile;
      }

      if (navResponse.ok) {
        const navRaw = await navResponse.text();
        navigationItems = parseNavigationMarkdown(navRaw, navFile);

        const homeDir = config.homePage.includes('/')
          ? config.homePage.substring(0, config.homePage.lastIndexOf('/'))
          : '';
        const homeFileName = config.homePage.includes('/')
          ? config.homePage.substring(config.homePage.lastIndexOf('/') + 1)
          : config.homePage;

        const defaultLocalizedTarget = locale && locale.prefix && !locale.isDefault
          ? (locale.prefix.startsWith(`${homeDir}/`)
              ? `${locale.prefix}/${homeFileName}`
              : (homeDir ? `${homeDir}/${locale.prefix}/${homeFileName}` : `${locale.prefix}/${homeFileName}`))
          : config.homePage;

        const activeTarget = currentActivePath || defaultLocalizedTarget;
        layout.renderNavigation(navigationItems, activeTarget);

        // Index localized pages in background for instant search
        if (config.enableSearch) {
          searchEngine.indexNavTree(navigationItems, locale?.code);
        }
      }
    } catch (err) {
      console.info(`No navigation file found at ${navFile}:`, err);
    }
  }

  async function fetchMarkdownResource(targetPath: string): Promise<{ text: string; path: string } | null> {
    try {
      const response = await fetch(targetPath);
      if (!response.ok) return null;
      const text = await response.text();
      const isHtml = text.trim().toLowerCase().startsWith('<!doctype') ||
                     text.trim().toLowerCase().startsWith('<html') ||
                     text.trim().toLowerCase().startsWith('<!html');
      if (isHtml) return null;
      return { text, path: targetPath };
    } catch {
      return null;
    }
  }

  // Main Page Loader
  async function loadPage(route: RouteInfo): Promise<void> {
    let filePath = route.filePath;
    const activeLocale = route.locale || router.getCurrentLocale(filePath);

    // Ensure navigation matches the active locale and current active path
    await loadNavigationForLocale(activeLocale, filePath);
    if (langDropdown) {
      langDropdown.renderMenu();
    }
    if (activeLocale?.code) {
      document.documentElement.lang = activeLocale.code;
    }

    try {
      let fetched = await fetchMarkdownResource(filePath);

      // Smart directory index and sibling markdown fallback resolution
      if (!fetched) {
        if (filePath.endsWith('/index.md')) {
          fetched = await fetchMarkdownResource(filePath.replace(/\/index\.md$/, '.md'));
        } else if (filePath.endsWith('.md')) {
          fetched = await fetchMarkdownResource(filePath.replace(/\.md$/, '/index.md'));
        }
      }

      if (!fetched) {
        throw new Error(`Failed to load ${filePath}`);
      }

      filePath = fetched.path;
      route.filePath = fetched.path;
      let rawMarkdown = fetched.text;

      layout.updateActiveNavLink(filePath);

      // Plugin hook: beforeParse
      const pluginContext = {
        filePath,
        config,
        container: layout.contentArticle
      };

      rawMarkdown = await pipeline.runBeforeParse(rawMarkdown, pluginContext);

      // Parse markdown to HTML
      const parsed = parser.parse(rawMarkdown);

      // Support per-page theme preset in frontmatter (e.g. theme: terracotta)
      if (parsed.frontmatter && parsed.frontmatter.theme) {
        themeManager.setPreset(parsed.frontmatter.theme);
      }

      currentRawMarkdown = rawMarkdown;
      currentParsedTitle = parsed.title;
      currentParsedDesc = parsed.description;

      // Update Page Title & AEO Semantic Metadata (JSON-LD Schema.org + Meta Tags)
      document.title = parsed.title ? `${parsed.title} — ${config.title}` : config.title;
      aeoEngine.updatePageMetadata(filePath, parsed);

      // Plugin hook: afterParse
      let finalHtml = await pipeline.runAfterParse(parsed.html, pluginContext);

      // Set content in article
      layout.contentArticle.innerHTML = finalHtml;

      // Update Breadcrumbs navigation
      layout.updateBreadcrumbs(filePath, parsed.title);

      // Transform relative markdown links and images to resolved paths
      router.transformLinks(layout.contentArticle, filePath);

      // Plugin hook: afterRender
      await pipeline.runAfterRender(pluginContext);

      // Update Table of Contents
      if (config.useTableOfContents) {
        toc.update(layout.contentArticle);
      }

      // Update Previous / Next Article Navigation
      prevNextNav.update(navigationItems, filePath);

      // Add current page to search index
      searchEngine.addDocument({
        id: filePath,
        title: parsed.title,
        path: filePath,
        content: rawMarkdown.replace(/[#*`_~[\]()]/g, ' '),
        locale: activeLocale?.code
      });

    } catch (err) {
      console.warn(`Could not load ${filePath}:`, err);

      const isFileProtocol = window.location.protocol === 'file:';
      if (isFileProtocol) {
        layout.contentArticle.innerHTML = `
          <div class="verti-callout caution" style="margin-top: 2rem;">
            <div class="verti-callout-title">⚠️ Local Browser Security Restriction (file:// protocol)</div>
            <p>Modern web browsers (Chrome, Safari, Edge, Firefox) block JavaScript <code>fetch()</code> requests when opening HTML files directly via the <code>file:///</code> protocol due to local CORS security sandbox policies.</p>
            <p style="margin-top: 0.75rem;"><strong>To view your wiki locally or offline (e.g. from a USB drive or local folder):</strong></p>
            <ol style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.75rem; line-height: 1.7;">
              <li>Run a lightweight zero-install static server in this folder:
                <pre style="background: rgba(0,0,0,0.3); padding: 0.5rem 0.75rem; border-radius: 4px; margin: 0.4rem 0; font-family: var(--font-mono, monospace);"><code>python3 -m http.server 8080</code></pre>
                or
                <pre style="background: rgba(0,0,0,0.3); padding: 0.5rem 0.75rem; border-radius: 4px; margin: 0.4rem 0; font-family: var(--font-mono, monospace);"><code>npx serve .</code></pre>
              </li>
              <li>Open <a href="http://localhost:8080" style="color: var(--primary, #00eefc); text-decoration: underline;">http://localhost:8080</a> (or your server URL) in your browser.</li>
            </ol>
            <p style="font-size: 0.85rem; color: var(--muted-foreground, #a1a1aa);">Alternatively, launch Chrome from terminal with <code>--allow-file-access-from-files</code> enabled.</p>
          </div>
        `;
        layout.updateBreadcrumbs(filePath, 'Local Security Notice');
        document.title = `Local Security Notice — ${config.title}`;
        return;
      }

      // Try 404.md fallback
      try {
        const notFoundRes = await fetch('404.md');
        if (notFoundRes.ok) {
          const notFoundMd = await notFoundRes.text();
          const notFoundIsHtml = notFoundMd.trim().toLowerCase().startsWith('<!doctype') ||
                                 notFoundMd.trim().toLowerCase().startsWith('<html');
          if (!notFoundIsHtml) {
            const parsed = parser.parse(notFoundMd);
            layout.contentArticle.innerHTML = parsed.html;
            layout.updateBreadcrumbs('404.md', parsed.title || 'Page Not Found');
            router.transformLinks(layout.contentArticle);
            document.title = `404 Not Found — ${config.title}`;
            return;
          }
        }
      } catch {
        // Fallback default 404
      }

      layout.contentArticle.innerHTML = `
        <div class="verti-callout caution" style="margin-top: 2rem;">
          <div class="verti-callout-title">Page Not Found (404)</div>
          <p>Could not locate the requested markdown file: <code>${escapeHtml(filePath)}</code>.</p>
          <p><a href="#/${config.homePage}">Return to Home &rarr;</a></p>
        </div>
      `;
      layout.updateBreadcrumbs(filePath, '404 Not Found');
      document.title = `404 Not Found — ${config.title}`;
      aeoEngine.updatePageMetadata(filePath, {
        title: '404 Not Found',
        description: 'The requested page could not be found.',
        html: '',
        frontmatter: {},
        rawBody: ''
      });
    }
  }

  router.init();
}

// Start VertiWiki
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(err => {
      console.error('Failed to bootstrap VertiWiki:', err);
    });
  });
} else {
  bootstrap().catch(err => {
    console.error('Failed to bootstrap VertiWiki:', err);
  });
}
