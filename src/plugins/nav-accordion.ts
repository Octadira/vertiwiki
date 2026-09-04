import { VertiWikiPlugin } from '../core/pipeline';

/**
 * VertiWiki Collapsible Navigation Accordion Plugin
 * 
 * Auto-expands the active branch in sidebar navigation on route changes.
 */
export const navAccordionPlugin: VertiWikiPlugin = {
  name: 'nav-accordion',
  afterRender: (context) => {
    if (context.config.collapsibleNavigation) {
      const cleanPath = context.filePath.replace(/\/index\.md$/, '');
      const activeLink = document.querySelector<HTMLAnchorElement>(
        `.verti-nav-link[href="#/${context.filePath}"], .verti-nav-link[href="#!${context.filePath}"], ` +
        `.verti-nav-link[href="#/${cleanPath}"], .verti-nav-link[href="#/${cleanPath}/"]`
      );
      if (activeLink) {
        let parent = activeLink.closest('.verti-nav-accordion');
        while (parent) {
          parent.classList.add('expanded');
          const toggleBtn = parent.querySelector<HTMLButtonElement>('.verti-nav-accordion-toggle');
          toggleBtn?.setAttribute('aria-expanded', 'true');
          parent = parent.parentElement?.closest('.verti-nav-accordion') || null;
        }
      }
    }
  }
};
