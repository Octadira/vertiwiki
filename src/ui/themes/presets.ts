import { ThemePreset, CustomThemeDefinition, ThemeColors } from '../../core/types';

export const BUILTIN_THEMES: ThemePreset[] = [
  {
    id: 'default',
    name: 'Modern Indigo',
    icon: '⚡',
    previewColor: '#6366f1',
    description: 'Clean, modern documentation theme inspired by VitePress and Tailwind UI.',
    light: {
      background: '#fafafa',
      foreground: '#09090b',
      card: '#ffffff',
      cardForeground: '#09090b',
      primary: '#6366f1',
      primaryForeground: '#ffffff',
      secondary: '#f4f4f5',
      secondaryForeground: '#18181b',
      muted: '#f4f4f5',
      mutedForeground: '#71717a',
      accent: '#6366f1',
      accentForeground: '#ffffff',
      border: '#e4e4e7',
      sidebar: '#ffffff',
      sidebarForeground: '#18181b',
      sidebarBorder: '#e4e4e7',
      fontSans: 'system-ui, -apple-system, sans-serif',
      radius: '0.6rem'
    },
    dark: {
      background: '#09090b',
      foreground: '#fafafa',
      card: '#18181b',
      cardForeground: '#fafafa',
      primary: '#818cf8',
      primaryForeground: '#09090b',
      secondary: '#27272a',
      secondaryForeground: '#f4f4f5',
      muted: '#18181b',
      mutedForeground: '#a1a1aa',
      accent: '#818cf8',
      accentForeground: '#09090b',
      border: '#27272a',
      sidebar: '#121215',
      sidebarForeground: '#fafafa',
      sidebarBorder: '#27272a',
      fontSans: 'system-ui, -apple-system, sans-serif',
      radius: '0.6rem'
    }
  },
  {
    id: 'terracotta',
    name: 'Warm Terracotta',
    icon: '🍂',
    previewColor: '#c96442',
    description: 'Warm, cozy clay & sepia theme with Outfit typography.',
    light: {
      background: '#faf9f5',
      foreground: '#3d3929',
      card: '#f5f4ef',
      cardForeground: '#141413',
      primary: '#c96442',
      primaryForeground: '#ffffff',
      secondary: '#e9e6dc',
      secondaryForeground: '#535146',
      muted: '#ede9de',
      mutedForeground: '#6e6d68',
      accent: '#e9e6dc',
      accentForeground: '#28261b',
      border: '#dad9d4',
      sidebar: '#f5f4ee',
      sidebarForeground: '#3d3d3a',
      sidebarBorder: '#ebebeb',
      fontSans: 'Outfit, system-ui, sans-serif',
      radius: '1rem'
    },
    dark: {
      background: '#262624',
      foreground: '#f1f1ef',
      card: '#2c2c2b',
      cardForeground: '#faf9f5',
      primary: '#d97757',
      primaryForeground: '#141413',
      secondary: '#2c2c2b',
      secondaryForeground: '#faf9f5',
      muted: '#1b1b19',
      mutedForeground: '#b7b5a9',
      accent: '#34332e',
      accentForeground: '#f5f4ee',
      border: '#3e3e38',
      sidebar: '#1f1e1d',
      sidebarForeground: '#c3c0b6',
      sidebarBorder: '#3e3e38',
      fontSans: 'Outfit, system-ui, sans-serif',
      radius: '1rem'
    }
  },
  {
    id: 'emerald',
    name: 'Forest Emerald',
    icon: '🌲',
    previewColor: '#075e54',
    description: 'Teal and emerald green palette with high contrast and clean lines.',
    light: {
      background: '#f0f2f5',
      foreground: '#111b21',
      card: '#ffffff',
      cardForeground: '#111b21',
      primary: '#075e54',
      primaryForeground: '#ffffff',
      secondary: '#e7f8f0',
      secondaryForeground: '#075e54',
      muted: '#f0f2f5',
      mutedForeground: '#667781',
      accent: '#25d366',
      accentForeground: '#ffffff',
      border: '#e9edef',
      sidebar: '#ffffff',
      sidebarForeground: '#111b21',
      sidebarBorder: '#e9edef',
      fontSans: 'Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif',
      radius: '1rem'
    },
    dark: {
      background: '#0b141a',
      foreground: '#e9edef',
      card: '#1f2c34',
      cardForeground: '#e9edef',
      primary: '#00a884',
      primaryForeground: '#111b21',
      secondary: '#12332a',
      secondaryForeground: '#00a884',
      muted: '#182229',
      mutedForeground: '#8696a0',
      accent: '#25d366',
      accentForeground: '#111b21',
      border: '#2a3942',
      sidebar: '#111b21',
      sidebarForeground: '#e9edef',
      sidebarBorder: '#2a3942',
      fontSans: 'Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif',
      radius: '1rem'
    }
  },
  {
    id: 'nord',
    name: 'Nord Arctic',
    icon: '❄️',
    previewColor: '#88c0d0',
    description: 'Arctic, north-bluish clean and elegant color palette.',
    light: {
      background: '#eceff4',
      foreground: '#2e3440',
      card: '#e5e9f0',
      cardForeground: '#2e3440',
      primary: '#5e81ac',
      primaryForeground: '#eceff4',
      secondary: '#d8dee9',
      secondaryForeground: '#3b4252',
      muted: '#d8dee9',
      mutedForeground: '#4c566a',
      accent: '#88c0d0',
      accentForeground: '#2e3440',
      border: '#d8dee9',
      sidebar: '#e5e9f0',
      sidebarForeground: '#2e3440',
      sidebarBorder: '#d8dee9',
      fontSans: 'system-ui, sans-serif',
      radius: '0.5rem'
    },
    dark: {
      background: '#242933',
      foreground: '#eceff4',
      card: '#2e3440',
      cardForeground: '#eceff4',
      primary: '#88c0d0',
      primaryForeground: '#2e3440',
      secondary: '#3b4252',
      secondaryForeground: '#eceff4',
      muted: '#3b4252',
      mutedForeground: '#d8dee9',
      accent: '#81a1c1',
      accentForeground: '#2e3440',
      border: '#3b4252',
      sidebar: '#1e222a',
      sidebarForeground: '#d8dee9',
      sidebarBorder: '#2e3440',
      fontSans: 'system-ui, sans-serif',
      radius: '0.5rem'
    }
  },
  {
    id: 'dracula',
    name: 'Dracula Midnight',
    icon: '🧛',
    previewColor: '#bd93f9',
    description: 'Famous dark theme with rich purples, pinks, and vibrant contrasts.',
    light: {
      background: '#f8f8f2',
      foreground: '#282a36',
      card: '#ffffff',
      cardForeground: '#282a36',
      primary: '#6272a4',
      primaryForeground: '#f8f8f2',
      secondary: '#e2e4ec',
      secondaryForeground: '#282a36',
      muted: '#eaebee',
      mutedForeground: '#6272a4',
      accent: '#ff79c6',
      accentForeground: '#ffffff',
      border: '#d6d8e2',
      sidebar: '#ffffff',
      sidebarForeground: '#282a36',
      sidebarBorder: '#d6d8e2',
      fontSans: 'system-ui, sans-serif',
      radius: '0.75rem'
    },
    dark: {
      background: '#1e1f29',
      foreground: '#f8f8f2',
      card: '#282a36',
      cardForeground: '#f8f8f2',
      primary: '#bd93f9',
      primaryForeground: '#282a36',
      secondary: '#44475a',
      secondaryForeground: '#f8f8f2',
      muted: '#21222c',
      mutedForeground: '#6272a4',
      accent: '#ff79c6',
      accentForeground: '#282a36',
      border: '#44475a',
      sidebar: '#191a21',
      sidebarForeground: '#f8f8f2',
      sidebarBorder: '#44475a',
      fontSans: 'system-ui, sans-serif',
      radius: '0.75rem'
    }
  },
  {
    id: 'amethyst',
    name: 'Amethyst Cyber',
    icon: '🔮',
    previewColor: '#9333ea',
    description: 'Electric violet and magenta cyberpunk style.',
    light: {
      background: '#fcfaff',
      foreground: '#2e1065',
      card: '#ffffff',
      cardForeground: '#2e1065',
      primary: '#9333ea',
      primaryForeground: '#ffffff',
      secondary: '#f3e8ff',
      secondaryForeground: '#581c87',
      muted: '#f3e8ff',
      mutedForeground: '#7e22ce',
      accent: '#d946ef',
      accentForeground: '#ffffff',
      border: '#e9d5ff',
      sidebar: '#ffffff',
      sidebarForeground: '#3b0764',
      sidebarBorder: '#e9d5ff',
      fontSans: 'system-ui, sans-serif',
      radius: '0.8rem'
    },
    dark: {
      background: '#0d0714',
      foreground: '#faf5ff',
      card: '#1a0f2e',
      cardForeground: '#faf5ff',
      primary: '#c084fc',
      primaryForeground: '#0d0714',
      secondary: '#2e1065',
      secondaryForeground: '#faf5ff',
      muted: '#1e0c38',
      mutedForeground: '#a855f7',
      accent: '#f0abfc',
      accentForeground: '#0d0714',
      border: '#3b0764',
      sidebar: '#130924',
      sidebarForeground: '#faf5ff',
      sidebarBorder: '#2e1065',
      fontSans: 'system-ui, sans-serif',
      radius: '0.8rem'
    }
  },
  {
    id: 'editorial',
    name: 'Editorial Serif',
    icon: '📜',
    previewColor: '#78350f',
    description: 'Warm literary theme with serif typography and sepia accents.',
    light: {
      background: '#fbf9f4',
      foreground: '#292524',
      card: '#f5f0e6',
      cardForeground: '#1c1917',
      primary: '#78350f',
      primaryForeground: '#ffffff',
      secondary: '#eee7d7',
      secondaryForeground: '#44403c',
      muted: '#f0e9dc',
      mutedForeground: '#78716c',
      accent: '#b45309',
      accentForeground: '#ffffff',
      border: '#e2d7c3',
      sidebar: '#f5f0e6',
      sidebarForeground: '#292524',
      sidebarBorder: '#e2d7c3',
      fontSans: 'Georgia, Cambria, "Times New Roman", serif',
      radius: '0.25rem'
    },
    dark: {
      background: '#1c1917',
      foreground: '#f5f5f4',
      card: '#292524',
      cardForeground: '#f5f5f4',
      primary: '#d97706',
      primaryForeground: '#1c1917',
      secondary: '#44403c',
      secondaryForeground: '#f5f5f4',
      muted: '#292524',
      mutedForeground: '#a8a29e',
      accent: '#f59e0b',
      accentForeground: '#1c1917',
      border: '#44403c',
      sidebar: '#141210',
      sidebarForeground: '#f5f5f4',
      sidebarBorder: '#292524',
      fontSans: 'Georgia, Cambria, "Times New Roman", serif',
      radius: '0.25rem'
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

