import './ui/styles/main.css';
import { loadConfig } from './core/config';
import { Router, RouteInfo } from './core/router';
import { MarkdownParser } from './core/parser';
import { Pipeline } from './core/pipeline';
import { Layout } from './ui/layout';
import { ThemeManager } from './ui/theme';
import { ThemeChooserDropdown } from './ui/theme-chooser';
import { TableOfContents } from './ui/toc';
import { SearchEngine } from './plugins/search';
import { SearchModal } from './ui/search-modal';
import { NavigationItem } from './core/types';

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

async function parseNavigation(navMarkdown: string): Promise<NavigationItem[]> {
  const items: NavigationItem[] = [];
  const lines = navMarkdown.split(/\r?\n/);

  let currentHeader = '';
  let currentGroup: NavigationItem | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Header line (e.g. # Documentation or ## Guides)
    const headerMatch = trimmed.match(/^#{1,3}\s+(.+)$/);
    if (headerMatch) {
      currentHeader = headerMatch[1].trim();
      currentGroup = {
        title: currentHeader,
        href: '',
        children: []
      };
      items.push(currentGroup);
      continue;
    }

    // Markdown link: * [Title](path.md) or - [Title](path.md)
    const linkMatch = trimmed.match(/^[-*]\s+\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const title = linkMatch[1].trim();
      const href = linkMatch[2].trim();
      const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');

      const navItem: NavigationItem = {
        title,
        href,
        isExternal
      };

      if (currentGroup && currentGroup.children) {
        currentGroup.children.push(navItem);
      } else {
        items.push(navItem);
      }
    }
  }

  return items;
}

async function bootstrap() {
  const config = await loadConfig();

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

  // Setup Theme Palette Dropdown Chooser
  if (config.enableThemeChooser !== false) {
    const headerRight = document.querySelector<HTMLElement>('.verti-header-right, .cortex-header-right, .omni-header-right');
    if (headerRight) {
      new ThemeChooserDropdown(headerRight, themeManager);
    }
  }

  // Setup Theme Toggle Button (Light/Dark mode)
  const themeToggleBtn = document.querySelector('.verti-theme-toggle, .cortex-theme-toggle, .omni-theme-toggle');
  themeToggleBtn?.addEventListener('click', () => {
    themeManager.toggleMode();
  });

  // Setup Search Modal
  let searchModal: SearchModal | null = null;
  if (config.enableSearch) {
    searchModal = new SearchModal(
      (query) => searchEngine.search(query),
      (selected) => {
        router.navigate(selected.path);
      }
    );

    const searchBtns = document.querySelectorAll('.verti-search-btn, .cortex-search-btn, .omni-search-btn, .verti-mobile-search-btn, .cortex-mobile-search-btn, .omni-mobile-search-btn');
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

  // Load and Parse navigation.md
  let navigationItems: NavigationItem[] = [];
  try {
    const navResponse = await fetch(config.navigationFile);
    if (navResponse.ok) {
      const navRaw = await navResponse.text();
      navigationItems = await parseNavigation(navRaw);
      layout.renderNavigation(navigationItems, config.homePage);
      
      // Index all pages in background for instant search
      if (config.enableSearch) {
        searchEngine.indexNavTree(navigationItems);
      }
    }
  } catch (err) {
    console.info('No navigation.md found or failed to load:', err);
  }

  // Main Page Loader
  async function loadPage(route: RouteInfo): Promise<void> {
    let filePath = route.filePath;

    try {
      let response = await fetch(filePath);
      let rawMarkdown = await response.text();
      let isHtmlResponse = rawMarkdown.trim().toLowerCase().startsWith('<!doctype') || 
                             rawMarkdown.trim().toLowerCase().startsWith('<html') ||
                             rawMarkdown.trim().toLowerCase().startsWith('<!html');

      // Smart directory index and sibling markdown fallback resolution
      if (!response.ok || isHtmlResponse) {
        if (filePath.endsWith('/index.md')) {
          // If dir/index.md failed, attempt fallback to dir.md
          const siblingMd = filePath.replace(/\/index\.md$/, '.md');
          try {
            const siblingRes = await fetch(siblingMd);
            if (siblingRes.ok) {
              const siblingText = await siblingRes.text();
              const siblingIsHtml = siblingText.trim().toLowerCase().startsWith('<!doctype') ||
                                    siblingText.trim().toLowerCase().startsWith('<html');
              if (!siblingIsHtml) {
                response = siblingRes;
                rawMarkdown = siblingText;
                isHtmlResponse = false;
                filePath = siblingMd;
                route.filePath = siblingMd;
              }
            }
          } catch {
            // Ignore fallback error
          }
        } else if (filePath.endsWith('.md') && !filePath.endsWith('/index.md')) {
          // If dir.md failed, attempt fallback to dir/index.md
          const dirIndexMd = filePath.replace(/\.md$/, '/index.md');
          try {
            const dirRes = await fetch(dirIndexMd);
            if (dirRes.ok) {
              const dirText = await dirRes.text();
              const dirIsHtml = dirText.trim().toLowerCase().startsWith('<!doctype') ||
                                dirText.trim().toLowerCase().startsWith('<html');
              if (!dirIsHtml) {
                response = dirRes;
                rawMarkdown = dirText;
                isHtmlResponse = false;
                filePath = dirIndexMd;
                route.filePath = dirIndexMd;
              }
            }
          } catch {
            // Ignore fallback error
          }
        }
      }

      if (!response.ok || ((filePath.endsWith('.md') || filePath.endsWith('.markdown')) && isHtmlResponse)) {
        throw new Error(`HTTP ${response.status}: Failed to load ${filePath}`);
      }

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
        content: rawMarkdown.replace(/[#*`_~[\]()]/g, ' ')
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
          <p>Could not locate the requested markdown file: <code>${filePath}</code>.</p>
          <p><a href="#/${config.homePage}">Return to Home &rarr;</a></p>
        </div>
      `;
      layout.updateBreadcrumbs(filePath, '404 Not Found');
      document.title = `404 Not Found — ${config.title}`;
    }
  }

  // Initialize Router
  const router = new Router(config.homePage, loadPage);
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
