import MiniSearch from 'minisearch';
import { SearchDocument, SearchResultItem, NavigationItem } from '../core/types';

export class SearchEngine {
  private miniSearch: MiniSearch<SearchDocument>;
  private indexedDocs = new Map<string, SearchDocument>();

  constructor() {
    this.miniSearch = new MiniSearch<SearchDocument>({
      fields: ['title', 'content'],
      storeFields: ['title', 'path', 'content'],
      searchOptions: {
        boost: { title: 2 },
        fuzzy: 0.2,
        prefix: true
      }
    });
  }

  public addDocument(doc: SearchDocument): void {
    if (this.indexedDocs.has(doc.id)) {
      this.miniSearch.remove(this.indexedDocs.get(doc.id)!);
    }
    this.indexedDocs.set(doc.id, doc);
    this.miniSearch.add(doc);
  }

  public async indexNavTree(navItems: NavigationItem[]): Promise<void> {
    const flatten = (items: NavigationItem[]): string[] => {
      const paths: string[] = [];
      items.forEach(item => {
        if (!item.isExternal && item.href && item.href.match(/\.(md|markdown|mdown)$/i)) {
          paths.push(item.href);
        }
        if (item.children) {
          paths.push(...flatten(item.children));
        }
      });
      return paths;
    };

    const paths = Array.from(new Set(flatten(navItems)));

    // Index all pages in background
    for (const path of paths) {
      if (this.indexedDocs.has(path)) continue;
      try {
        const res = await fetch(path);
        if (res.ok) {
          const raw = await res.text();
          const titleMatch = raw.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1].trim() : path;
          const cleanContent = raw.replace(/[#*`_~[\]()]/g, ' ');
          this.addDocument({
            id: path,
            title,
            path,
            content: cleanContent
          });
        }
      } catch {
        // Silently skip if fetch fails
      }
    }
  }

  public search(query: string): SearchResultItem[] {
    if (!query.trim()) return [];

    const results = this.miniSearch.search(query);
    return results.slice(0, 10).map(res => {
      const content = res.content || '';
      const queryLower = query.toLowerCase();
      const matchIdx = content.toLowerCase().indexOf(queryLower);

      let snippet = '';
      if (matchIdx !== -1) {
        const start = Math.max(0, matchIdx - 40);
        const end = Math.min(content.length, matchIdx + query.length + 80);
        snippet = (start > 0 ? '...' : '') + content.substring(start, end) + (end < content.length ? '...' : '');
      } else {
        snippet = content.substring(0, 120) + (content.length > 120 ? '...' : '');
      }

      return {
        id: res.id,
        title: res.title,
        path: res.path,
        snippet,
        score: res.score
      };
    });
  }
}
