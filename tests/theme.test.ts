import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { normalizeThemePreset, defineTheme, BUILTIN_THEMES } from '../src/ui/themes/presets';
import { ThemeManager } from '../src/ui/theme';
import { CustomThemeDefinition } from '../src/core/types';

describe('Theme Normalization & Defensive Contract', () => {
  it('preserves complete custom theme values', () => {
    const raw: CustomThemeDefinition = {
      id: 'custom-complete',
      name: 'Custom Complete',
      description: 'A complete custom theme',
      icon: '🎨',
      previewColor: '#ff5500',
      light: {
        background: '#ffffff',
        foreground: '#111111',
        card: '#f0f0f0',
        cardForeground: '#111111',
        primary: '#ff5500',
        primaryForeground: '#ffffff',
        secondary: '#e0e0e0',
        secondaryForeground: '#222222',
        muted: '#f5f5f5',
        mutedForeground: '#666666',
        accent: '#ff7700',
        accentForeground: '#ffffff',
        border: '#dddddd',
        sidebar: '#fafafa',
        sidebarForeground: '#111111',
        sidebarBorder: '#dddddd'
      },
      dark: {
        background: '#111111',
        foreground: '#eeeeee',
        card: '#222222',
        cardForeground: '#eeeeee',
        primary: '#ff7700',
        primaryForeground: '#000000',
        secondary: '#333333',
        secondaryForeground: '#ffffff',
        muted: '#222222',
        mutedForeground: '#888888',
        accent: '#ff8800',
        accentForeground: '#000000',
        border: '#444444',
        sidebar: '#181818',
        sidebarForeground: '#ffffff',
        sidebarBorder: '#444444'
      }
    };

    const normalized = normalizeThemePreset(raw);
    expect(normalized.id).toBe('custom-complete');
    expect(normalized.name).toBe('Custom Complete');
    expect(normalized.previewColor).toBe('#ff5500');
    expect(normalized.light.primary).toBe('#ff5500');
    expect(normalized.dark.primary).toBe('#ff7700');
  });

  it('fills missing light colors from default Modern Indigo theme', () => {
    const defaultTheme = BUILTIN_THEMES.find(t => t.id === 'default')!;

    const partial: CustomThemeDefinition = {
      id: 'custom-partial',
      light: {
        primary: '#e11d48' // Only customize primary color
      }
    };

    const normalized = normalizeThemePreset(partial);
    expect(normalized.id).toBe('custom-partial');
    expect(normalized.name).toBe('custom-partial'); // Fallback to id
    expect(normalized.previewColor).toBe('#e11d48'); // Fallback to light.primary
    expect(normalized.light.primary).toBe('#e11d48');
    // All other colors should match default theme
    expect(normalized.light.background).toBe(defaultTheme.light.background);
    expect(normalized.light.foreground).toBe(defaultTheme.light.foreground);
    expect(normalized.light.card).toBe(defaultTheme.light.card);
    expect(normalized.light.border).toBe(defaultTheme.light.border);
    expect(normalized.light.sidebar).toBe(defaultTheme.light.sidebar);
  });

  it('safely handles omitted dark mode by inheriting base dark mode', () => {
    const defaultTheme = BUILTIN_THEMES.find(t => t.id === 'default')!;

    const partial: CustomThemeDefinition = {
      id: 'no-dark-theme',
      name: 'Light Only Theme',
      light: {
        primary: '#0ea5e9'
      }
    };

    const normalized = normalizeThemePreset(partial);
    expect(normalized.dark).toBeDefined();
    expect(normalized.dark.background).toBe(defaultTheme.dark.background);
    expect(normalized.dark.foreground).toBe(defaultTheme.dark.foreground);
    expect(normalized.dark.primary).toBe(defaultTheme.dark.primary);
  });

  it('supports extends to inherit from another builtin theme (e.g. nord)', () => {
    const nordTheme = BUILTIN_THEMES.find(t => t.id === 'nord')!;

    const partialNord: CustomThemeDefinition = {
      id: 'custom-nord-variant',
      name: 'Nord Neon',
      extends: 'nord',
      light: {
        primary: '#10b981' // override only primary
      },
      dark: {
        primary: '#34d399'
      }
    };

    const normalized = normalizeThemePreset(partialNord);
    expect(normalized.extends).toBe('nord');
    expect(normalized.light.primary).toBe('#10b981');
    expect(normalized.dark.primary).toBe('#34d399');
    // Inherits nord base colors instead of default
    expect(normalized.light.background).toBe(nordTheme.light.background);
    expect(normalized.dark.background).toBe(nordTheme.dark.background);
    expect(normalized.light.sidebar).toBe(nordTheme.light.sidebar);
  });

  it('cleans dirty, empty or invalid values (null, undefined, empty strings)', () => {
    const defaultTheme = BUILTIN_THEMES.find(t => t.id === 'default')!;

    const dirty: any = {
      id: 'dirty-theme',
      name: '   ',
      light: {
        primary: '#6366f1',
        background: '',
        card: null,
        border: undefined
      }
    };

    const normalized = normalizeThemePreset(dirty);
    expect(normalized.name).toBe('dirty-theme'); // Stripped whitespace -> fallback to id
    expect(normalized.light.primary).toBe('#6366f1');
    expect(normalized.light.background).toBe(defaultTheme.light.background);
    expect(normalized.light.card).toBe(defaultTheme.light.card);
    expect(normalized.light.border).toBe(defaultTheme.light.border);
  });

  it('supports chained inheritance across custom themes', () => {
    const themesMap = new Map();
    BUILTIN_THEMES.forEach(t => themesMap.set(t.id, t));

    const parent = normalizeThemePreset({
      id: 'brand-base',
      name: 'Brand Base',
      light: {
        primary: '#3b82f6',
        card: '#f8fafc'
      }
    }, themesMap);
    themesMap.set(parent.id, parent);

    const child = normalizeThemePreset({
      id: 'brand-sub',
      extends: 'brand-base',
      light: {
        accent: '#f43f5e'
      }
    }, themesMap);

    expect(child.light.primary).toBe('#3b82f6'); // from brand-base
    expect(child.light.card).toBe('#f8fafc'); // from brand-base
    expect(child.light.accent).toBe('#f43f5e'); // child override
  });

  it('defineTheme helper normalizes and returns complete preset', () => {
    const theme = defineTheme({
      id: 'quick-theme',
      light: {
        primary: '#8b5cf6'
      }
    });

    expect(theme.id).toBe('quick-theme');
    expect(theme.light.primary).toBe('#8b5cf6');
    expect(theme.light.background).toBeTruthy();
    expect(theme.dark.background).toBeTruthy();
  });
});

describe('ThemeManager with Defensive Theme Injection', () => {
  let createdElements: any[] = [];
  let originalDocument: any;

  beforeEach(() => {
    originalDocument = (global as any).document;
    createdElements = [];

    const mockDocument: any = {
      documentElement: {
        setAttribute: () => {},
        getAttribute: () => 'light'
      },
      head: {
        appendChild: (el: any) => {
          createdElements.push(el);
        }
      },
      getElementById: (id: string) => {
        return createdElements.find(el => el.id === id) || null;
      },
      createElement: (tag: string) => {
        const el: any = {
          tagName: tag.toUpperCase(),
          id: '',
          textContent: '',
          remove: () => {
            const idx = createdElements.indexOf(el);
            if (idx !== -1) createdElements.splice(idx, 1);
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

  it('injects valid CSS without any "undefined" values for partial custom themes', () => {
    const partialTheme: CustomThemeDefinition = {
      id: 'sunset',
      name: 'Sunset Minimal',
      light: {
        primary: '#f97316'
      }
    };

    const manager = new ThemeManager('auto', 'default', [partialTheme]);
    const themes = manager.getAvailableThemes();
    const registered = themes.find(t => t.id === 'sunset');

    expect(registered).toBeDefined();
    expect(registered!.light.primary).toBe('#f97316');
    expect(registered!.light.background).toBeDefined();

    const injectedStyle = createdElements.find(el => el.id === 'verti-theme-sunset');
    expect(injectedStyle).toBeDefined();
    expect(injectedStyle.textContent).not.toContain('undefined');
    expect(injectedStyle.textContent).toContain('--primary: #f97316;');
    expect(injectedStyle.textContent).toContain('--background: #fafafa;');
  });

  it('allows dynamically registering and hot-reloading themes via registerTheme', () => {
    const manager = new ThemeManager('auto', 'default', []);

    manager.registerTheme({
      id: 'dynamic-v1',
      light: { primary: '#111111' }
    });

    let style = createdElements.find(el => el.id === 'verti-theme-dynamic-v1');
    expect(style).toBeDefined();
    expect(style.textContent).toContain('--primary: #111111;');

    // Hot-reload/update with same id
    manager.registerTheme({
      id: 'dynamic-v1',
      light: { primary: '#222222' }
    });

    style = createdElements.find(el => el.id === 'verti-theme-dynamic-v1');
    expect(style).toBeDefined();
    expect(style.textContent).toContain('--primary: #222222;');
    expect(style.textContent).not.toContain('undefined');
  });
});
