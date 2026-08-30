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
      const activeLink = document.querySelector<HTMLAnchorElement>(
        `.verti-nav-link[href="#!${context.filePath}"], .cortex-nav-link[href="#!${context.filePath}"], .omni-nav-link[href="#!${context.filePath}"]`
      );
      if (activeLink) {
        let parent = activeLink.closest('.verti-nav-accordion, .cortex-nav-accordion, .omni-nav-accordion');
        while (parent) {
          parent.classList.add('expanded');
          const toggleBtn = parent.querySelector<HTMLButtonElement>(
            '.verti-nav-accordion-toggle, .cortex-nav-accordion-toggle, .omni-nav-accordion-toggle'
          );
          toggleBtn?.setAttribute('aria-expanded', 'true');
          parent = parent.parentElement?.closest('.verti-nav-accordion, .cortex-nav-accordion, .omni-nav-accordion') || null;
        }
      }
    }
  }
};
