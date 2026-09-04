import { ThemePreset, CustomThemeDefinition, ThemeColors } from '../core/types';
import { BUILTIN_THEMES, normalizeThemePreset } from './themes/presets';

export { normalizeThemePreset };
export type ThemeMode = 'auto' | 'light' | 'dark';

export class ThemeManager {
  private currentMode: ThemeMode = 'auto';
  private currentPreset: string = 'default';
  private themes: Map<string, ThemePreset> = new Map();

  constructor(
    defaultMode: ThemeMode = 'auto',
    defaultPreset: string = 'default',
    customThemes: (ThemePreset | CustomThemeDefinition)[] = [],
    enableThemeChooser: boolean = true
  ) {
    // Register builtin themes
    BUILTIN_THEMES.forEach(t => this.themes.set(t.id, t));

    // Register user custom themes with defensive normalization
    customThemes.forEach(t => {
      if (t && typeof t === 'object' && t.id) {
        this.registerTheme(t);
      }
    });

    const getStorage = (key: string): string | null => {
      try {
        return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      } catch {
        return null;
      }
    };

    const savedMode = getStorage('vertiwiki_theme') as ThemeMode;

    const savedPreset = enableThemeChooser
      ? getStorage('vertiwiki_preset')
      : null;

    this.currentMode = savedMode || defaultMode || 'auto';
    this.currentPreset = (savedPreset && this.themes.has(savedPreset)) ? savedPreset : (defaultPreset || 'default');

    this.apply();

    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.currentMode === 'auto') {
          this.apply();
        }
      });
    }
  }

  public registerTheme(theme: ThemePreset | CustomThemeDefinition): ThemePreset {
    const normalized = normalizeThemePreset(theme, this.themes);
    this.themes.set(normalized.id, normalized);
    this.injectCustomThemeCss(normalized);
    return normalized;
  }

  public getAvailableThemes(): ThemePreset[] {
    return Array.from(this.themes.values());
  }

  public getMode(): ThemeMode {
    return this.currentMode;
  }

  public getPreset(): string {
    return this.currentPreset;
  }

  public toggleMode(): ThemeMode {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (this.currentMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const newMode: ThemeMode = isDark ? 'light' : 'dark';
    this.setMode(newMode);
    return newMode;
  }

  public setMode(mode: ThemeMode): void {
    this.currentMode = mode;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('vertiwiki_theme', mode);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    this.apply();
  }

  public setPreset(presetId: string): void {
    if (this.themes.has(presetId)) {
      this.currentPreset = presetId;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('vertiwiki_preset', presetId);
        }
      } catch {
        // Ignore storage errors in restricted contexts
      }
      this.apply();
    }
  }

  private apply(): void {
    if (typeof document === 'undefined' || !document.documentElement) return;

    // Set preset attribute
    document.documentElement.setAttribute('data-theme-preset', this.currentPreset);

    // Set dark/light mode attribute
    let effectiveMode = this.currentMode;
    if (effectiveMode === 'auto') {
      const prefersDark =
        typeof window !== 'undefined' && window.matchMedia
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
          : false;
      effectiveMode = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', effectiveMode);
  }

  private injectCustomThemeCss(theme: ThemePreset): void {
    if (typeof document === 'undefined') return;

    // Load external web font if provided
    const fontUrl = theme.fontUrl || theme.light.fontUrl || theme.dark.fontUrl;
    if (fontUrl && document.head) {
      const fontLinkId = `verti-font-${theme.id}`;
      if (!document.getElementById(fontLinkId)) {
        const link = document.createElement('link');
        link.id = fontLinkId;
        link.rel = 'stylesheet';
        link.href = fontUrl;
        document.head.appendChild(link);
      }
    }

    const styleId = `verti-theme-${theme.id}`;
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = styleId;

    const buildProps = (colors: ThemeColors) => `
      --background: ${colors.background};
      --foreground: ${colors.foreground};
      --card: ${colors.card};
      --card-foreground: ${colors.cardForeground};
      --primary: ${colors.primary};
      --primary-foreground: ${colors.primaryForeground};
      --secondary: ${colors.secondary};
      --secondary-foreground: ${colors.secondaryForeground};
      --muted: ${colors.muted};
      --muted-foreground: ${colors.mutedForeground};
      --accent: ${colors.accent};
      --accent-foreground: ${colors.accentForeground};
      --border: ${colors.border};
      --sidebar: ${colors.sidebar};
      --sidebar-foreground: ${colors.sidebarForeground};
      --sidebar-border: ${colors.sidebarBorder};
      ${colors.fontSans ? `--font-sans: ${colors.fontSans};` : ''}
      ${colors.fontMono ? `--font-mono: ${colors.fontMono};` : ''}
      ${colors.fontSerif ? `--font-serif: ${colors.fontSerif};` : ''}
      ${colors.fontHeading ? `--font-heading: ${colors.fontHeading};` : ''}
      ${colors.radius ? `--radius: ${colors.radius};` : ''}
    `;

    style.textContent = `
      [data-theme-preset='${theme.id}'],
      [data-theme-preset='${theme.id}'][data-theme='light'] {
        ${buildProps(theme.light)}
      }
      [data-theme-preset='${theme.id}'][data-theme='dark'] {
        ${buildProps(theme.dark)}
      }
    `;

    if (document.head) {
      document.head.appendChild(style);
    }
  }
}
