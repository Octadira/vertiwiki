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

  it('injects agent directive with default llms.txt', () => {
    new AEOEngine({ ...DEFAULT_CONFIG });
    const directive = (global as any).document.querySelector('.verti-agent-directive');
    expect(directive).not.toBeNull();
    expect(directive.innerHTML).toContain('href="./llms.txt"');
    expect(directive.innerHTML).toContain('/llms.txt</a>');
    expect(directive.innerHTML).toContain('For AI coding agents');
  });

  it('matches AgentDocsSpec regex requirements for html directive', () => {
    new AEOEngine({ ...DEFAULT_CONFIG });
    const directive = (global as any).document.querySelector('.verti-agent-directive');
    const LINK_PATTERN = /<a\s[^>]*href\s*=\s*["']([^"']*\/llms\.txt(?:[?#][^"']*)?)["'][^>]*>[\s\S]*?<\/a>/gi;
    const TEXT_PATTERN = /\/llms\.txt/gi;
    expect(LINK_PATTERN.test(directive.innerHTML)).toBe(true);
    expect(TEXT_PATTERN.test(directive.innerHTML)).toBe(true);
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
