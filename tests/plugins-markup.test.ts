import { describe, it, expect, vi } from 'vitest';
import { badgePlugin } from '../src/plugins/badge';
import { calloutsPlugin } from '../src/plugins/callouts';
import { detailsPlugin } from '../src/plugins/details';
import { tabsPlugin } from '../src/plugins/tabs';
import { wikilinksPlugin } from '../src/plugins/wikilinks';
import { DEFAULT_CONFIG } from '../src/core/config';
import { PluginContext } from '../src/core/pipeline';

describe('badgePlugin', () => {
  it('transforms default badge without type attribute to info badge', () => {
    const md = 'Here is a :badge[Default Badge] in text.';
    const result = badgePlugin.beforeParse!(md, {} as any) as string;
    expect(result).toContain('<span class="verti-badge verti-badge-info');
    expect(result).toContain('>Default Badge</span>');
  });

  it('transforms badge with explicit type attribute', () => {
    const md = ':badge[Success]{type=success} and :badge[Danger]{type=danger}';
    const result = badgePlugin.beforeParse!(md, {} as any) as string;
    expect(result).toContain('verti-badge-success');
    expect(result).toContain('verti-badge-danger');
  });
});

describe('detailsPlugin', () => {
  it('transforms collapsed details block syntax into semantic HTML details', () => {
    const md = `::: details Click to expand\nHidden content inside.\n:::`;
    const result = detailsPlugin.beforeParse!(md, {} as any) as string;
    expect(result).toContain('<details class="verti-details">');
    expect(result).toContain('<summary class="verti-details-summary">Click to expand</summary>');
    expect(result).toContain('Hidden content inside.');
    expect(result).not.toContain(' open>');
  });

  it('transforms open details block syntax with open attribute', () => {
    const md = `::: details:open Always Visible\nOpen content inside.\n:::`;
    const result = detailsPlugin.beforeParse!(md, {} as any) as string;
    expect(result).toContain('<details class="verti-details" open>');
    expect(result).toContain('Always Visible');
  });
});

describe('tabsPlugin', () => {
  it('transforms tabs syntax into tab headers and panels', () => {
    const md = `::: tabs
== TypeScript
\`\`\`ts
const x: number = 42;
\`\`\`
== JavaScript
\`\`\`js
const x = 42;
\`\`\`
:::`;

    const result = tabsPlugin.beforeParse!(md, {} as any) as string;
    expect(result).toContain('class="verti-tabs-container');
    expect(result).toContain('<button class="verti-tab-btn active"');
    expect(result).toContain('TypeScript</button>');
    expect(result).toContain('JavaScript</button>');
    expect(result).toContain('class="verti-tab-panel active"');
    expect(result).toContain('const x: number = 42;');
  });

  it('attaches interactive tab switching handlers in afterRender', () => {
    const activeBtn = {
      getAttribute: vi.fn().mockReturnValue('tab-panel-1'),
      classList: { add: vi.fn(), remove: vi.fn() },
      addEventListener: vi.fn()
    };
    const targetPanel = {
      classList: { add: vi.fn(), remove: vi.fn() }
    };
    const mockContainer = {
      querySelectorAll: vi.fn().mockImplementation((sel: string) => {
        if (sel.includes('verti-tabs-container')) {
          return [{
            querySelectorAll: vi.fn().mockImplementation((subSel: string) => {
              if (subSel.includes('verti-tab-btn')) return [activeBtn];
              if (subSel.includes('verti-tab-panel')) return [targetPanel];
              return [];
            }),
            querySelector: vi.fn().mockReturnValue(targetPanel)
          }];
        }
        return [];
      })
    };

    const context: PluginContext = {
      filePath: 'test.md',
      rawMarkdown: '',
      config: { ...DEFAULT_CONFIG },
      container: mockContainer as any
    };

    tabsPlugin.afterRender!(context);
    expect(activeBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));

    // Simulate click event
    const clickHandler = activeBtn.addEventListener.mock.calls[0][1];
    clickHandler();
    expect(activeBtn.classList.add).toHaveBeenCalledWith('active');
    expect(targetPanel.classList.add).toHaveBeenCalledWith('active');
  });
});

describe('wikilinksPlugin', () => {
  it('converts simple [[Page]] into markdown link [Page](Page.md)', () => {
    const md = 'Refer to [[architecture]] for details.';
    const result = wikilinksPlugin.beforeParse!(md, {} as any) as string;
    expect(result).toBe('Refer to [architecture](architecture.md) for details.');
  });

  it('converts [[Page|Custom Label]] into [Custom Label](Page.md)', () => {
    const md = 'Check [[docs/guides/authoring|the authoring guide]] now.';
    const result = wikilinksPlugin.beforeParse!(md, {} as any) as string;
    expect(result).toBe('Check [the authoring guide](docs/guides/authoring.md) now.');
  });

  it('converts [[Page#section|Label]] with anchors correctly', () => {
    const md = 'See [[features#tabs|Tab System]].';
    const result = wikilinksPlugin.beforeParse!(md, {} as any) as string;
    expect(result).toBe('See [Tab System](features.md#tabs).');
  });

  it('does NOT alter wikilink syntax inside code fences or inline backticks', () => {
    const md = `
Inline code: \`[[NotALink]]\`
Fenced code:
\`\`\`markdown
[[AlsoNotALink|Keep literal]]
\`\`\`
Real link: [[real-page]]
`;
    const result = wikilinksPlugin.beforeParse!(md, {} as any) as string;
    expect(result).toContain('`[[NotALink]]`');
    expect(result).toContain('[[AlsoNotALink|Keep literal]]');
    expect(result).toContain('[real-page](real-page.md)');
  });
});

describe('calloutsPlugin', () => {
  it('replaces blockquotes having GFM [!NOTE], [!TIP], [!WARNING] with callout card HTML', () => {
    const bq = {
      querySelector: vi.fn().mockReturnValue({
        innerHTML: '[!WARNING] Be careful with this operation!'
      }),
      innerHTML: '<p>[!WARNING] Be careful with this operation!</p>',
      replaceWith: vi.fn()
    };

    const mockDoc = {
      createElement: vi.fn().mockImplementation(() => ({
        className: '',
        innerHTML: ''
      }))
    };
    (global as any).document = mockDoc;

    const mockContainer = {
      querySelectorAll: vi.fn().mockImplementation((sel: string) => {
        if (sel === 'blockquote') return [bq];
        return [];
      })
    };

    const context: PluginContext = {
      filePath: 'test.md',
      rawMarkdown: '',
      config: { ...DEFAULT_CONFIG },
      container: mockContainer as any
    };

    calloutsPlugin.afterRender!(context);
    expect(bq.replaceWith).toHaveBeenCalled();
  });
});
