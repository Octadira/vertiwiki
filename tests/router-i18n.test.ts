import { describe, it, expect } from 'vitest';
import { normalizePath, resolvePath, Router, normalizeDirectoryUrl } from '../src/core/router';
import { LocaleConfig } from '../src/core/types';

describe('Router & Path Normalization', () => {
  it('normalizes backslashes, leading ./ and redundant slashes', () => {
    expect(normalizePath('.\\docs\\guides\\index.md')).toBe('docs/guides/index.md');
    expect(normalizePath('///docs//architecture///overview.md')).toBe('docs/architecture/overview.md');
    expect(normalizePath('./fr/docs/features.md')).toBe('fr/docs/features.md');
  });

  it('resolves relative paths correctly from base file path', () => {
    expect(resolvePath('docs/architecture/overview.md', '../guides/authoring.md')).toBe('docs/guides/authoring.md');
    expect(resolvePath('fr/index.md', 'docs/features.md')).toBe('fr/docs/features.md');
    expect(resolvePath('index.md', 'features.md')).toBe('features.md');
  });
});

describe('Router Multi-Language (i18n) Logic', () => {
  const locales: LocaleConfig[] = [
    { code: 'en', label: 'English', isDefault: true },
    { code: 'fr', label: 'Français', prefix: 'fr' },
    { code: 'ro', label: 'Română', prefix: 'ro' }
  ];

  it('detects active locale accurately from file path', () => {
    const router = new Router('index.md', async () => {}, locales);

    expect(router.getCurrentLocale('index.md')?.code).toBe('en');
    expect(router.getCurrentLocale('docs/overview.md')?.code).toBe('en');
    expect(router.getCurrentLocale('fr/index.md')?.code).toBe('fr');
    expect(router.getCurrentLocale('fr/docs/architecture/overview.md')?.code).toBe('fr');
    expect(router.getCurrentLocale('ro/index.md')?.code).toBe('ro');
    expect(router.getCurrentLocale('ro/docs/getting-started/installation.md')?.code).toBe('ro');
  });

  it('parses hash routes and attaches resolved locale', () => {
    const router = new Router('index.md', async () => {}, locales);

    const enRoute = router.parseHash('#/docs/getting-started/installation.md#step-1');
    expect(enRoute.filePath).toBe('docs/getting-started/installation.md');
    expect(enRoute.anchor).toBe('step-1');
    expect(enRoute.locale?.code).toBe('en');

    const frRoute = router.parseHash('#/fr/docs/getting-started/installation.md#step-1');
    expect(frRoute.filePath).toBe('fr/docs/getting-started/installation.md');
    expect(frRoute.anchor).toBe('step-1');
    expect(frRoute.locale?.code).toBe('fr');

    const roRoute = router.parseHash('#/ro/features.md');
    expect(roRoute.filePath).toBe('ro/features.md');
    expect(roRoute.locale?.code).toBe('ro');
  });

  it('correctly resolves localized navigation links in subfolders without double prefixing', () => {
    expect(resolvePath('ro/navigation.md', 'getting-started/installation.md')).toBe('ro/getting-started/installation.md');
    expect(resolvePath('ro/navigation.md', 'ro/getting-started/installation.md')).toBe('ro/getting-started/installation.md');
    expect(resolvePath('fr/navigation.md', 'guides/authoring.md')).toBe('fr/guides/authoring.md');
    expect(resolvePath('navigation.md', 'guides/authoring.md')).toBe('guides/authoring.md');
  });

  it('resolves explicit directory routes and extensionless routes to index.md', () => {
    const router = new Router('index.md', async () => {}, locales);

    // Empty or root hash
    expect(router.parseHash('#').filePath).toBe('index.md');
    expect(router.parseHash('#/').filePath).toBe('index.md');
    expect(router.parseHash('#!/').filePath).toBe('index.md');

    // Explicit directory path
    expect(router.parseHash('#/docs/guides/').filePath).toBe('docs/guides/index.md');

    // Extensionless path
    expect(router.parseHash('#/docs/guides').filePath).toBe('docs/guides/index.md');
    expect(router.parseHash('#/features').filePath).toBe('features/index.md');

    // Path with .md extension preserves exact filename
    expect(router.parseHash('#/features.md').filePath).toBe('features.md');
  });
});

describe('normalizeDirectoryUrl Helper', () => {
  it('ensures trailing slash before hash on directory routes', () => {
    expect(normalizeDirectoryUrl('/docs', '', '#/')).toBe('/docs/#/');
    expect(normalizeDirectoryUrl('/docs', '', '#/features.md')).toBe('/docs/#/features.md');
    expect(normalizeDirectoryUrl('/subfolder', '?v=1', '#/')).toBe('/subfolder/?v=1#/');
  });

  it('leaves paths with existing trailing slash unchanged', () => {
    expect(normalizeDirectoryUrl('/docs/', '', '#/')).toBe('/docs/#/');
    expect(normalizeDirectoryUrl('/', '', '#/')).toBe('/#/');
    expect(normalizeDirectoryUrl('', '', '#/')).toBe('#/');
  });

  it('leaves paths with file extensions unchanged', () => {
    expect(normalizeDirectoryUrl('/index.html', '', '#/')).toBe('/index.html#/');
    expect(normalizeDirectoryUrl('/vertiwiki.html', '', '#/guide.md')).toBe('/vertiwiki.html#/guide.md');
    expect(normalizeDirectoryUrl('/docs/index.html', '', '#/')).toBe('/docs/index.html#/');
  });
});
