import { VertiWikiConfig } from './types';

export async function resolveFavicon(config: VertiWikiConfig): Promise<string> {
  if (config.favicon) return config.favicon;

  if (config.logo) {
    const lastSlash = config.logo.lastIndexOf('/');
    const dir = lastSlash !== -1 ? config.logo.substring(0, lastSlash) : '';
    const candidates = dir
      ? [`${dir}/favicon.ico`, `${dir}/favicon.svg`, `${dir}/favicon.png`, config.logo]
      : ['favicon.ico', 'favicon.svg', 'favicon.png', config.logo];

    for (const candidate of candidates) {
      try {
        const res = await fetch(candidate, { method: 'HEAD' });
        if (res.ok) return candidate;
      } catch {}
    }
    return config.logo;
  }

  const fallbacks = [
    'demo/assets/favicon.ico',
    'demo/assets/favicon.svg',
    'assets/favicon.ico',
    'assets/favicon.svg',
    'favicon.ico'
  ];

  for (const candidate of fallbacks) {
    try {
      const res = await fetch(candidate, { method: 'HEAD' });
      if (res.ok) return candidate;
    } catch {}
  }

  return 'favicon.ico';
}

export function applyFavicon(faviconUrl: string): void {
  if (typeof document === 'undefined') return;
  let favLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (!favLink) {
    favLink = document.createElement('link');
    favLink.rel = 'icon';
    document.head.appendChild(favLink);
  }
  favLink.href = faviconUrl;
  if (faviconUrl.endsWith('.svg') || faviconUrl.startsWith('data:image/svg+xml')) {
    favLink.type = 'image/svg+xml';
  } else if (faviconUrl.endsWith('.png')) {
    favLink.type = 'image/png';
  } else if (faviconUrl.endsWith('.ico')) {
    favLink.type = 'image/x-icon';
  }
}
