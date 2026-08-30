import { VertiWikiConfig, NavigationItem } from '../core/types';

export class Layout {
  private config: VertiWikiConfig;
  public appContainer: HTMLElement;
  public contentArticle: HTMLElement;
  public tocContainer: HTMLElement;
  public sidebarNavContainer: HTMLElement;
  private sidebarEl: HTMLElement;
  private backdropEl: HTMLElement;

  constructor(config: VertiWikiConfig) {
    this.config = config;

    this.appContainer = document.getElementById('verti-app') || document.getElementById('cortex-app') || document.getElementById('omni-app') || document.body;

    const brandMode = this.config.brandDisplay || 'both';
    const showLogo = (brandMode === 'both' || brandMode === 'logo') && Boolean(this.config.logo);
    const showTitle = (brandMode === 'both' || brandMode === 'title' || !showLogo) && Boolean(this.config.title);

    this.appContainer.innerHTML = `
      <header class="verti-header cortex-header">
        <div class="verti-header-left cortex-header-left">
          <button class="verti-icon-btn verti-menu-toggle cortex-icon-btn cortex-menu-toggle" aria-label="Toggle navigation menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <a href="#/${this.config.homePage}" class="verti-brand cortex-brand">
            ${showLogo ? `<img src="${this.config.logo}" class="verti-brand-logo cortex-brand-logo" alt="${this.config.title}" />` : ''}
            ${showTitle ? `<span>${this.config.title}</span>` : ''}
          </a>
        </div>

        <div class="verti-header-center cortex-header-center">
          ${this.config.enableSearch ? `
            <button class="verti-search-btn cortex-search-btn" aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Search docs...</span>
              <kbd>⌘K</kbd>
            </button>
          ` : ''}
        </div>

        <div class="verti-header-right cortex-header-right">
          ${this.config.enableSearch ? `
            <button class="verti-icon-btn verti-mobile-search-btn cortex-icon-btn cortex-mobile-search-btn" aria-label="Search docs" title="Search (⌘K)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          ` : ''}
          ${this.config.githubUrl ? `
            <a href="${this.config.githubUrl}" target="_blank" rel="noopener noreferrer" class="verti-icon-btn cortex-icon-btn" title="GitHub Repository">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          ` : ''}
          <button class="verti-icon-btn verti-theme-toggle cortex-icon-btn cortex-theme-toggle" title="Toggle Theme" aria-label="Toggle Theme">
            <svg class="theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
        </div>
      </header>

      <div class="verti-sidebar-backdrop cortex-sidebar-backdrop"></div>

      <div class="verti-main-container cortex-main-container">
        <aside class="verti-sidebar cortex-sidebar">
          <div class="verti-sidebar-mobile-header cortex-sidebar-mobile-header">
            <span class="verti-sidebar-mobile-title cortex-sidebar-mobile-title">Menu</span>
            <button class="verti-icon-btn verti-sidebar-close-btn cortex-icon-btn cortex-sidebar-close-btn" aria-label="Close menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <nav class="verti-sidebar-nav cortex-sidebar-nav"></nav>
        </aside>

        <main class="verti-content-wrapper cortex-content-wrapper">
          <div class="verti-article-container cortex-article-container">
            <div class="verti-article-topbar cortex-article-topbar">
              <nav class="verti-breadcrumbs cortex-breadcrumbs" id="verti-breadcrumbs" aria-label="Breadcrumb"></nav>
              <div class="verti-article-actions cortex-article-actions">
                <button class="verti-ai-copy-btn cortex-ai-copy-btn" id="verti-ai-copy-btn" title="Copy Markdown with metadata for ChatGPT / Claude / Perplexity" aria-label="Copy for AI">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                    <path d="M12 4v4"></path>
                    <path d="M9 14h.01"></path>
                    <path d="M15 14h.01"></path>
                  </svg>
                  <span>Copy for AI</span>
                </button>
              </div>
            </div>
            <article class="verti-article cortex-article" id="verti-content"></article>
          </div>
        </main>

        <aside class="verti-toc-sidebar cortex-toc-sidebar" id="verti-toc"></aside>
      </div>

      <footer class="verti-footer cortex-footer">
        <div>${this.config.footerText || ''}</div>
      </footer>
    `;

    this.contentArticle = (document.getElementById('verti-content') || document.getElementById('cortex-content') || document.getElementById('omni-content'))!;
    this.tocContainer = (document.getElementById('verti-toc') || document.getElementById('cortex-toc') || document.getElementById('omni-toc'))!;
    this.sidebarNavContainer = (this.appContainer.querySelector('.verti-sidebar-nav') || this.appContainer.querySelector('.cortex-sidebar-nav') || this.appContainer.querySelector('.omni-sidebar-nav')) as HTMLElement;
    this.sidebarEl = (this.appContainer.querySelector('.verti-sidebar') || this.appContainer.querySelector('.cortex-sidebar') || this.appContainer.querySelector('.omni-sidebar')) as HTMLElement;
    this.backdropEl = (this.appContainer.querySelector('.verti-sidebar-backdrop') || this.appContainer.querySelector('.cortex-sidebar-backdrop') || this.appContainer.querySelector('.omni-sidebar-backdrop')) as HTMLElement;

    this.setupMobileMenu();
    this.setupNavigationEvents();
  }

  private setupNavigationEvents(): void {
    this.sidebarNavContainer.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Handle accordion toggle clicks
      const toggleBtn = target.closest<HTMLButtonElement>('.verti-nav-accordion-toggle, .cortex-nav-accordion-toggle, .omni-nav-accordion-toggle');
      if (toggleBtn) {
        e.preventDefault();
        e.stopPropagation();
        const parentAccordion = toggleBtn.closest('.verti-nav-accordion, .cortex-nav-accordion, .omni-nav-accordion');
        if (parentAccordion) {
          const isCurrentlyExpanded = parentAccordion.classList.contains('expanded');
          parentAccordion.classList.toggle('expanded', !isCurrentlyExpanded);
          toggleBtn.setAttribute('aria-expanded', isCurrentlyExpanded ? 'false' : 'true');
        }
        return;
      }

      // Handle nav link clicks (close mobile drawer)
      const link = target.closest<HTMLAnchorElement>('.verti-nav-link, .cortex-nav-link, .omni-nav-link');
      if (link) {
        this.sidebarEl.classList.remove('open');
        this.backdropEl.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

  public updateBreadcrumbs(filePath: string, pageTitle: string): void {
    const breadcrumbEl = document.getElementById('verti-breadcrumbs') || document.getElementById('cortex-breadcrumbs') || document.getElementById('omni-breadcrumbs');
    if (!breadcrumbEl) return;

    if (filePath === this.config.homePage || !filePath.includes('/')) {
      breadcrumbEl.style.display = 'none';
      return;
    }

    breadcrumbEl.style.display = 'flex';
    const parts = filePath.split('/');
    const breadcrumbItems = [
      `<a href="#/${this.config.homePage}">Home</a>`
    ];

    let currentAccPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      currentAccPath += (i > 0 ? '/' : '') + part;
      const formattedTitle = part
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      breadcrumbItems.push(`<span>${formattedTitle}</span>`);
    }

    breadcrumbItems.push(`<span class="current">${pageTitle}</span>`);
    breadcrumbEl.innerHTML = breadcrumbItems.join('<span class="verti-breadcrumb-separator cortex-breadcrumb-separator omni-breadcrumb-separator">/</span>');
  }

  public setupAICopyButton(getMarkdownContext: () => string): void {
    const btn = document.getElementById('verti-ai-copy-btn') || document.getElementById('cortex-ai-copy-btn') || document.getElementById('omni-ai-copy-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const content = getMarkdownContext();
      try {
        await navigator.clipboard.writeText(content);
        const span = btn.querySelector('span');
        if (span) {
          const orig = span.textContent;
          span.textContent = '✓ Copied for AI!';
          btn.classList.add('copied');
          setTimeout(() => {
            span.textContent = orig;
            btn.classList.remove('copied');
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to copy for AI', err);
      }
    });
  }

  private setupMobileMenu(): void {
    const menuToggle = this.appContainer.querySelector('.verti-menu-toggle, .cortex-menu-toggle, .omni-menu-toggle');
    const closeBtn = this.appContainer.querySelector('.verti-sidebar-close-btn, .cortex-sidebar-close-btn, .omni-sidebar-close-btn');

    const openMenu = () => {
      this.sidebarEl.classList.add('open');
      this.backdropEl.classList.add('show');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      this.sidebarEl.classList.remove('open');
      this.backdropEl.classList.remove('show');
      document.body.style.overflow = '';
    };

    menuToggle?.addEventListener('click', () => {
      if (this.sidebarEl.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    closeBtn?.addEventListener('click', closeMenu);
    this.backdropEl.addEventListener('click', closeMenu);
  }

  public renderNavigation(navItems: NavigationItem[], activePath: string): void {
    if (navItems.length === 0) {
      this.sidebarEl.style.display = 'none';
      return;
    }
    this.sidebarEl.style.display = 'block';

    const hasActiveChild = (item: NavigationItem): boolean => {
      if (!item.children || item.children.length === 0) return false;
      return item.children.some(child => child.href === activePath || hasActiveChild(child));
    };

    const renderList = (items: NavigationItem[]): string => {
      return `
        <ul class="verti-nav-list cortex-nav-list omni-nav-list">
          ${items.map(item => {
            if (item.children && item.children.length > 0) {
              if (this.config.collapsibleNavigation) {
                const isExpanded = hasActiveChild(item);
                return `
                  <li class="verti-nav-section verti-nav-accordion cortex-nav-section cortex-nav-accordion omni-nav-section omni-nav-accordion ${isExpanded ? 'expanded' : ''}">
                    <button type="button" class="verti-nav-accordion-toggle cortex-nav-accordion-toggle omni-nav-accordion-toggle" aria-expanded="${isExpanded ? 'true' : 'false'}">
                      <span class="verti-nav-accordion-title cortex-nav-accordion-title omni-nav-accordion-title">${item.title}</span>
                      <svg class="verti-nav-accordion-chevron cortex-nav-accordion-chevron omni-nav-accordion-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <div class="verti-nav-accordion-content cortex-nav-accordion-content omni-nav-accordion-content">
                      ${renderList(item.children)}
                    </div>
                  </li>
                `;
              }

              return `
                <li class="verti-nav-section cortex-nav-section omni-nav-section">
                  <div class="verti-nav-section-title cortex-nav-section-title omni-nav-section-title">${item.title}</div>
                  ${renderList(item.children)}
                </li>
              `;
            }

            const targetHref = item.isExternal ? item.href : `#/${item.href}`;
            const isActive = activePath === item.href;
            const targetAttr = item.isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';

            return `
              <li>
                <a href="${targetHref}" class="verti-nav-link cortex-nav-link omni-nav-link ${isActive ? 'active' : ''}" ${targetAttr}>
                  ${item.title}
                </a>
              </li>
            `;
          }).join('')}
        </ul>
      `;
    };

    this.sidebarNavContainer.innerHTML = renderList(navItems);
  }

  public updateActiveNavLink(activePath: string): void {
    this.sidebarNavContainer.querySelectorAll<HTMLAnchorElement>('.verti-nav-link, .cortex-nav-link, .omni-nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const path = href.replace(/^#!/, '').replace(/^#\//, '');
      const isActive = path === activePath ||
                       (activePath.endsWith('/index.md') && (path === activePath.replace(/\/index\.md$/, '') || path === activePath.replace(/\/index\.md$/, '/'))) ||
                       (!path.endsWith('.md') && activePath === `${path}/index.md`) ||
                       (activePath.endsWith('.md') && path === activePath.replace(/\.md$/, ''));
      link.classList.toggle('active', isActive);

      if (isActive && this.config.collapsibleNavigation) {
        let parent = link.closest('.verti-nav-accordion, .cortex-nav-accordion, .omni-nav-accordion');
        while (parent) {
          parent.classList.add('expanded');
          parent.querySelector('.verti-nav-accordion-toggle, .cortex-nav-accordion-toggle, .omni-nav-accordion-toggle')?.setAttribute('aria-expanded', 'true');
          parent = parent.parentElement?.closest('.verti-nav-accordion, .cortex-nav-accordion, .omni-nav-accordion') || null;
        }
      }
    });
  }
}
