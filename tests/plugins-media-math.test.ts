import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mathPlugin } from '../src/plugins/math';
import { mediaPlugin } from '../src/plugins/media';
import { PluginContext } from '../src/core/pipeline';
import { DEFAULT_CONFIG } from '../src/core/config';
import katex from 'katex';

vi.mock('katex', () => ({
  default: {
    render: vi.fn()
  }
}));

describe('mathPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('skips processing if enableMath is false in config', () => {
    const mockContainer = {
      querySelectorAll: vi.fn()
    };
    const context: PluginContext = {
      filePath: 'test.md',
      rawMarkdown: '',
      config: { ...DEFAULT_CONFIG, enableMath: false },
      container: mockContainer as any
    };

    mathPlugin.afterRender!(context);
    expect(mockContainer.querySelectorAll).not.toHaveBeenCalled();
    expect(katex.render).not.toHaveBeenCalled();
  });

  it('renders pre code.language-math code blocks with KaTeX display mode', () => {
    const mockPre = {
      replaceWith: vi.fn()
    };
    const mockCode = {
      textContent: '\\frac{a}{b}',
      parentElement: mockPre
    };

    const mockDoc = {
      createElement: vi.fn().mockImplementation(() => ({
        className: '',
        style: {}
      })),
      createTreeWalker: vi.fn().mockReturnValue({
        nextNode: vi.fn().mockReturnValue(null)
      })
    };
    (global as any).document = mockDoc;
    (global as any).NodeFilter = {
      SHOW_TEXT: 4,
      FILTER_REJECT: 2,
      FILTER_ACCEPT: 1
    };

    const mockContainer = {
      querySelectorAll: vi.fn().mockImplementation((sel: string) => {
        if (sel.includes('code.language-math')) return [mockCode];
        return [];
      })
    };

    const context: PluginContext = {
      filePath: 'test.md',
      rawMarkdown: '',
      config: { ...DEFAULT_CONFIG, enableMath: true },
      container: mockContainer as any
    };

    mathPlugin.afterRender!(context);
    expect(katex.render).toHaveBeenCalledWith(
      '\\frac{a}{b}',
      expect.anything(),
      expect.objectContaining({ displayMode: true })
    );
    expect(mockPre.replaceWith).toHaveBeenCalled();
  });
});

describe('mediaPlugin', () => {
  let originalDocument: any;

  beforeEach(() => {
    originalDocument = (global as any).document;
  });

  afterEach(() => {
    (global as any).document = originalDocument;
  });

  it('transforms standalone YouTube links into responsive embed iframes', () => {
    const mockParentP = {
      tagName: 'P',
      children: [{}],
      textContent: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      replaceWith: vi.fn()
    };

    const mockAnchor = {
      getAttribute: vi.fn().mockReturnValue('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
      textContent: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      parentElement: mockParentP
    };

    const mockDoc = {
      createElement: vi.fn().mockImplementation(() => ({
        className: '',
        style: {},
        innerHTML: ''
      }))
    };
    (global as any).document = mockDoc;

    const mockContainer = {
      querySelectorAll: vi.fn().mockReturnValue([mockAnchor])
    };

    const context: PluginContext = {
      filePath: 'test.md',
      rawMarkdown: '',
      config: { ...DEFAULT_CONFIG },
      container: mockContainer as any
    };

    mediaPlugin.afterRender!(context);
    expect(mockParentP.replaceWith).toHaveBeenCalled();
    const createdWrapper = mockParentP.replaceWith.mock.calls[0][0];
    expect(createdWrapper.innerHTML).toContain('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });

  it('also transforms youtu.be shortlinks', () => {
    const mockParentP = {
      tagName: 'P',
      children: [{}],
      textContent: 'https://youtu.be/dQw4w9WgXcQ',
      replaceWith: vi.fn()
    };

    const mockAnchor = {
      getAttribute: vi.fn().mockReturnValue('https://youtu.be/dQw4w9WgXcQ'),
      textContent: 'https://youtu.be/dQw4w9WgXcQ',
      parentElement: mockParentP
    };

    (global as any).document = {
      createElement: vi.fn().mockImplementation(() => ({
        className: '',
        style: {},
        innerHTML: ''
      }))
    };

    const context: PluginContext = {
      filePath: 'test.md',
      rawMarkdown: '',
      config: { ...DEFAULT_CONFIG },
      container: {
        querySelectorAll: vi.fn().mockReturnValue([mockAnchor])
      } as any
    };

    mediaPlugin.afterRender!(context);
    expect(mockParentP.replaceWith).toHaveBeenCalled();
    const createdWrapper = mockParentP.replaceWith.mock.calls[0][0];
    expect(createdWrapper.innerHTML).toContain('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });

  it('ignores inline normal anchors embedded inside larger text', () => {
    const mockParentP = {
      tagName: 'P',
      children: [{}, {}], // Multiple children
      textContent: 'Check out this video: https://youtu.be/dQw4w9WgXcQ for more information.',
      replaceWith: vi.fn()
    };

    const mockAnchor = {
      getAttribute: vi.fn().mockReturnValue('https://youtu.be/dQw4w9WgXcQ'),
      textContent: 'video',
      parentElement: mockParentP,
      replaceWith: vi.fn()
    };

    const context: PluginContext = {
      filePath: 'test.md',
      rawMarkdown: '',
      config: { ...DEFAULT_CONFIG },
      container: {
        querySelectorAll: vi.fn().mockReturnValue([mockAnchor])
      } as any
    };

    mediaPlugin.afterRender!(context);
    expect(mockParentP.replaceWith).not.toHaveBeenCalled();
    expect(mockAnchor.replaceWith).not.toHaveBeenCalled();
  });
});
