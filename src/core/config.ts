import { VertiWikiConfig, ThemePreset, CustomThemeDefinition } from './types';
import { resolveResourceUrl } from './router';

export const DEFAULT_CONFIG: VertiWikiConfig = {
  title: 'VertiWiki',
  brandDisplay: 'both',
  useSideMenu: true,
  useTableOfContents: true,
  enableSearch: true,
  enableMath: true,
  enableMermaid: true,
  enableCodeCopy: true,
  enableAiCopy: true,
  enableThemeChooser: true,
  enableLanguageChooser: true,
  locales: [],
  collapsibleNavigation: false,
  defaultTheme: 'auto',
  themePreset: 'default',
  layoutMode: 'default',
  contentWidth: 'normal',
  headerLinks: [],
  customCss: [],
  navigationFile: 'navigation.md',
  homePage: 'index.md',
  llmsTxtUrl: 'llms.txt',
  footerText: 'Powered by <a href="https://verti.wiki" target="_blank" rel="noopener noreferrer"><strong>VertiWiki 0.10.0 (Épure)</strong></a> — Built for 2026 and beyond',
  githubUrl: ''
};

export async function loadConfig(): Promise<VertiWikiConfig> {
  let mergedConfig: VertiWikiConfig = { ...DEFAULT_CONFIG };

  try {
    const response = await fetch(resolveResourceUrl('config.json'));
    if (response.ok) {
      const userConfig = await response.json();
      mergedConfig = { ...DEFAULT_CONFIG, ...userConfig };
    }
  } catch (err) {
    console.warn('Could not load config.json, using defaults:', err);
  }

  // Resolve custom themes (supports file paths like "themes/obsidian.json" and inline objects)
  const resolvedThemes: (ThemePreset | CustomThemeDefinition)[] = [];
  if (mergedConfig.customThemes) {
    const rawThemes = Array.isArray(mergedConfig.customThemes)
      ? mergedConfig.customThemes
      : [mergedConfig.customThemes];

    for (const item of rawThemes) {
      if (typeof item === 'string') {
        try {
          const themeRes = await fetch(resolveResourceUrl(item));
          if (themeRes.ok) {
            const themeData = (await themeRes.json()) as CustomThemeDefinition;
            if (themeData && themeData.id) {
              resolvedThemes.push(themeData);
            }
          } else {
            console.warn(`[VertiWiki] Failed to load theme from path: ${item} (HTTP ${themeRes.status})`);
          }
        } catch (err) {
          console.warn(`[VertiWiki] Error fetching theme file "${item}":`, err);
        }
      } else if (item && typeof item === 'object' && (item as any).id) {
        resolvedThemes.push(item as CustomThemeDefinition);
      }
    }
  }

  // Auto-resolve detached preset from themes/<themePreset>.json if specified and not already loaded
  if (
    mergedConfig.themePreset &&
    mergedConfig.themePreset !== 'default' &&
    !resolvedThemes.some(t => t.id === mergedConfig.themePreset)
  ) {
    try {
      const autoPath = `themes/${mergedConfig.themePreset}.json`;
      const autoRes = await fetch(resolveResourceUrl(autoPath));
      if (autoRes.ok) {
        const themeData = (await autoRes.json()) as CustomThemeDefinition;
        if (themeData && themeData.id) {
          resolvedThemes.push(themeData);
        }
      }
    } catch {
      // Ignore error, ThemeManager will fallback cleanly to default preset
    }
  }

  mergedConfig.resolvedThemes = resolvedThemes;
  return mergedConfig;
}
