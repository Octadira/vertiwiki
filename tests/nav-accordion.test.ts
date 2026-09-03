import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { navAccordionPlugin } from '../src/plugins/nav-accordion';
import { DEFAULT_CONFIG } from '../src/core/config';
import { PluginContext } from '../src/core/pipeline';

describe('navAccordionPlugin', () => {
  let originalDocument: any;

  beforeEach(() => {
    originalDocument = (global as any).document;
  });

  afterEach(() => {
    (global as any).document = originalDocument;
  });

  it('skips processing if collapsibleNavigation is false', () => {
    const querySpy = vi.fn();
    (global as any).document = { querySelector: querySpy };

    const context: PluginContext = {
      filePath: 'docs/guide.md',
      rawMarkdown: '',
      config: { ...DEFAULT_CONFIG, collapsibleNavigation: false },
      container: {} as any
    };

    navAccordionPlugin.afterRender!(context);
    expect(querySpy).not.toHaveBeenCalled();
  });

  it('finds active link and expands ancestor accordion branches', () => {
    const toggleBtn = {
      setAttribute: vi.fn()
    };

    const accordionParent = {
      classList: { add: vi.fn() },
      querySelector: vi.fn().mockReturnValue(toggleBtn),
      parentElement: null
    };

    const activeLink = {
      closest: vi.fn().mockReturnValue(accordionParent)
    };

    (global as any).document = {
      querySelector: vi.fn().mockReturnValue(activeLink)
    };

    const context: PluginContext = {
      filePath: 'docs/guide.md',
      rawMarkdown: '',
      config: { ...DEFAULT_CONFIG, collapsibleNavigation: true },
      container: {} as any
    };

    navAccordionPlugin.afterRender!(context);

    expect(accordionParent.classList.add).toHaveBeenCalledWith('expanded');
    expect(toggleBtn.setAttribute).toHaveBeenCalledWith('aria-expanded', 'true');
  });
});
