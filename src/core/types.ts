export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarBorder: string;
  fontSans?: string;
  fontMono?: string;
  fontSerif?: string;
  fontHeading?: string;
  fontUrl?: string;
  radius?: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  previewColor: string;
  fontUrl?: string;
  extends?: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export interface CustomThemeDefinition {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  previewColor?: string;
  fontUrl?: string;
  extends?: string;
  light?: Partial<ThemeColors>;
  dark?: Partial<ThemeColors>;
}

export interface LocaleConfig {
  code: string;
  label: string;
  prefix?: string;
  isDefault?: boolean;
}

export interface VertiWikiConfig {
  title: string;
  logo?: string;
  brandDisplay?: 'both' | 'logo' | 'title';
  useSideMenu: boolean;
  useTableOfContents: boolean;
  enableSearch: boolean;
  enableMath: boolean;
  enableMermaid: boolean;
  enableCodeCopy: boolean;
  enableThemeChooser: boolean;
  enableLanguageChooser?: boolean;
  locales?: LocaleConfig[];
  collapsibleNavigation?: boolean;
  defaultTheme: 'auto' | 'light' | 'dark';
  themePreset: string;
  customThemes?: (string | ThemePreset | CustomThemeDefinition)[] | string;
  resolvedThemes?: (ThemePreset | CustomThemeDefinition)[];
  navigationFile: string;
  homePage: string;
  llmsTxtUrl?: string | null;
  footerText?: string;
  githubUrl?: string;
  googleAnalyticsId?: string;
  gtmId?: string;
  plausibleDomain?: string;
  cloudflareToken?: string;
  umamiWebsiteId?: string;
  umamiScriptUrl?: string;
  matomoUrl?: string;
  matomoSiteId?: string;
}

export type VertoWikiConfig = VertiWikiConfig;
export type CortexWikiConfig = VertiWikiConfig;
export type OmniWikiConfig = VertiWikiConfig;

export interface NavigationItem {
  title: string;
  href: string;
  children?: NavigationItem[];
  isExternal?: boolean;
}

export interface SearchDocument {
  id: string;
  title: string;
  path: string;
  content: string;
  locale?: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  path: string;
  snippet: string;
  score: number;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export type HookFunction = (context: RenderContext) => Promise<void> | void;

export interface RenderContext {
  currentPath: string;
  rawMarkdown: string;
  htmlContent: string;
  config: CortexWikiConfig;
}
