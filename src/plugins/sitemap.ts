import { VertiWikiPlugin } from '../core/pipeline';
import { NavigationItem } from '../core/types';

export function parseNavigationMarkdown(navMarkdown: string): NavigationItem[] {
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

export const sitemapPlugin: VertiWikiPlugin = {
  name: 'sitemap',
  beforeParse: (markdown) => {
    // Match ::: sitemap ... ::: or ::: site-index ... ::: or [sitemap]
    const sitemapBlockRegex = /:::\s*(?:sitemap|site-index)[\s\S]*?:::/g;
    return markdown.replace(sitemapBlockRegex, () => {
      return '\n<div class="verti-sitemap-root" data-sitemap="true"></div>\n';
    });
  },

  afterRender: async (context) => {
    const placeholders = context.container.querySelectorAll<HTMLElement>('.verti-sitemap-root[data-sitemap="true"]');
    if (placeholders.length === 0) return;

    let navItems: NavigationItem[] = [];
    try {
      const navRes = await fetch(context.config.navigationFile || 'navigation.md');
      if (navRes.ok) {
        const navText = await navRes.text();
        navItems = parseNavigationMarkdown(navText);
      }
    } catch (err) {
      console.warn('[VertiWiki] Sitemap plugin could not load navigation file:', err);
    }

    if (navItems.length === 0) {
      placeholders.forEach(el => {
        el.innerHTML = `
          <div class="verti-callout note">
            <div class="verti-callout-title">Sitemap Empty</div>
            <p>No navigation structure found in <code>${context.config.navigationFile}</code>.</p>
          </div>
        `;
      });
      return;
    }

    // Calculate total articles and sections
    let totalArticles = 0;
    let totalSections = 0;

    navItems.forEach(group => {
      if (group.children && group.children.length > 0) {
        totalSections++;
        totalArticles += group.children.length;
      } else if (group.href) {
        totalArticles++;
      }
    });

    placeholders.forEach((container, containerIdx) => {
      const searchInputId = `verti-sitemap-filter-${containerIdx}`;

      let cardsHtml = '';
      navItems.forEach(item => {
        if (item.children && item.children.length > 0) {
          const linksHtml = item.children
            .map(child => {
              const href = child.isExternal ? child.href : `#/${child.href}`;
              const target = child.isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
              const icon = child.isExternal ? '↗' : '📄';
              return `
                <li class="verti-sitemap-item" data-title="${child.title.toLowerCase()}" data-href="${child.href.toLowerCase()}">
                  <a href="${href}" class="verti-sitemap-link"${target}>
                    <span class="verti-sitemap-item-icon">${icon}</span>
                    <span class="verti-sitemap-item-title">${child.title}</span>
                  </a>
                </li>
              `;
            })
            .join('');

          cardsHtml += `
            <div class="verti-sitemap-card" data-section="${item.title.toLowerCase()}">
              <div class="verti-sitemap-card-header">
                <div class="verti-sitemap-card-title">
                  <span class="verti-sitemap-folder-icon">📁</span>
                  <span>${item.title}</span>
                </div>
                <span class="verti-sitemap-card-count">${item.children.length} articles</span>
              </div>
              <ul class="verti-sitemap-list">
                ${linksHtml}
              </ul>
            </div>
          `;
        } else if (item.href) {
          const href = item.isExternal ? item.href : `#/${item.href}`;
          const target = item.isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
          const icon = item.isExternal ? '↗' : '📄';
          cardsHtml += `
            <div class="verti-sitemap-card single" data-section="${item.title.toLowerCase()}">
              <ul class="verti-sitemap-list">
                <li class="verti-sitemap-item" data-title="${item.title.toLowerCase()}" data-href="${item.href.toLowerCase()}">
                  <a href="${href}" class="verti-sitemap-link"${target}>
                    <span class="verti-sitemap-item-icon">${icon}</span>
                    <span class="verti-sitemap-item-title" style="font-weight: 600;">${item.title}</span>
                  </a>
                </li>
              </ul>
            </div>
          `;
        }
      });

      container.innerHTML = `
        <div class="verti-sitemap-wrapper">
          <div class="verti-sitemap-topbar">
            <div class="verti-sitemap-stats">
              <span class="verti-sitemap-badge"><strong>${totalSections}</strong> Categories</span>
              <span class="verti-sitemap-badge"><strong>${totalArticles}</strong> Articles</span>
            </div>
            <div class="verti-sitemap-search-box">
              <svg class="verti-sitemap-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" id="${searchInputId}" class="verti-sitemap-search-input" placeholder="Filter articles in sitemap..." aria-label="Filter articles in sitemap" />
            </div>
          </div>
          <div class="verti-sitemap-grid">
            ${cardsHtml}
          </div>
          <div class="verti-sitemap-empty" style="display: none;">
            No articles match your filter.
          </div>
        </div>
      `;

      // Attach live filtering listener
      const input = container.querySelector<HTMLInputElement>(`#${searchInputId}`);
      const grid = container.querySelector<HTMLElement>('.verti-sitemap-grid');
      const emptyMsg = container.querySelector<HTMLElement>('.verti-sitemap-empty');

      if (input && grid) {
        input.addEventListener('input', () => {
          const query = input.value.trim().toLowerCase();
          const cards = grid.querySelectorAll<HTMLElement>('.verti-sitemap-card');
          let visibleCardsCount = 0;

          cards.forEach(card => {
            const items = card.querySelectorAll<HTMLElement>('.verti-sitemap-item');
            let visibleItemsInCard = 0;

            items.forEach(item => {
              const title = item.getAttribute('data-title') || '';
              const href = item.getAttribute('data-href') || '';
              const matches = !query || title.includes(query) || href.includes(query);

              if (matches) {
                item.style.display = '';
                visibleItemsInCard++;
              } else {
                item.style.display = 'none';
              }
            });

            if (visibleItemsInCard > 0) {
              card.style.display = '';
              visibleCardsCount++;
            } else {
              card.style.display = 'none';
            }
          });

          if (emptyMsg) {
            emptyMsg.style.display = visibleCardsCount === 0 ? 'block' : 'none';
          }
        });
      }
    });
  }
};
