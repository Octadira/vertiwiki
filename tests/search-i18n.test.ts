import { describe, it, expect } from 'vitest';
import { SearchEngine } from '../src/plugins/search';

describe('SearchEngine Multi-Language Scoping', () => {
  it('indexes documents and filters results by locale', () => {
    const search = new SearchEngine();

    search.addDocument({
      id: 'docs/installation.md',
      title: 'Installation Guide',
      path: 'docs/installation.md',
      content: 'How to install VertiWiki in simple steps.',
      locale: 'en'
    });

    search.addDocument({
      id: 'fr/docs/installation.md',
      title: 'Guide d Installation',
      path: 'fr/docs/installation.md',
      content: 'Comment installer VertiWiki simplement.',
      locale: 'fr'
    });

    search.addDocument({
      id: 'ro/docs/installation.md',
      title: 'Ghid de Instalare',
      path: 'ro/docs/installation.md',
      content: 'Cum sa instalezi VertiWiki rapid.',
      locale: 'ro'
    });

    // English search
    const enResults = search.search('install', 'en');
    expect(enResults.length).toBe(1);
    expect(enResults[0].path).toBe('docs/installation.md');

    // French search
    const frResults = search.search('installer', 'fr');
    expect(frResults.length).toBe(1);
    expect(frResults[0].path).toBe('fr/docs/installation.md');

    // Romanian search
    const roResults = search.search('instalezi', 'ro');
    expect(roResults.length).toBe(1);
    expect(roResults[0].path).toBe('ro/docs/installation.md');

    // Global search without locale returns all matching
    const allResults = search.search('VertiWiki');
    expect(allResults.length).toBe(3);
  });
});
