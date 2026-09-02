import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG } from '../src/core/config';

describe('Configuration Specification', () => {
  it('provides default configuration with i18n support', () => {
    expect(DEFAULT_CONFIG.title).toBe('VertiWiki');
    expect(DEFAULT_CONFIG.enableSearch).toBe(true);
    expect(DEFAULT_CONFIG.enableLanguageChooser).toBe(true);
    expect(Array.isArray(DEFAULT_CONFIG.locales)).toBe(true);
    expect(DEFAULT_CONFIG.defaultTheme).toBe('auto');
    expect(DEFAULT_CONFIG.themePreset).toBe('default');
    expect(DEFAULT_CONFIG.llmsTxtUrl).toBe('/llms.txt');
  });
});
