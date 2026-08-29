import { ThemePreset } from '../core/types';
import { BUILTIN_THEMES } from './themes/presets';

export type ThemeMode = 'auto' | 'light' | 'dark';

export class ThemeManager {
  private currentMode: ThemeMode = 'auto';
  private currentPreset: string = 'default';
  private themes: Map<string, ThemePreset> = new Map();

  constructor(
    defaultMode: ThemeMode = 'auto',
    defaultPreset: string = 'default',
    customThemes: ThemePreset[] = [],
    enableThemeChooser: boolean = true
  ) {
    // Register builtin themes
    BUILTIN_THEMES.forEach(t => this.themes.set(t.id, t));

    // Register user custom themes
    customThemes.forEach(t => {
      this.themes.set(t.id, t);
      this.injectCustomThemeCss(t);
    });

    const savedMode = (
      localStorage.getItem('vertiwiki_theme') ||
      localStorage.getItem('cortexwiki_theme') ||
      localStorage.getItem('omniwiki_theme')
    ) as ThemeMode;

    const savedPreset = enableThemeChooser
      ? (
          localStorage.getItem('vertiwiki_preset') ||
          localStorage.getItem('cortexwiki_preset') ||
          localStorage.getItem('omniwiki_preset')
        )
      : null;

    this.currentMode = savedMode || defaultMode || 'auto';
    this.currentPreset = (savedPreset && this.themes.has(savedPreset)) ? savedPreset : (defaultPreset || 'default');

    this.apply();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.currentMode === 'auto') {
        this.apply();
      }
    });
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
    localStorage.setItem('vertiwiki_theme', mode);
    this.apply();
  }

  public setPreset(presetId: string): void {
    if (this.themes.has(presetId)) {
      this.currentPreset = presetId;
      localStorage.setItem('vertiwiki_preset', presetId);
      this.apply();
    }
  }

  private apply(): void {
    // Set preset attribute
    document.documentElement.setAttribute('data-theme-preset', this.currentPreset);

    // Set dark/light mode attribute
    let effectiveMode = this.currentMode;
    if (effectiveMode === 'auto') {
      effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', effectiveMode);
  }

  private injectCustomThemeCss(theme: ThemePreset): void {
    // Load external web font if provided
    const fontUrl = theme.fontUrl || theme.light.fontUrl || theme.dark.fontUrl;
    if (fontUrl) {
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
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;

    const buildProps = (colors: typeof theme.light) => `
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

    document.head.appendChild(style);
  }
}
