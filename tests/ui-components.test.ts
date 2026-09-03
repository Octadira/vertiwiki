import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PrevNextNavigation } from '../src/ui/prev-next';
import { TableOfContents } from '../src/ui/toc';
import { NavigationItem } from '../src/core/types';

describe('PrevNextNavigation Component', () => {
  let mockParent: any;
  let mockNavEl: any;

  beforeEach(() => {
    mockNavEl = {
      id: 'verti-prev-next-nav',
      className: '',
      setAttribute: vi.fn(),
      style: {},
      innerHTML: '',
      querySelectorAll: vi.fn().mockReturnValue([])
    };

    mockParent = {
      querySelector: vi.fn().mockReturnValue(mockNavEl),
      appendChild: vi.fn()
    };

    (global as any).document = {
      createElement: vi.fn().mockReturnValue(mockNavEl)
    };
  });

  it('hides container when flat links list has <= 1 page', () => {
    const prevNext = new PrevNextNavigation(mockParent);
    const navItems: NavigationItem[] = [
      { title: 'Single Page', href: 'index.md' }
    ];

    prevNext.update(navItems, 'index.md');
    expect(mockNavEl.style.display).toBe('none');
  });

  it('renders only Next link for first article', () => {
    const prevNext = new PrevNextNavigation(mockParent);
    const navItems: NavigationItem[] = [
      { title: 'Page 1', href: 'page1.md' },
      { title: 'Page 2', href: 'page2.md' },
      { title: 'Page 3', href: 'page3.md' }
    ];

    prevNext.update(navItems, 'page1.md');
    expect(mockNavEl.style.display).toBe('grid');
    expect(mockNavEl.innerHTML).toContain('Next Page →');
    expect(mockNavEl.innerHTML).toContain('Page 2');
    expect(mockNavEl.innerHTML).toContain('verti-prev-next-placeholder');
  });

  it('renders both Previous and Next links for middle article', () => {
    const prevNext = new PrevNextNavigation(mockParent);
    const navItems: NavigationItem[] = [
      { title: 'Page 1', href: 'page1.md' },
      { title: 'Page 2', href: 'page2.md' },
      { title: 'Page 3', href: 'page3.md' }
    ];

    prevNext.update(navItems, 'page2.md');
    expect(mockNavEl.innerHTML).toContain('← Previous Page');
    expect(mockNavEl.innerHTML).toContain('Page 1');
    expect(mockNavEl.innerHTML).toContain('Next Page →');
    expect(mockNavEl.innerHTML).toContain('Page 3');
  });

  it('renders only Previous link for last article', () => {
    const prevNext = new PrevNextNavigation(mockParent);
    const navItems: NavigationItem[] = [
      { title: 'Page 1', href: 'page1.md' },
      { title: 'Page 2', href: 'page2.md' }
    ];

    prevNext.update(navItems, 'page2.md');
    expect(mockNavEl.innerHTML).toContain('← Previous Page');
    expect(mockNavEl.innerHTML).toContain('Page 1');
    expect(mockNavEl.innerHTML).not.toContain('Next Page →');
  });
});

describe('TableOfContents Component', () => {
  beforeEach(() => {
    (global as any).IntersectionObserver = class {
      observe = vi.fn();
      disconnect = vi.fn();
    };
  });

  it('clears container and marks empty if article has no h2 or h3 headings', () => {
    const mockContainer: any = {
      classList: { add: vi.fn(), remove: vi.fn() },
      innerHTML: '',
      querySelectorAll: vi.fn().mockReturnValue([])
    };

    const mockArticle: any = {
      querySelectorAll: vi.fn().mockReturnValue([])
    };

    const toc = new TableOfContents(mockContainer);
    toc.update(mockArticle);

    expect(mockContainer.classList.add).toHaveBeenCalledWith('empty');
    expect(mockContainer.innerHTML).toBe('');
  });

  it('renders table of contents list for h2 and h3 headings', () => {
    const mockContainer: any = {
      classList: { add: vi.fn(), remove: vi.fn() },
      innerHTML: '',
      querySelectorAll: vi.fn().mockReturnValue([])
    };

    const h2 = {
      id: 'section-one',
      tagName: 'H2',
      textContent: 'Section One',
      cloneNode: vi.fn().mockReturnValue({
        textContent: 'Section One',
        querySelectorAll: vi.fn().mockReturnValue([])
      })
    };

    const h3 = {
      id: 'sub-section',
      tagName: 'H3',
      textContent: 'Sub Section',
      cloneNode: vi.fn().mockReturnValue({
        textContent: 'Sub Section',
        querySelectorAll: vi.fn().mockReturnValue([])
      })
    };

    const mockArticle: any = {
      querySelectorAll: vi.fn().mockReturnValue([h2, h3])
    };

    const toc = new TableOfContents(mockContainer);
    toc.update(mockArticle);

    expect(mockContainer.classList.remove).toHaveBeenCalledWith('empty');
    expect(mockContainer.innerHTML).toContain('On this page');
    expect(mockContainer.innerHTML).toContain('href="#section-one"');
    expect(mockContainer.innerHTML).toContain('href="#sub-section"');
    expect(mockContainer.innerHTML).toContain('level-2');
    expect(mockContainer.innerHTML).toContain('level-3');
  });
});
