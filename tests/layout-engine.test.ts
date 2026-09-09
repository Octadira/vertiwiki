import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Layout } from '../src/ui/layout';
import { VertiWikiConfig } from '../src/core/types';
import { DEFAULT_CONFIG } from '../src/core/config';
import { tabsPlugin } from '../src/plugins/tabs';

function createMockElement(tag: string = 'div') {
  const attrs: Record<string, string> = {};
  const classes = new Set<string>();
  const listeners: Record<string, Function[]> = {};

  const el: any = {
    tagName: tag.toUpperCase(),
    id: '',
    className: '',
    innerHTML: '',
    style: {},
    setAttribute: vi.fn((key: string, val: string) => {
      attrs[key] = String(val);
      if (key === 'id') el.id = val;
    }),
    getAttribute: vi.fn((key: string) => attrs[key] || null),
    classList: {
      add: vi.fn((c: string) => classes.add(c)),
      remove: vi.fn((c: string) => classes.delete(c)),
      contains: vi.fn((c: string) => classes.has(c))
    },
    addEventListener: vi.fn((ev: string, fn: Function) => {
      listeners[ev] = listeners[ev] || [];
      listeners[ev].push(fn);
    }),
    click: vi.fn(() => {
      (listeners['click'] || []).forEach(fn => fn());
    }),
    querySelector: vi.fn(),
    querySelectorAll: vi.fn().mockReturnValue([]),
    remove: vi.fn()
  };
  return el;
}

describe('Layout Engine & Non-Technical Ergonomics', () => {
  let originalDocument: any;
  let mockApp: any;
  let mockContent: any;
  let mockToc: any;
  let mockNav: any;
  let mockSidebar: any;
  let mockBackdrop: any;

  beforeEach(() => {
    originalDocument = (global as any).document;

    mockApp = createMockElement('div');
    mockApp.id = 'verti-app';

    mockContent = createMockElement('article');
    mockContent.id = 'verti-content';

    mockToc = createMockElement('aside');
    mockToc.id = 'verti-toc';

    mockNav = createMockElement('nav');
    mockSidebar = createMockElement('aside');
    mockBackdrop = createMockElement('div');

    mockApp.querySelector = vi.fn((sel: string) => {
      if (sel === '.verti-sidebar-nav') return mockNav;
      if (sel === '.verti-sidebar') return mockSidebar;
      if (sel === '.verti-sidebar-backdrop') return mockBackdrop;
      return createMockElement('div');
    });

    (global as any).document = {
      getElementById: vi.fn((id: string) => {
        if (id === 'verti-app') return mockApp;
        if (id === 'verti-content') return mockContent;
        if (id === 'verti-toc') return mockToc;
        return null;
      }),
      head: { appendChild: vi.fn() },
      createElement: vi.fn((tag: string) => createMockElement(tag))
    };
  });

  afterEach(() => {
    (global as any).document = originalDocument;
  });

  it('sets data-layout and data-content-width on app container', () => {
    const config: VertiWikiConfig = {
      ...DEFAULT_CONFIG,
      layoutMode: 'book',
      contentWidth: 'readable'
    };

    const layout = new Layout(config);
    expect(mockApp.setAttribute).toHaveBeenCalledWith('data-layout', 'book');
    expect(mockApp.setAttribute).toHaveBeenCalledWith('data-content-width', 'readable');
    expect(layout.getLayoutMode()).toBe('book');
    expect(layout.getContentWidth()).toBe('readable');

    // Dynamically change layout and content width (e.g. from frontmatter)
    layout.setLayoutMode('api');
    layout.setContentWidth('full');
    expect(mockApp.setAttribute).toHaveBeenCalledWith('data-layout', 'api');
    expect(mockApp.setAttribute).toHaveBeenCalledWith('data-content-width', 'full');
  });

  it('renders custom headerLinks in header navigation', () => {
    const config: VertiWikiConfig = {
      ...DEFAULT_CONFIG,
      headerLinks: [
        { title: 'Main App', href: 'https://app.example.com', isExternal: true },
        { title: 'Sign In', href: '/login', type: 'button' }
      ]
    };

    new Layout(config);
    expect(mockApp.innerHTML).toContain('class="verti-header-links"');
    expect(mockApp.innerHTML).toContain('Main App');
    expect(mockApp.innerHTML).toContain('href="https://app.example.com"');
    expect(mockApp.innerHTML).toContain('target="_blank"');
    expect(mockApp.innerHTML).toContain('verti-header-link-btn');
    expect(mockApp.innerHTML).toContain('Sign In');
  });

  it('conditionally hides the AI copy button when enableAiCopy is false', () => {
    const nonTechConfig: VertiWikiConfig = {
      ...DEFAULT_CONFIG,
      enableAiCopy: false
    };

    new Layout(nonTechConfig);
    expect(mockApp.innerHTML).not.toContain('id="verti-ai-copy-btn"');
  });

  it('shows the AI copy button by default when enableAiCopy is true', () => {
    const techConfig: VertiWikiConfig = {
      ...DEFAULT_CONFIG,
      enableAiCopy: true
    };

    new Layout(techConfig);
    expect(mockApp.innerHTML).toContain('id="verti-ai-copy-btn"');
  });
});

describe('Tabs Synchronization Plugin', () => {
  it('adds data-tab-title attribute to generated buttons', () => {
    const markdown = `
::: tabs
== cURL
curl https://api.example.com
== Python
import requests
:::
`;

    const transformed = tabsPlugin.beforeParse!(markdown, {
      filePath: 'test.md',
      config: DEFAULT_CONFIG,
      container: {} as any
    });

    expect(transformed).toContain('data-tab-title="cURL"');
    expect(transformed).toContain('data-tab-title="Python"');
  });

  it('synchronizes tabs on click across containers', async () => {
    const btnCurl1 = createMockElement('button');
    btnCurl1.setAttribute('data-tab-title', 'cURL');
    btnCurl1.setAttribute('data-tab-target', 'panel-curl-1');
    btnCurl1.classList.add('active');

    const btnPython1 = createMockElement('button');
    btnPython1.setAttribute('data-tab-title', 'Python');
    btnPython1.setAttribute('data-tab-target', 'panel-python-1');

    const panel1 = createMockElement('div');

    const container1 = createMockElement('div');
    container1.querySelectorAll = vi.fn((sel: string) => {
      if (sel.includes('verti-tab-btn')) return [btnCurl1, btnPython1];
      if (sel.includes('verti-tab-panel')) return [panel1];
      return [];
    });

    const btnCurl2 = createMockElement('button');
    btnCurl2.setAttribute('data-tab-title', 'cURL');
    btnCurl2.setAttribute('data-tab-target', 'panel-curl-2');
    btnCurl2.classList.add('active');

    const btnPython2 = createMockElement('button');
    btnPython2.setAttribute('data-tab-title', 'Python');
    btnPython2.setAttribute('data-tab-target', 'panel-python-2');

    const panel2 = createMockElement('div');

    const container2 = createMockElement('div');
    container2.querySelectorAll = vi.fn((sel: string) => {
      if (sel.includes('verti-tab-btn')) return [btnCurl2, btnPython2];
      if (sel.includes('verti-tab-panel')) return [panel2];
      return [];
    });

    const rootContainer = createMockElement('div');
    rootContainer.querySelectorAll = vi.fn((sel: string) => {
      if (sel.includes('verti-tabs-container')) return [container1, container2];
      return [];
    });

    await tabsPlugin.afterRender!({
      filePath: 'test.md',
      config: DEFAULT_CONFIG,
      container: rootContainer
    });

    // Verify listeners attached
    expect(btnPython1.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));

    // Simulate clicking Python on container1
    btnPython1.click();

    // Verify container1 activated Python
    expect(btnPython1.classList.add).toHaveBeenCalledWith('active');
    expect(btnCurl1.classList.remove).toHaveBeenCalledWith('active');

    // Verify container2 synchronized to Python
    expect(btnPython2.classList.add).toHaveBeenCalledWith('active');
    expect(btnCurl2.classList.remove).toHaveBeenCalledWith('active');
  });
});
