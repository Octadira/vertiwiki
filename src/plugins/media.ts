import { VertiWikiPlugin } from '../core/pipeline';

export const mediaPlugin: VertiWikiPlugin = {
  name: 'media',
  afterRender: (context) => {
    const anchors = context.container.querySelectorAll<HTMLAnchorElement>('a[href]');

    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
      const text = a.textContent?.trim() || '';

      // Only transform standalone links or gimmick links
      const isStandalone = a.parentElement?.tagName === 'P' && a.parentElement.children.length === 1 && a.parentElement.textContent?.trim() === text;
      const isGimmick = text.startsWith('gimmick:youtube') || text.startsWith('gimmick:iframe');

      if (!isStandalone && !isGimmick) return;

      // 1. YouTube Embeds
      const ytMatch = href.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (ytMatch && (text === '' || text === href || isGimmick || isStandalone)) {
        const videoId = ytMatch[1];
        const wrapper = document.createElement('div');
        wrapper.className = 'verti-media-wrapper verti-youtube-wrapper cortex-media-wrapper cortex-youtube-wrapper omni-media-wrapper omni-youtube-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.paddingBottom = '56.25%';
        wrapper.style.height = '0';
        wrapper.style.overflow = 'hidden';
        wrapper.style.margin = '1.5rem 0';
        wrapper.style.borderRadius = 'var(--verti-radius-md, var(--cortex-radius-md, var(--omni-radius-md)))';
        wrapper.style.boxShadow = 'var(--verti-shadow-md, var(--cortex-shadow-md, var(--omni-shadow-md)))';

        wrapper.innerHTML = `
          <iframe
            src="https://www.youtube-nocookie.com/embed/${videoId}"
            title="YouTube video player"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy">
          </iframe>
        `;

        if (a.parentElement?.tagName === 'P') {
          a.parentElement.replaceWith(wrapper);
        } else {
          a.replaceWith(wrapper);
        }
      }
    });
  }
};
