import { VertiWikiPlugin } from '../core/pipeline';

/**
 * VertiWiki Collapsible Details / Accordion Plugin
 * 
 * Syntax:
 * ::: details Title of the accordion
 * Hidden content here...
 * :::
 * 
 * Or opened by default:
 * ::: details:open Title of the accordion
 * Visible content here...
 * :::
 */
export const detailsPlugin: VertiWikiPlugin = {
  name: 'details',
  beforeParse: (markdown) => {
    // Match ::: details(:open)? Title ... :::
    const detailsRegex = /:::\s*details(:open)?\s+(.+?)\r?\n([\s\S]*?)\r?\n:::/g;

    return markdown.replace(detailsRegex, (_, openAttr, title, content) => {
      const isOpen = openAttr === ':open' ? ' open' : '';
      return `\n<details class="verti-details cortex-details omni-details"${isOpen}>\n<summary class="verti-details-summary cortex-details-summary omni-details-summary">${title.trim()}</summary>\n<div class="verti-details-content cortex-details-content omni-details-content">\n\n${content.trim()}\n\n</div>\n</details>\n`;
    });
  }
};
