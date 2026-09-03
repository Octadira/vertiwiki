import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { autoCloseFences, MarkdownParser } from '../src/core/parser';

describe('MarkdownParser Fault-Tolerant Code Fences', () => {
  it('should auto-close single unclosed 3-backtick fence', () => {
    const brokenMd = '# Test\n\n```ts\nconst x = 10;';
    const fixed = autoCloseFences(brokenMd);
    expect(fixed).toBe('# Test\n\n```ts\nconst x = 10;\n```\n');
  });

  it('should auto-close single unclosed 4-backtick fence', () => {
    const brokenMd = '````markdown\n```ts\nconst x = 10;\n```';
    const fixed = autoCloseFences(brokenMd);
    expect(fixed).toBe('````markdown\n```ts\nconst x = 10;\n```\n````\n');
  });

  it('should auto-close tilde fence', () => {
    const brokenMd = '~~~bash\necho "hello"';
    const fixed = autoCloseFences(brokenMd);
    expect(fixed).toBe('~~~bash\necho "hello"\n~~~\n');
  });

  it('should leave properly closed fences unchanged', () => {
    const validMd = '# Hello\n\n```js\nconsole.log(1);\n```\n\nParagraph.';
    const result = autoCloseFences(validMd);
    expect(result).toBe(validMd);
  });

  it('should render HTML safely without truncating unclosed code blocks', () => {
    const parser = new MarkdownParser();
    const brokenMd = '# Header 1\n\n```js\nconst broken = true;\n\n# Header 2';
    const parsed = parser.parse(brokenMd);
    expect(parsed.html).toContain('<pre>');
    expect(parsed.html).toContain('const broken = true;');
  });

  it('should ensure all test markdown docs in verti-wiki have balanced fences', () => {
    const testFiles = [
      'demo/index.md',
      'demo/features.md',
      'demo/themes.md',
      'demo/math_diagrams.md',
      'demo/navigation.md',
      'Changelog.md',
      'README.md'
    ];
    const fenceRe = /^( {0,3})((`{3,})|(~{3,}))(.*)?$/;

    for (const file of testFiles) {
      const fullPath = path.resolve(__dirname, '..', file);
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.replace(/\r\n?/g, '\n').split('\n');
      let openFence: { char: string; length: number; line: number } | null = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = fenceRe.exec(line);
        if (match) {
          const char = match[3] ? '`' : '~';
          const length = (match[3] || match[4]).length;
          const info = (match[5] || '').trim();

          if (!openFence) {
            openFence = { char, length, line: i + 1 };
          } else {
            if (char === openFence.char && length >= openFence.length && info === '') {
              openFence = null;
            }
          }
        }
      }

      expect(openFence, `Unclosed fence found in ${file} at line ${openFence?.line}`).toBeNull();
    }
  });
});
