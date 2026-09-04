import { SearchResultItem } from '../core/types';
import { escapeHtml } from '../core/escape';

export class SearchModal {
  private dialog: HTMLDialogElement;
  private input: HTMLInputElement;
  private resultsContainer: HTMLUListElement;
  private results: SearchResultItem[] = [];
  private selectedIndex = -1;
  private onSearchQuery: (query: string) => SearchResultItem[];
  private onSelectResult: (result: SearchResultItem) => void;

  constructor(
    onSearchQuery: (query: string) => SearchResultItem[],
    onSelectResult: (result: SearchResultItem) => void
  ) {
    this.onSearchQuery = onSearchQuery;
    this.onSelectResult = onSelectResult;

    this.dialog = document.createElement('dialog');
    this.dialog.className = 'verti-search-dialog';
    this.dialog.innerHTML = `
      <div class="verti-search-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" class="verti-search-input" placeholder="Search documentation, guides, and pages..." autofocus />
      </div>
      <ul class="verti-search-results"></ul>
      <div class="verti-search-footer">
        <span>Navigate with <kbd>↑</kbd> <kbd>↓</kbd></span>
        <span>Select with <kbd>↵</kbd></span>
        <span>Close with <kbd>esc</kbd></span>
      </div>
    `;

    document.body.appendChild(this.dialog);

    this.input = this.dialog.querySelector('.verti-search-input') as HTMLInputElement;
    this.resultsContainer = this.dialog.querySelector('.verti-search-results') as HTMLUListElement;

    this.setupEvents();
  }

  public open(): void {
    this.dialog.showModal();
    this.input.value = '';
    this.results = [];
    this.selectedIndex = -1;
    this.renderResults();
    setTimeout(() => this.input.focus(), 50);
  }

  public close(): void {
    this.dialog.close();
  }

  private setupEvents(): void {
    // Backdrop click closes dialog
    this.dialog.addEventListener('click', (e) => {
      const rect = this.dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        this.close();
      }
    });

    // Keyboard shortcut Cmd+K / Ctrl+K / '/'
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.dialog.open ? this.close() : this.open();
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        this.open();
      }
    });

    // Input search typing
    this.input.addEventListener('input', () => {
      const query = this.input.value.trim();
      this.results = this.onSearchQuery(query);
      this.selectedIndex = this.results.length > 0 ? 0 : -1;
      this.renderResults();
    });

    // Keyboard navigation inside search dialog
    this.dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.results.length > 0) {
          this.selectedIndex = (this.selectedIndex + 1) % this.results.length;
          this.updateSelection();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.results.length > 0) {
          this.selectedIndex = (this.selectedIndex - 1 + this.results.length) % this.results.length;
          this.updateSelection();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.selectedIndex >= 0 && this.selectedIndex < this.results.length) {
          const selected = this.results[this.selectedIndex];
          this.close();
          this.onSelectResult(selected);
        }
      }
    });
  }

  private renderResults(): void {
    if (this.input.value.trim() === '') {
      this.resultsContainer.innerHTML = `
        <li style="padding: 2rem; text-align: center; color: var(--verti-text-muted); font-size: 0.9rem;">
          Type a query to search through the wiki...
        </li>
      `;
      return;
    }

    if (this.results.length === 0) {
      this.resultsContainer.innerHTML = `
        <li style="padding: 2rem; text-align: center; color: var(--verti-text-muted); font-size: 0.9rem;">
          No matching results found.
        </li>
      `;
      return;
    }

    this.resultsContainer.innerHTML = this.results.map((r, idx) => `
      <li class="verti-search-result-item ${idx === this.selectedIndex ? 'selected' : ''}" data-index="${idx}">
        <div class="verti-search-result-title">${escapeHtml(r.title)}</div>
        <div class="verti-search-result-snippet">${escapeHtml(r.snippet)}</div>
      </li>
    `).join('');

    const items = this.resultsContainer.querySelectorAll<HTMLLIElement>('.verti-search-result-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index') || '0', 10);
        const selected = this.results[idx];
        if (selected) {
          this.close();
          this.onSelectResult(selected);
        }
      });
    });
  }

  private updateSelection(): void {
    const items = this.resultsContainer.querySelectorAll<HTMLLIElement>('.verti-search-result-item');
    items.forEach((item, idx) => {
      item.classList.toggle('selected', idx === this.selectedIndex);
      if (idx === this.selectedIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }
}
