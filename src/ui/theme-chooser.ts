import { ThemeManager } from './theme';

export class ThemeChooserDropdown {
  private container: HTMLElement;
  private dropdownMenu: HTMLElement;
  private themeManager: ThemeManager;
  private isOpen = false;

  constructor(targetHeaderRight: HTMLElement, themeManager: ThemeManager) {
    this.themeManager = themeManager;

    this.container = document.createElement('div');
    this.container.className = 'verti-theme-chooser-container cortex-theme-chooser-container omni-theme-chooser-container';
    this.container.style.position = 'relative';
    this.container.style.display = 'inline-block';

    this.container.innerHTML = `
      <button class="verti-icon-btn verti-theme-palette-btn cortex-icon-btn cortex-theme-palette-btn" title="Choose Color Theme" aria-label="Choose Color Theme">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
        </svg>
      </button>
      <div class="verti-theme-dropdown-menu cortex-theme-dropdown-menu omni-theme-dropdown-menu" style="display: none;"></div>
    `;

    targetHeaderRight.insertBefore(
      this.container,
      targetHeaderRight.querySelector('.verti-theme-toggle, .cortex-theme-toggle, .omni-theme-toggle')
    );

    this.dropdownMenu = (
      this.container.querySelector('.verti-theme-dropdown-menu') ||
      this.container.querySelector('.cortex-theme-dropdown-menu') ||
      this.container.querySelector('.omni-theme-dropdown-menu')
    ) as HTMLElement;

    this.setupEvents();
    this.renderMenu();
  }

  private setupEvents(): void {
    const btn = this.container.querySelector('.verti-theme-palette-btn, .cortex-theme-palette-btn, .omni-theme-palette-btn')!;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target as Node)) {
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

  private renderMenu(): void {
    const themes = this.themeManager.getAvailableThemes();
    const currentPreset = this.themeManager.getPreset();

    this.dropdownMenu.innerHTML = `
      <div class="verti-theme-menu-header cortex-theme-menu-header omni-theme-menu-header">Select Theme Palette</div>
      <div class="verti-theme-menu-list cortex-theme-menu-list omni-theme-menu-list">
        ${themes.map(t => {
          const isActive = t.id === currentPreset;
          return `
            <button class="verti-theme-item cortex-theme-item omni-theme-item ${isActive ? 'active' : ''}" data-theme-id="${t.id}">
              <span class="verti-theme-color-dot cortex-theme-color-dot omni-theme-color-dot" style="background-color: ${t.previewColor};"></span>
              <span class="verti-theme-name cortex-theme-name omni-theme-name">${t.name}</span>
              ${isActive ? '<span class="verti-theme-check cortex-theme-check omni-theme-check">✓</span>' : ''}
            </button>
          `;
        }).join('')}
      </div>
    `;

    const items = this.dropdownMenu.querySelectorAll<HTMLButtonElement>('.verti-theme-item, .cortex-theme-item, .omni-theme-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeId = item.getAttribute('data-theme-id');
        if (themeId) {
          this.themeManager.setPreset(themeId);
          this.renderMenu();
          this.close();
        }
      });
    });
  }
}
