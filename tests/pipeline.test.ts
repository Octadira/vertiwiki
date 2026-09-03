import { describe, it, expect, vi } from 'vitest';
import { Pipeline, VertiWikiPlugin, PluginContext } from '../src/core/pipeline';
import { DEFAULT_CONFIG } from '../src/core/config';

describe('Pipeline Core Engine', () => {
  const createContext = (): PluginContext => ({
    filePath: 'test.md',
    rawMarkdown: '# Test Markdown',
    config: { ...DEFAULT_CONFIG },
    container: {
      querySelectorAll: vi.fn().mockReturnValue([])
    } as any
  });

  it('registers and executes beforeParse hooks in registration order', async () => {
    const pipeline = new Pipeline();

    const plugin1: VertiWikiPlugin = {
      name: 'p1',
      beforeParse: (md) => `${md} [P1]`
    };

    const plugin2: VertiWikiPlugin = {
      name: 'p2',
      beforeParse: (md) => `${md} [P2]`
    };

    pipeline.registerPlugin(plugin1);
    pipeline.registerPlugin(plugin2);

    const context = createContext();
    const result = await pipeline.runBeforeParse('# Hello', context);
    expect(result).toBe('# Hello [P1] [P2]');
  });

  it('registers and executes afterParse hooks', async () => {
    const pipeline = new Pipeline();

    const plugin: VertiWikiPlugin = {
      name: 'banner',
      afterParse: (html) => `<div class="banner"></div>${html}`
    };

    pipeline.registerPlugin(plugin);
    const context = createContext();
    const result = await pipeline.runAfterParse('<p>Content</p>', context);
    expect(result).toBe('<div class="banner"></div><p>Content</p>');
  });

  it('registers and executes afterRender hooks with context', async () => {
    const pipeline = new Pipeline();
    const renderFn = vi.fn();

    const plugin: VertiWikiPlugin = {
      name: 'dom-hook',
      afterRender: renderFn
    };

    pipeline.registerPlugin(plugin);
    const context = createContext();
    await pipeline.runAfterRender(context);

    expect(renderFn).toHaveBeenCalledTimes(1);
    expect(renderFn).toHaveBeenCalledWith(context);
  });

  it('handles plugins with missing optional hooks without failing', async () => {
    const pipeline = new Pipeline();

    const passivePlugin: VertiWikiPlugin = {
      name: 'passive'
    };

    pipeline.registerPlugin(passivePlugin);
    const context = createContext();

    const before = await pipeline.runBeforeParse('sample', context);
    expect(before).toBe('sample');

    const after = await pipeline.runAfterParse('<span>sample</span>', context);
    expect(after).toBe('<span>sample</span>');

    await expect(pipeline.runAfterRender(context)).resolves.not.toThrow();
  });

  it('handles errors gracefully in plugin hooks without throwing uncaught exceptions', async () => {
    const pipeline = new Pipeline();

    const faultyPlugin: VertiWikiPlugin = {
      name: 'faulty',
      beforeParse: () => {
        throw new Error('Plugin failed');
      },
      afterParse: () => {
        throw new Error('AfterParse failed');
      },
      afterRender: () => {
        throw new Error('AfterRender failed');
      }
    };

    pipeline.registerPlugin(faultyPlugin);
    const context = createContext();

    // Should return original content when hook fails
    const beforeResult = await pipeline.runBeforeParse('safe content', context);
    expect(beforeResult).toBe('safe content');

    const afterResult = await pipeline.runAfterParse('<p>safe</p>', context);
    expect(afterResult).toBe('<p>safe</p>');

    await expect(pipeline.runAfterRender(context)).resolves.not.toThrow();
  });
});
