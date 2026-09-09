import { VertiWikiPlugin } from '../core/pipeline';
import { escapeHtml } from '../core/escape';

/**
 * VertiWiki Code & Content Tabs Plugin
 * 
 * Syntax:
 * ::: tabs
 * == Tab 1 Name
 * Content for Tab 1
 * == Tab 2 Name
 * Content for Tab 2
 * :::
 */
export const tabsPlugin: VertiWikiPlugin = {
  name: 'tabs',
  beforeParse: (markdown) => {
    let tabIndex = 0;

    // Match ::: tabs ... ::: or ::: code-group ... :::
    const tabsBlockRegex = /:::\s*(?:tabs|code-group)\r?\n([\s\S]*?)\r?\n:::/g;

    return markdown.replace(tabsBlockRegex, (_, blockContent) => {
      tabIndex++;
      const tabGroupId = `verti-tabs-${tabIndex}`;

      // Normalize leading == on first line and split by == Tab Name
      const normalizedBlock = blockContent.replace(/^\s*==\s+/, '');
      const sections = normalizedBlock.split(/\r?\n==\s+/);
      const tabs: { title: string; content: string }[] = [];

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i].trim();
        if (!sec) continue;

        const newlineIdx = sec.indexOf('\n');
        let title = '';
        let content = '';

        if (newlineIdx !== -1) {
          title = sec.substring(0, newlineIdx).trim();
          content = sec.substring(newlineIdx + 1).trim();
        } else {
          title = sec.trim();
          content = '';
        }

        if (title) {
          tabs.push({ title, content });
        }
      }

      if (tabs.length === 0) return '';

      // Build HTML markup
      const navButtons = tabs
        .map((tab, idx) => {
          const isActive = idx === 0 ? ' active' : '';
          return `<button class="verti-tab-btn${isActive}" data-tab-title="${escapeHtml(tab.title)}" data-tab-target="${tabGroupId}-panel-${idx}" type="button">${escapeHtml(tab.title)}</button>`;
        })
        .join('');

      const panels = tabs
        .map((tab, idx) => {
          const isActive = idx === 0 ? ' active' : '';
          return `<div class="verti-tab-panel${isActive}" id="${tabGroupId}-panel-${idx}">\n\n${tab.content}\n\n</div>`;
        })
        .join('');

      return `\n<div class="verti-tabs-container" id="${tabGroupId}">\n<div class="verti-tabs-header">${navButtons}</div>\n<div class="verti-tabs-body">\n${panels}\n</div>\n</div>\n`;
    });
  },

  afterRender: (context) => {
    const tabContainers = context.container.querySelectorAll('.verti-tabs-container');
    if (tabContainers.length === 0) return;

    const getSavedTab = (): string | null => {
      try {
        return localStorage.getItem('vertiwiki_preferred_tab');
      } catch {
        return null;
      }
    };

    const setSavedTab = (title: string): void => {
      try {
        localStorage.setItem('vertiwiki_preferred_tab', title);
      } catch {
        // Ignore storage error in restricted contexts
      }
    };

    const activateTabInContainer = (container: Element, titleOrTargetId: string, isTitle: boolean) => {
      const buttons = container.querySelectorAll<HTMLButtonElement>('.verti-tab-btn');
      const panels = container.querySelectorAll<HTMLElement>('.verti-tab-panel');

      let targetBtn: HTMLButtonElement | null = null;
      buttons.forEach(b => {
        if (isTitle) {
          if (b.getAttribute?.('data-tab-title') === titleOrTargetId) {
            targetBtn = b;
          }
        } else {
          if (b.getAttribute?.('data-tab-target') === titleOrTargetId) {
            targetBtn = b;
          }
        }
      });

      if (!targetBtn && !isTitle) {
        const found = container.querySelector?.(`[data-tab-target="${titleOrTargetId}"]`);
        if (found && typeof (found as any).getAttribute === 'function') {
          targetBtn = found as HTMLButtonElement;
        }
      }

      if (!targetBtn) return;
      const targetId = targetBtn.getAttribute?.('data-tab-target') || titleOrTargetId;
      if (!targetId) return;

      buttons.forEach(b => b.classList?.remove?.('active'));
      panels.forEach(p => p.classList?.remove?.('active'));

      targetBtn.classList?.add?.('active');
      const targetPanel = container.querySelector?.(`#${targetId}`) || panels[0];
      targetPanel?.classList?.add?.('active');
    };

    // Synchronize across all tab containers on click
    tabContainers.forEach(container => {
      const buttons = container.querySelectorAll<HTMLButtonElement>('.verti-tab-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const tabTitle = btn.getAttribute('data-tab-title');
          const targetId = btn.getAttribute('data-tab-target');
          if (!targetId) return;

          activateTabInContainer(container, targetId, false);

          if (tabTitle) {
            setSavedTab(tabTitle);
            // Synchronize other tab containers on the same page
            tabContainers.forEach(otherContainer => {
              if (otherContainer !== container) {
                activateTabInContainer(otherContainer, tabTitle, true);
              }
            });
          }
        });
      });
    });

    // Auto-restore saved tab preference on page load
    const saved = getSavedTab();
    if (saved) {
      tabContainers.forEach(container => {
        activateTabInContainer(container, saved, true);
      });
    }
  }
};
