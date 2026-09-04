import { VertiWikiPlugin } from '../core/pipeline';

class LightboxManager {
  private overlay: HTMLElement | null = null;
  private imageEl: HTMLImageElement | null = null;
  private captionEl: HTMLElement | null = null;

  constructor() {
    this.createDom();
  }

  private createDom(): void {
    if (typeof document === 'undefined' || !document.body) return;
    if (document.getElementById('verti-lightbox-modal')) return;

    this.overlay = document.createElement('div');
    this.overlay.id = 'verti-lightbox-modal';
    this.overlay.className = 'verti-lightbox-overlay';
    this.overlay.innerHTML = `
      <div class="verti-lightbox-backdrop"></div>
      <div class="verti-lightbox-container">
        <button class="verti-lightbox-close" aria-label="Close image lightbox">&times;</button>
        <div class="verti-lightbox-media-wrapper">
          <img class="verti-lightbox-img" src="" alt="" />
        </div>
        <div class="verti-lightbox-caption"></div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    this.imageEl = this.overlay.querySelector('.verti-lightbox-img') as HTMLImageElement;
    this.captionEl = this.overlay.querySelector('.verti-lightbox-caption') as HTMLElement;

    const closeBtn = this.overlay.querySelector('.verti-lightbox-close');
    const backdrop = this.overlay.querySelector('.verti-lightbox-backdrop');

    closeBtn?.addEventListener('click', () => this.close());
    backdrop?.addEventListener('click', () => this.close());

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  public open(src: string, alt: string = '', captionText: string = ''): void {
    if (!this.overlay) {
      this.createDom();
    }
    if (!this.overlay || !this.imageEl || !this.captionEl) return;

    this.imageEl.src = src;
    this.imageEl.alt = alt;
    this.captionEl.textContent = captionText || alt;
    this.captionEl.style.display = (captionText || alt) ? 'block' : 'none';

    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  public close(): void {
    if (!this.overlay) return;
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  public isOpen(): boolean {
    return this.overlay?.classList.contains('active') || false;
  }
}

let lightboxInstance: LightboxManager | null = null;

function getLightbox(): LightboxManager {
  if (!lightboxInstance) {
    lightboxInstance = new LightboxManager();
  }
  return lightboxInstance;
}

export const lightboxPlugin: VertiWikiPlugin = {
  name: 'lightbox',
  afterRender: (context) => {
    // Attach click listener to article images
    const images = context.container.querySelectorAll<HTMLImageElement>('img:not(.no-lightbox)');
    images.forEach(img => {
      img.classList.add('verti-zoomable-img');
      img.addEventListener('click', () => {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';
        const title = img.getAttribute('title') || '';
        if (src) {
          getLightbox().open(src, alt, title);
        }
      });
    });
  }
};
