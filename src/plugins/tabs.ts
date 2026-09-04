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

      // Split by == Tab Name
      const sections = blockContent.split(/\r?\n==\s+/);
      const tabs: { title: string; content: string }[] = [];

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i].trim();
        if (!sec) continue;

        if (i === 0 && !blockContent.startsWith('==')) {
          // If content before first ==, skip or handle
          continue;
        }

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
          return `<button class="verti-tab-btn${isActive}" data-tab-target="${tabGroupId}-panel-${idx}" type="button">${escapeHtml(tab.title)}</button>`;
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
    
    tabContainers.forEach(container => {
      const buttons = container.querySelectorAll<HTMLButtonElement>('.verti-tab-btn');
      const panels = container.querySelectorAll<HTMLElement>('.verti-tab-panel');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-tab-target');
          if (!targetId) return;

          buttons.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          const targetPanel = container.querySelector(`#${targetId}`);
          targetPanel?.classList.add('active');
        });
      });
    });
  }
};
