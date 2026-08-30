import { VertiWikiConfig, ThemePreset } from './types';

export const DEFAULT_CONFIG: VertiWikiConfig = {
  title: 'VertiWiki',
  brandDisplay: 'both',
  useSideMenu: true,
  useTableOfContents: true,
  enableSearch: true,
  enableMath: true,
  enableMermaid: true,
  enableCodeCopy: true,
  enableThemeChooser: true,
  collapsibleNavigation: false,
  defaultTheme: 'auto',
  themePreset: 'default',
  navigationFile: 'navigation.md',
  homePage: 'index.md',
  footerText: 'Powered by <strong>VertiWiki 0.2.5</strong> — Built for 2026 and beyond',
  githubUrl: ''
};

export async function loadConfig(): Promise<VertiWikiConfig> {
  let mergedConfig: VertiWikiConfig = { ...DEFAULT_CONFIG };

  try {
    const response = await fetch('config.json');
    if (response.ok) {
      const userConfig = await response.json();
      mergedConfig = { ...DEFAULT_CONFIG, ...userConfig };
    }
  } catch (err) {
    console.warn('Could not load config.json, using defaults:', err);
  }

  // Resolve custom themes (supports file paths like "themes/obsidian.json" and inline objects)
  const resolvedThemes: ThemePreset[] = [];
  if (mergedConfig.customThemes) {
    const rawThemes = Array.isArray(mergedConfig.customThemes)
      ? mergedConfig.customThemes
      : [mergedConfig.customThemes];

    for (const item of rawThemes) {
      if (typeof item === 'string') {
        try {
          const themeRes = await fetch(item);
          if (themeRes.ok) {
            const themeData = (await themeRes.json()) as ThemePreset;
            if (themeData && themeData.id) {
              resolvedThemes.push(themeData);
            }
          } else {
            console.warn(`[VertiWiki] Failed to load theme from path: ${item} (HTTP ${themeRes.status})`);
          }
        } catch (err) {
          console.warn(`[VertiWiki] Error fetching theme file "${item}":`, err);
        }
      } else if (item && typeof item === 'object' && item.id) {
        resolvedThemes.push(item);
      }
    }
  }

  mergedConfig.resolvedThemes = resolvedThemes;
  return mergedConfig;
}
