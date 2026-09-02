import mermaid from 'mermaid';
import { VertiWikiPlugin } from '../core/pipeline';

export const mermaidPlugin: VertiWikiPlugin = {
  name: 'mermaid',
  afterRender: async (context) => {
    if (!context.config.enableMermaid) return;

    const mermaidBlocks = context.container.querySelectorAll<HTMLElement>('pre code.language-mermaid, pre code.lang-mermaid');
    if (mermaidBlocks.length === 0) return;

    const isDark = typeof document !== 'undefined' && (
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      (document.documentElement.getAttribute('data-theme') !== 'light' &&
       typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
    );

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit'
    });

    let idCounter = 0;
    for (const code of Array.from(mermaidBlocks)) {
      const pre = code.parentElement;
      if (!pre) continue;

      const graphDefinition = code.textContent || '';
      const uniqueId = `verti-mermaid-${Date.now()}-${idCounter++}`;

      try {
        const { svg } = await mermaid.render(uniqueId, graphDefinition);
        const wrapper = document.createElement('div');
        wrapper.className = 'verti-mermaid-wrapper cortex-mermaid-wrapper omni-mermaid-wrapper';
        wrapper.innerHTML = svg;
        pre.replaceWith(wrapper);
      } catch (err) {
        console.error('Mermaid render error:', err);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'verti-callout cortex-callout omni-callout caution';
        errorDiv.innerHTML = `<div class="verti-callout-title cortex-callout-title omni-callout-title">Diagram Error</div><pre>${err}</pre>`;
        pre.replaceWith(errorDiv);
      }
    }
  }
};
