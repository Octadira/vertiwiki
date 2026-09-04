import { Router } from '../core/router';
import { LocaleConfig } from '../core/types';
import { escapeHtml } from '../core/escape';

export class LanguageChooserDropdown {
  private container: HTMLElement;
  private dropdownMenu: HTMLElement;
  private router: Router;
  private locales: LocaleConfig[];
  private isOpen = false;

  constructor(targetHeaderRight: HTMLElement, router: Router, locales: LocaleConfig[]) {
    this.router = router;
    this.locales = locales;

    this.container = document.createElement('div');
    this.container.className = 'verti-lang-chooser-container';
    this.container.style.position = 'relative';
    this.container.style.display = 'inline-block';

    this.container.innerHTML = `
      <button class="verti-icon-btn verti-lang-btn" title="Choose Language" aria-label="Choose Language">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </button>
      <div class="verti-lang-dropdown-menu" style="display: none;"></div>
    `;

    // Insert before theme toggle or theme palette
    const targetElement = targetHeaderRight.querySelector(
      '.verti-theme-palette-btn, .verti-theme-toggle'
    );
    if (targetElement && targetElement.parentElement === targetHeaderRight) {
      targetHeaderRight.insertBefore(this.container, targetElement);
    } else {
      targetHeaderRight.appendChild(this.container);
    }

    this.dropdownMenu = this.container.querySelector('.verti-lang-dropdown-menu') as HTMLElement;

    this.setupEvents();
    this.renderMenu();
  }

  private setupEvents(): void {
    const btn = this.container.querySelector('.verti-lang-btn')!;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target as Node)) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  public toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  public open(): void {
    this.isOpen = true;
    this.renderMenu();
    this.dropdownMenu.style.display = 'block';
  }

  public close(): void {
    this.isOpen = false;
    this.dropdownMenu.style.display = 'none';
  }

  public renderMenu(): void {
    const currentLocale = this.router.getCurrentLocale();
    const activeCode = currentLocale?.code || (this.locales.find(l => l.isDefault)?.code || this.locales[0]?.code);

    this.dropdownMenu.innerHTML = `
      <div class="verti-lang-menu-header">Language / Langue</div>
      <div class="verti-lang-menu-list">
        ${this.locales.map(loc => {
          const isActive = loc.code === activeCode;
          return `
            <button class="verti-lang-item ${isActive ? 'active' : ''}" data-lang-code="${escapeHtml(loc.code)}">
              <span class="verti-lang-badge">${escapeHtml(loc.code.toUpperCase())}</span>
              <span class="verti-lang-label">${escapeHtml(loc.label)}</span>
              ${isActive ? '<span class="verti-lang-check">✓</span>' : ''}
            </button>
          `;
        }).join('')}
      </div>
    `;

    const items = this.dropdownMenu.querySelectorAll<HTMLButtonElement>('.verti-lang-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = item.getAttribute('data-lang-code');
        if (code) {
          this.router.switchLanguage(code);
          this.close();
        }
      });
    });
  }
}
