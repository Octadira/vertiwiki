import { NavigationItem } from '../core/types';
import { escapeHtml } from '../core/escape';

export class PrevNextNavigation {
  private container: HTMLElement | null = null;

  constructor(parentEl: HTMLElement | null) {
    if (!parentEl) return;
    let el = parentEl.querySelector<HTMLElement>('#verti-prev-next-nav');
    if (!el) {
      el = document.createElement('nav');
      el.id = 'verti-prev-next-nav';
      el.className = 'verti-prev-next-container';
      el.setAttribute('aria-label', 'Previous and Next documentation pages');
      parentEl.appendChild(el);
    }
    this.container = el;
  }

  public update(navItems: NavigationItem[], currentFilePath: string): void {
    if (!this.container) return;
    const flatLinks: { title: string; href: string }[] = [];

    const flatten = (items: NavigationItem[]) => {
      for (const item of items) {
        if (item.href && !item.isExternal) {
          flatLinks.push({ title: item.title, href: item.href });
        }
        if (item.children && item.children.length > 0) {
          flatten(item.children);
        }
      }
    };

    flatten(navItems);

    const currentIndex = flatLinks.findIndex(l => l.href === currentFilePath);
    if (currentIndex === -1 || flatLinks.length <= 1) {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
      return;
    }

    const prevItem = currentIndex > 0 ? flatLinks[currentIndex - 1] : null;
    const nextItem = currentIndex < flatLinks.length - 1 ? flatLinks[currentIndex + 1] : null;

    if (!prevItem && !nextItem) {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'grid';

    const prevHtml = prevItem
      ? `
        <a href="#/${escapeHtml(prevItem.href)}" class="verti-prev-next-card prev">
          <span class="verti-prev-next-label">← Previous Page</span>
          <span class="verti-prev-next-title">${escapeHtml(prevItem.title)}</span>
        </a>
      `
      : '<div class="verti-prev-next-placeholder"></div>';

    const nextHtml = nextItem
      ? `
        <a href="#/${escapeHtml(nextItem.href)}" class="verti-prev-next-card next">
          <span class="verti-prev-next-label">Next Page →</span>
          <span class="verti-prev-next-title">${escapeHtml(nextItem.title)}</span>
        </a>
      `
      : '<div class="verti-prev-next-placeholder"></div>';

    this.container.innerHTML = `${prevHtml}${nextHtml}`;
  }
}
