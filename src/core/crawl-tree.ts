import { NavigationItem } from './types';
import { escapeHtml } from './escape';

export interface CrawlTreeOptions {
  /**
   * If true, applies visually-hidden CSS styling (accessible to screen readers and bots, but visually unobtrusive).
   */
  visuallyHidden?: boolean;
  /**
   * Custom aria-label for the navigation landmark.
   * Defaults to 'Documentation Navigation Index'.
   */
  ariaLabel?: string;
  /**
   * Optional DOM id attribute.
   */
  id?: string;
}

/**
 * Generates semantic, crawlable HTML markup for documentation navigation items.
 * Ensures Googlebot and other web crawlers immediately detect internal anchor links
 * during the initial HTTP fetch pass, eliminating the "orphan URLs" issue.
 */
export function renderCrawlTreeHtml(items: NavigationItem[], options: CrawlTreeOptions = {}): string {
  const ariaLabel = options.ariaLabel || 'Documentation Navigation Index';
  const idAttr = options.id ? ` id="${escapeHtml(options.id)}"` : '';
  const hiddenStyle = options.visuallyHidden
    ? ' style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"'
    : '';

  function renderList(list: NavigationItem[]): string {
    if (!list || list.length === 0) return '';
    const itemsHtml = list.map(item => {
      const safeTitle = escapeHtml(item.title);
      const safeHref = escapeHtml(item.href);
      const targetAttr = item.isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const linkHtml = item.href ? `<a href="${safeHref}"${targetAttr}>${safeTitle}</a>` : `<span>${safeTitle}</span>`;

      if (item.children && item.children.length > 0) {
        return `<li>${linkHtml}\n${renderList(item.children)}</li>`;
      }
      return `<li>${linkHtml}</li>`;
    }).join('\n');

    return `<ul>\n${itemsHtml}\n</ul>`;
  }

  return `<nav class="verti-crawl-tree"${idAttr} aria-label="${escapeHtml(ariaLabel)}"${hiddenStyle}>\n${renderList(items)}\n</nav>`;
}
