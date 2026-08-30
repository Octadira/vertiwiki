import { VertiWikiConfig } from './types';

export interface PluginContext {
  filePath: string;
  config: VertiWikiConfig;
  container: HTMLElement;
}

export type BeforeParseHook = (markdown: string, context: PluginContext) => Promise<string> | string;
export type AfterParseHook = (html: string, context: PluginContext) => Promise<string> | string;
export type AfterRenderHook = (context: PluginContext) => Promise<void> | void;

export interface VertiWikiPlugin {
  name: string;
  beforeParse?: BeforeParseHook;
  afterParse?: AfterParseHook;
  afterRender?: AfterRenderHook;
}

export type CortexWikiPlugin = VertiWikiPlugin;
export type OmniWikiPlugin = VertiWikiPlugin;

export class Pipeline {
  private plugins: VertiWikiPlugin[] = [];

  public registerPlugin(plugin: VertiWikiPlugin): void {
    this.plugins.push(plugin);
  }

  public async runBeforeParse(markdown: string, context: PluginContext): Promise<string> {
    let result = markdown;
    for (const plugin of this.plugins) {
      if (plugin.beforeParse) {
        try {
          result = await plugin.beforeParse(result, context);
        } catch (err) {
          console.error(`[Plugin:${plugin.name}] error in beforeParse:`, err);
        }
      }
    }
    return result;
  }

  public async runAfterParse(html: string, context: PluginContext): Promise<string> {
    let result = html;
    for (const plugin of this.plugins) {
      if (plugin.afterParse) {
        try {
          result = await plugin.afterParse(result, context);
        } catch (err) {
          console.error(`[Plugin:${plugin.name}] error in afterParse:`, err);
        }
      }
    }
    return result;
  }

  public async runAfterRender(context: PluginContext): Promise<void> {
    for (const plugin of this.plugins) {
      if (plugin.afterRender) {
        try {
          await plugin.afterRender(context);
        } catch (err) {
          console.error(`[Plugin:${plugin.name}] error in afterRender:`, err);
        }
      }
    }
  }
}
