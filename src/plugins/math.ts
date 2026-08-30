import katex from 'katex';
import { VertiWikiPlugin } from '../core/pipeline';

export const mathPlugin: VertiWikiPlugin = {
  name: 'math',
  afterRender: (context) => {
    if (!context.config.enableMath) return;

    // 1. Process ```math code blocks
    const mathCodeBlocks = context.container.querySelectorAll<HTMLElement>('pre code.language-math, pre code.lang-math');
    mathCodeBlocks.forEach(code => {
      const pre = code.parentElement;
      if (!pre) return;
      const formula = code.textContent || '';
      try {
        const mathDiv = document.createElement('div');
        mathDiv.className = 'verti-math-block cortex-math-block omni-math-block';
        mathDiv.style.margin = '1.5rem 0';
        mathDiv.style.textAlign = 'center';
        mathDiv.style.overflowX = 'auto';
        katex.render(formula, mathDiv, { displayMode: true, throwOnError: false });
        pre.replaceWith(mathDiv);
      } catch (err) {
        console.error('KaTeX block error:', err);
      }
    });

    // 2. Process inline and display math in text nodes ($...$ and $$...$$)
    const walker = document.createTreeWalker(
      context.container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (parent && (parent.tagName === 'CODE' || parent.tagName === 'PRE' || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes: Text[] = [];
    let currentNode = walker.nextNode();
    while (currentNode) {
      textNodes.push(currentNode as Text);
      currentNode = walker.nextNode();
    }

    textNodes.forEach(node => {
      const text = node.nodeValue || '';
      if (!text.includes('$')) return;

      // Match $$...$$ (display math) or $...$ (inline math)
      const mathRegex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g;
      if (!mathRegex.test(text)) return;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      mathRegex.lastIndex = 0;

      while ((match = mathRegex.exec(text)) !== null) {
        // Text before math
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        }

        const isDisplay = Boolean(match[1]);
        const formula = match[1] || match[2];

        const span = document.createElement(isDisplay ? 'div' : 'span');
        if (isDisplay) {
          span.className = 'verti-math-display cortex-math-display omni-math-display';
          span.style.margin = '1rem 0';
          span.style.textAlign = 'center';
        } else {
          span.className = 'verti-math-inline cortex-math-inline omni-math-inline';
        }

        try {
          katex.render(formula, span, {
            displayMode: isDisplay,
            throwOnError: false
          });
          fragment.appendChild(span);
        } catch {
          fragment.appendChild(document.createTextNode(match[0]));
        }

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }

      node.parentNode?.replaceChild(fragment, node);
    });
  }
};
