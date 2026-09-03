import { describe, it, expect, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../src/core/config';
import { resolveFavicon } from '../src/core/favicon';

describe('Configuration Specification', () => {
  it('provides default configuration with i18n support', () => {
    expect(DEFAULT_CONFIG.title).toBe('VertiWiki');
    expect(DEFAULT_CONFIG.enableSearch).toBe(true);
    expect(DEFAULT_CONFIG.enableLanguageChooser).toBe(true);
    expect(Array.isArray(DEFAULT_CONFIG.locales)).toBe(true);
    expect(DEFAULT_CONFIG.defaultTheme).toBe('auto');
    expect(DEFAULT_CONFIG.themePreset).toBe('default');
    expect(DEFAULT_CONFIG.llmsTxtUrl).toBe('llms.txt');
  });

  it('supports custom favicon property in VertiWikiConfig', () => {
    const customConfig = { ...DEFAULT_CONFIG, favicon: 'demo/assets/favicon.ico' };
    expect(customConfig.favicon).toBe('demo/assets/favicon.ico');
  });

  it('resolves explicit favicon if provided', async () => {
    const config = { ...DEFAULT_CONFIG, favicon: 'custom/favicon.ico' };
    const favicon = await resolveFavicon(config);
    expect(favicon).toBe('custom/favicon.ico');
  });

  it('auto-resolves favicon from logo directory or falls back to logo', async () => {
    const config = { ...DEFAULT_CONFIG, logo: 'demo/assets/logo.svg' };
    const favicon = await resolveFavicon(config);
    expect(favicon).toBeTruthy();
  });
});
