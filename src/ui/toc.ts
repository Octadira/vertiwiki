import { TocItem } from '../core/types';
import { escapeHtml } from '../core/escape';

export class TableOfContents {
  private container: HTMLElement;
  private observer: IntersectionObserver | null = null;
  private onAnchorClick?: (anchor: string) => void;

  constructor(container: HTMLElement, onAnchorClick?: (anchor: string) => void) {
    this.container = container;
    this.onAnchorClick = onAnchorClick;
  }

  public update(article: HTMLElement): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    const headings = article.querySelectorAll<HTMLHeadingElement>('h2, h3');
    if (headings.length === 0) {
      this.container.classList.add('empty');
      this.container.innerHTML = '';
      return;
    }

    this.container.classList.remove('empty');
    const items: TocItem[] = [];

    headings.forEach(h => {
      const id = h.id || '';
      const clone = h.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('.verti-badge').forEach(b => b.remove());
      const text = clone.textContent?.trim() || h.textContent?.trim() || '';
      const level = parseInt(h.tagName.substring(1), 10);
      if (id && text) {
        items.push({ id, text, level });
      }
    });

    this.render(items);
    this.setupScrollspy(headings);
  }

  private render(items: TocItem[]): void {
    this.container.innerHTML = `
      <div class="verti-toc-title">On this page</div>
      <ul class="verti-toc-list">
        ${items.map(item => `
          <li class="verti-toc-item level-${item.level}" data-toc-id="${escapeHtml(item.id)}">
            <a href="#${escapeHtml(item.id)}">${escapeHtml(item.text)}</a>
          </li>
        `).join('')}
      </ul>
    `;

    const links = this.container.querySelectorAll<HTMLAnchorElement>('.verti-toc-item a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1) || '';
        if (targetId) {
          if (this.onAnchorClick) {
            this.onAnchorClick(targetId);
          } else {
            const el = document.getElementById(targetId);
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  private setupScrollspy(headings: NodeListOf<HTMLHeadingElement>): void {
    const headingMap = new Map<string, HTMLElement>();
    this.container.querySelectorAll<HTMLElement>('.verti-toc-item').forEach(item => {
      const id = item.getAttribute('data-toc-id');
      if (id) headingMap.set(id, item);
    });

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.container.querySelectorAll('.verti-toc-item').forEach(el => el.classList.remove('active'));
          const activeItem = headingMap.get(id);
          if (activeItem) {
            activeItem.classList.add('active');
          }
        }
      });
    }, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    });

    headings.forEach(h => this.observer?.observe(h));
  }
}
