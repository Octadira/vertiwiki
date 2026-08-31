import { describe, it, expect } from 'vitest';
import { normalizePath, resolvePath, Router } from '../src/core/router';
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
});
