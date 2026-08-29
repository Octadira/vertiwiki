import { VertiWikiPlugin } from '../core/pipeline';

/**
 * VertiWiki Badge Plugin
 * 
 * Syntax:
 *   :badge[Text]
 *   :badge[Text]{type=primary}
 *   :badge[Text]{type=success}
 *   :badge[Text]{type=warning}
 *   :badge[Text]{type=danger}
 *   :badge[Text]{type=purple}
 *   :badge[Text]{type=info}
 */
export const badgePlugin: VertiWikiPlugin = {
  name: 'badge',
  beforeParse: (markdown) => {
    // Regex matching :badge[Text]{type=...} or :badge[Text]
    const badgeRegex = /:badge\[([^\]]+)\](?:\{type=([a-zA-Z0-9_-]+)\})?/g;

    return markdown.replace(badgeRegex, (_, text, type = 'info') => {
      const cleanType = type.toLowerCase().trim();
      return `<span class="verti-badge verti-badge-${cleanType} cortex-badge cortex-badge-${cleanType} omni-badge omni-badge-${cleanType}">${text}</span>`;
    });
  }
};
