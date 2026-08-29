export interface RouteInfo {
  filePath: string;
  anchor: string;
  isMarkdown: boolean;
}

export function normalizePath(path: string): string {
  let clean = path.replace(/\\/g, '/').replace(/\/+/g, '/');
  if (clean.startsWith('./')) clean = clean.substring(2);

  const segments = clean.split('/');
  const resolved: string[] = [];

  for (const segment of segments) {
    if (segment === '' || segment === '.') continue;
    if (segment === '..') {
      if (resolved.length > 0) {
        resolved.pop();
      }
    } else {
      resolved.push(segment);
    }
  }

  return resolved.join('/');
}

export function resolvePath(baseFilePath: string, relativePath: string): string {
  // If already absolute or URL, return as is
  if (
    relativePath.startsWith('http://') ||
    relativePath.startsWith('https://') ||
    relativePath.startsWith('//') ||
    relativePath.startsWith('data:') ||
    relativePath.startsWith('blob:') ||
    relativePath.startsWith('/')
  ) {
    return relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  }

  const baseDir = baseFilePath.includes('/') ? baseFilePath.substring(0, baseFilePath.lastIndexOf('/')) : '';
  const combined = baseDir ? `${baseDir}/${relativePath}` : relativePath;
  return normalizePath(combined);
}

export class Router {
  private defaultPage: string;
  private onRouteChanged: (route: RouteInfo) => Promise<void>;

  constructor(defaultPage: string, onRouteChanged: (route: RouteInfo) => Promise<void>) {
    this.defaultPage = defaultPage;
    this.onRouteChanged = onRouteChanged;

    window.addEventListener('hashchange', () => this.handleHashChange());
  }

  public init(): void {
    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#!') {
      window.location.hash = `#!${this.defaultPage}`;
    } else {
      this.handleHashChange();
    }
  }

  public parseHash(rawHash: string): RouteInfo {
    let hash = rawHash || window.location.hash || '';
    if (hash.startsWith('#!')) {
      hash = hash.substring(2);
    } else if (hash.startsWith('#/')) {
      hash = hash.substring(2);
    } else if (hash.startsWith('#')) {
      hash = hash.substring(1);
    }

    let filePath = '';
    let anchor = '';

    const anchorIndex = hash.indexOf('#');
    if (anchorIndex !== -1) {
      filePath = decodeURIComponent(hash.substring(0, anchorIndex));
      anchor = decodeURIComponent(hash.substring(anchorIndex + 1));
    } else {
      filePath = decodeURIComponent(hash);
    }

    filePath = normalizePath(filePath);

    if (!filePath || filePath === '/' || filePath === '') {
      filePath = this.defaultPage;
    }

    const isMarkdown = Boolean(filePath.match(/\.(md|markdown|mdown)$/i));

    return { filePath, anchor, isMarkdown };
  }

  public async navigate(path: string, anchor: string = ''): Promise<void> {
    const cleanPath = normalizePath(path);
    const targetHash = anchor ? `#!${cleanPath}#${anchor}` : `#!${cleanPath}`;
    if (window.location.hash === targetHash) {
      if (anchor) {
        this.scrollToAnchor(anchor);
      }
      return;
    }
    window.location.hash = targetHash;
  }

  private async handleHashChange(): Promise<void> {
    const route = this.parseHash(window.location.hash);
    
    try {
      if ('startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
        try {
          (document as any).startViewTransition(async () => {
            try {
              await this.onRouteChanged(route);
            } catch (err) {
              console.error('[Router] Error in transition handler:', err);
            }
          });
        } catch {
          await this.onRouteChanged(route);
        }
      } else {
        await this.onRouteChanged(route);
      }
    } catch (err) {
      console.error('[Router] Error handling route change:', err);
    }

    if (route.anchor) {
      this.scrollToAnchor(route.anchor);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  public scrollToAnchor(anchorId: string): void {
    const cleanId = anchorId.replace(/^#/, '');
    setTimeout(() => {
      const el = document.getElementById(cleanId) || document.querySelector(`[name="${cleanId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  public transformLinks(container: HTMLElement, currentFilePath: string = ''): void {
    // 1. Transform Anchors
    const anchors = container.querySelectorAll<HTMLAnchorElement>('a[href]');
    anchors.forEach(a => {
      const rawHref = a.getAttribute('href');
      if (!rawHref) return;

      // External links
      if (
        rawHref.startsWith('http://') ||
        rawHref.startsWith('https://') ||
        rawHref.startsWith('//') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('javascript:')
      ) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        return;
      }

      if (rawHref.startsWith('#!') || rawHref.startsWith('#/')) {
        return;
      }

      if (rawHref.startsWith('#')) {
        // In-page section anchor
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const target = rawHref.substring(1);
          this.scrollToAnchor(target);
        });
        return;
      }

      // Check if href has section hash (e.g. guide.md#section)
      let filePart = rawHref;
      let hashPart = '';
      const hashIndex = rawHref.indexOf('#');
      if (hashIndex !== -1) {
        filePart = rawHref.substring(0, hashIndex);
        hashPart = rawHref.substring(hashIndex);
      }

      if (filePart.match(/\.(md|markdown|mdown)$/i) || !filePart.includes('.')) {
        const resolvedPath = resolvePath(currentFilePath, filePart);
        a.setAttribute('href', `#!${resolvedPath}${hashPart}`);
      }
    });

    // 2. Transform Relative Images
    const images = container.querySelectorAll<HTMLImageElement>('img[src]');
    images.forEach(img => {
      const rawSrc = img.getAttribute('src');
      if (!rawSrc) return;

      if (
        !rawSrc.startsWith('http://') &&
        !rawSrc.startsWith('https://') &&
        !rawSrc.startsWith('//') &&
        !rawSrc.startsWith('data:') &&
        !rawSrc.startsWith('blob:')
      ) {
        const resolvedSrc = resolvePath(currentFilePath, rawSrc);
        img.setAttribute('src', resolvedSrc);
      }
    });
  }
}
