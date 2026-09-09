import { ThemePreset, CustomThemeDefinition, ThemeColors } from '../../core/types';

export const BUILTIN_THEMES: ThemePreset[] = [
  {
    id: 'default',
    name: 'Modern Monochrome',
    icon: '⚡',
    previewColor: '#18181b',
    description: 'Clean, minimalist black & white documentation theme inspired by Shadcn and Vercel.',
    light: {
      background: '#ffffff',
      foreground: '#09090b',
      card: '#ffffff',
      cardForeground: '#09090b',
      primary: '#18181b',
      primaryForeground: '#fafafa',
      secondary: '#f4f4f5',
      secondaryForeground: '#18181b',
      muted: '#f4f4f5',
      mutedForeground: '#71717a',
      accent: '#18181b',
      accentForeground: '#fafafa',
      border: '#e4e4e7',
      sidebar: '#fafafa',
      sidebarForeground: '#18181b',
      sidebarBorder: '#e4e4e7',
      fontSans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      radius: '0.5rem'
    },
    dark: {
      background: '#09090b',
      foreground: '#f4f4f5',
      card: '#0f0f11',
      cardForeground: '#f4f4f5',
      primary: '#fafafa',
      primaryForeground: '#09090b',
      secondary: '#18181b',
      secondaryForeground: '#fafafa',
      muted: '#18181b',
      mutedForeground: '#a1a1aa',
      accent: '#fafafa',
      accentForeground: '#09090b',
      border: '#27272a',
      sidebar: '#09090b',
      sidebarForeground: '#f4f4f5',
      sidebarBorder: '#27272a',
      fontSans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      radius: '0.5rem'
    }
  }
];

/**
 * Defensively normalizes a raw or partial theme definition against a base/fallback theme.
 * Guarantees that the returned ThemePreset has 100% complete, non-empty, and valid color tokens,
 * preventing any runtime undefined or CSS IACVT (Invalid At Computed-Value Time) corruption.
 */
export function normalizeThemePreset(
  raw: CustomThemeDefinition | ThemePreset,
  registeredThemes?: Map<string, ThemePreset>
): ThemePreset {
  const baseId = raw.extends || 'default';
  const base =
    (registeredThemes && registeredThemes.get(baseId)) ||
    BUILTIN_THEMES.find(t => t.id === baseId) ||
    (registeredThemes && registeredThemes.get('default')) ||
    BUILTIN_THEMES.find(t => t.id === 'default') ||
    BUILTIN_THEMES[0];

  const cleanColors = (
    fallback: ThemeColors,
    custom?: Partial<ThemeColors>
  ): ThemeColors => {
    if (!custom || typeof custom !== 'object') {
      return { ...fallback };
    }

    const result: ThemeColors = { ...fallback };

    for (const [key, val] of Object.entries(custom)) {
      if (
        val !== undefined &&
        val !== null &&
        typeof val === 'string' &&
        val.trim() !== ''
      ) {
        (result as any)[key] = val.trim();
      }
    }

    return result;
  };

  const light = cleanColors(base.light, raw.light);
  const dark = cleanColors(base.dark, raw.dark);

  return {
    id: raw.id,
    name: (raw.name && raw.name.trim()) || raw.id,
    description: raw.description ?? base.description,
    icon: raw.icon ?? base.icon ?? '🎨',
    previewColor: (raw.previewColor && raw.previewColor.trim()) || light.primary || base.previewColor,
    fontUrl: raw.fontUrl ?? base.fontUrl,
    extends: raw.extends,
    css: raw.css ?? base.css,
    customCss: raw.customCss ?? base.customCss,
    layout: raw.layout ?? base.layout,
    light,
    dark
  };
}

/**
 * Helper template function for creating custom themes with defensive normalization.
 */
export function defineTheme(preset: ThemePreset | CustomThemeDefinition): ThemePreset {
  return normalizeThemePreset(preset);
}

