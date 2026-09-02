import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AEOEngine } from '../src/plugins/aeo';
import { DEFAULT_CONFIG } from '../src/core/config';

describe('AEOEngine & Agent Directive', () => {
  let originalDocument: any;

  beforeEach(() => {
    originalDocument = (global as any).document;
    const bodyChildren: any[] = [];

    const mockDocument: any = {
      head: {
        appendChild: () => {},
        querySelector: () => null
      },
      body: {
        firstChild: null,
        insertBefore: (newNode: any) => {
          bodyChildren.unshift(newNode);
          mockDocument.body.firstChild = newNode;
        }
      },
      querySelector: (selector: string) => {
        if (selector === '.verti-agent-directive') {
          return bodyChildren.find(el => el.className === 'verti-agent-directive') || null;
        }
        return null;
      },
      createElement: (tag: string) => {
        const el: any = {
          tagName: tag.toUpperCase(),
          className: '',
          attributes: {} as Record<string, string>,
          style: {} as Record<string, string>,
          innerHTML: '',
          setAttribute(name: string, val: string) {
            this.attributes[name] = val;
          },
          remove() {
            const idx = bodyChildren.indexOf(this);
            if (idx !== -1) bodyChildren.splice(idx, 1);
            if (mockDocument.body.firstChild === this) {
              mockDocument.body.firstChild = bodyChildren[0] || null;
            }
          }
        };
        return el;
      }
    };

    (global as any).document = mockDocument;
  });

  afterEach(() => {
    (global as any).document = originalDocument;
  });

  it('injects agent directive with default /llms.txt', () => {
    new AEOEngine({ ...DEFAULT_CONFIG });
    const directive = (global as any).document.querySelector('.verti-agent-directive');
    expect(directive).not.toBeNull();
    expect(directive.innerHTML).toContain('/llms.txt');
    expect(directive.innerHTML).toContain('For AI coding agents');
  });

  it('injects custom llmsTxtUrl when configured', () => {
    new AEOEngine({ ...DEFAULT_CONFIG, llmsTxtUrl: 'https://example.com/custom-llms.txt' });
    const directive = (global as any).document.querySelector('.verti-agent-directive');
    expect(directive).not.toBeNull();
    expect(directive.innerHTML).toContain('https://example.com/custom-llms.txt');
  });

  it('removes agent directive when llmsTxtUrl is null or empty', () => {
    new AEOEngine({ ...DEFAULT_CONFIG, llmsTxtUrl: null });
    const directive = (global as any).document.querySelector('.verti-agent-directive');
    expect(directive).toBeNull();
  });
});
