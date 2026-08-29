import { VertiWikiPlugin } from '../core/pipeline';

const CALLOUT_TYPES = {
  note: { title: 'Note', icon: 'ℹ️', class: 'note' },
  tip: { title: 'Tip', icon: '💡', class: 'tip' },
  important: { title: 'Important', icon: '🔔', class: 'important' },
  warning: { title: 'Warning', icon: '⚠️', class: 'warning' },
  caution: { title: 'Caution', icon: '🛑', class: 'caution' }
};

export const calloutsPlugin: VertiWikiPlugin = {
  name: 'callouts',
  afterRender: (context) => {
    const blockquotes = context.container.querySelectorAll<HTMLQuoteElement>('blockquote');

    blockquotes.forEach(bq => {
      const firstParagraph = bq.querySelector('p');
      if (!firstParagraph) return;

      const text = firstParagraph.innerHTML.trim();
      
      // Match GitHub-style GFM callouts: [!NOTE], [!TIP], [!WARNING], etc.
      const gfmMatch = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*<br\s*\/?>|\s*\n|\s+)?([\s\S]*)$/i);
      
      // Match legacy MDwiki alert syntax: Note:, Warning:, Tip:, Hint:
      const legacyMatch = !gfmMatch ? text.match(/^(Note|Warning|Tip|Hint|Achtung|Attention|Hinweis)(?::|!)\s*([\s\S]*)$/i) : null;

      if (gfmMatch) {
        const typeKey = gfmMatch[1].toLowerCase() as keyof typeof CALLOUT_TYPES;
        const config = CALLOUT_TYPES[typeKey] || CALLOUT_TYPES.note;
        const remainingText = gfmMatch[2];

        firstParagraph.innerHTML = remainingText;

        const callout = document.createElement('div');
        callout.className = `verti-callout cortex-callout omni-callout ${config.class}`;
        callout.innerHTML = `
          <div class="verti-callout-title cortex-callout-title omni-callout-title">
            <span class="verti-callout-icon cortex-callout-icon omni-callout-icon">${config.icon}</span>
            <span>${config.title}</span>
          </div>
          <div class="verti-callout-body cortex-callout-body omni-callout-body">${bq.innerHTML}</div>
        `;
        bq.replaceWith(callout);
      } else if (legacyMatch) {
        let typeKey: keyof typeof CALLOUT_TYPES = 'note';
        const rawType = legacyMatch[1].toLowerCase();
        if (['warning', 'achtung', 'attention'].includes(rawType)) typeKey = 'warning';
        else if (['tip', 'hint', 'hinweis'].includes(rawType)) typeKey = 'tip';

        const config = CALLOUT_TYPES[typeKey];
        firstParagraph.innerHTML = legacyMatch[2];

        const callout = document.createElement('div');
        callout.className = `verti-callout cortex-callout omni-callout ${config.class}`;
        callout.innerHTML = `
          <div class="verti-callout-title cortex-callout-title omni-callout-title">
            <span class="verti-callout-icon cortex-callout-icon omni-callout-icon">${config.icon}</span>
            <span>${config.title}</span>
          </div>
          <div class="verti-callout-body cortex-callout-body omni-callout-body">${bq.innerHTML}</div>
        `;
        bq.replaceWith(callout);
      }
    });
  }
};
