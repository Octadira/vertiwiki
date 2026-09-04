import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-diff';
import { VertiWikiPlugin } from '../core/pipeline';
import { escapeHtml } from '../core/escape';

export const codeHighlightPlugin: VertiWikiPlugin = {
  name: 'code-highlight',
  afterRender: (context) => {
    const preElements = context.container.querySelectorAll<HTMLPreElement>('pre');

    preElements.forEach(pre => {
      // Don't process if already wrapped or if it's a mermaid/diagram block
      if (pre.parentElement?.classList.contains('verti-code-block-wrapper')) return;
      const code = pre.querySelector('code');
      if (!code) return;

      const classList = Array.from(code.classList);
      let language = 'text';
      for (const cls of classList) {
        if (cls.startsWith('language-') || cls.startsWith('lang-')) {
          language = cls.replace(/^language-|^lang-/, '');
          break;
        }
      }

      if (language === 'mermaid') {
        // Skip mermaid; handled by mermaidPlugin
        return;
      }

      // Syntax highlight with Prism
      Prism.highlightElement(code);

      // Create rich container with header and copy button
      const wrapper = document.createElement('div');
      wrapper.className = 'verti-code-block-wrapper';

      const header = document.createElement('div');
      header.className = 'verti-code-header';
      header.innerHTML = `
        <span class="verti-code-lang">${escapeHtml(language.toUpperCase())}</span>
        <button class="verti-copy-code-btn" type="button" aria-label="Copy code">Copy</button>
      `;

      const copyBtn = header.querySelector<HTMLButtonElement>('.verti-copy-code-btn')!;
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent || '');
          copyBtn.textContent = 'Copied!';
          copyBtn.style.color = '#4ade80';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.style.color = '';
          }, 2000);
        } catch {
          copyBtn.textContent = 'Error';
        }
      });

      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }
};
