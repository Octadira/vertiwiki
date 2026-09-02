import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mermaidPlugin } from '../src/plugins/mermaid';
import { PluginContext } from '../src/core/pipeline';
import mermaid from 'mermaid';

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg class="mock-diagram"></svg>' })
  }
}));

describe('Mermaid Plugin Integration', () => {
  let originalDocument: any;

  beforeEach(() => {
    vi.clearAllMocks();
    originalDocument = (global as any).document;
  });

  afterEach(() => {
    (global as any).document = originalDocument;
  });

  it('skips rendering when enableMermaid is false', async () => {
    const context: PluginContext = {
      filePath: 'test.md',
      rawMarkdown: '',
      config: { enableMermaid: false } as any,
      container: {
        querySelectorAll: vi.fn()
      } as any
    };

    await mermaidPlugin.afterRender?.(context);
    expect(mermaid.initialize).not.toHaveBeenCalled();
    expect(mermaid.render).not.toHaveBeenCalled();
  });

  it('initializes and renders mermaid diagrams dynamically with theme detection', async () => {
    const mockCode = {
      textContent: 'graph LR\nMarkdown[Raw Markdown] --> Parser[Marked Engine]',
      parentElement: {
        replaceWith: vi.fn()
      }
    };

    const mockContainer = {
      querySelectorAll: vi.fn().mockReturnValue([mockCode])
    };

    const mockDoc = {
      documentElement: {
        getAttribute: vi.fn().mockReturnValue('dark')
      },
      createElement: vi.fn().mockImplementation((tag) => ({
        className: '',
        innerHTML: ''
      }))
    };

    (global as any).document = mockDoc;

    const context: PluginContext = {
      filePath: 'test.md',
      rawMarkdown: '',
      config: { enableMermaid: true } as any,
      container: mockContainer as any
    };

    await mermaidPlugin.afterRender?.(context);

    expect(mermaid.initialize).toHaveBeenCalledWith(expect.objectContaining({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose'
    }));
    expect(mermaid.render).toHaveBeenCalled();
    expect(mockCode.parentElement.replaceWith).toHaveBeenCalled();
  });
});
