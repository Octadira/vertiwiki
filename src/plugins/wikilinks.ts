import { VertiWikiPlugin, PluginContext } from '../core/pipeline';

/**
 * Wikilinks Plugin for VertiWiki
 * 
 * Supports double-bracket internal wiki links:
 * - `[[page]]` -> `[page](page.md)`
 * - `[[page|Custom Label]]` -> `[Custom Label](page.md)`
 * - `[[page#section]]` -> `[page #section](page.md#section)`
 * - `[[page#section|Custom Label]]` -> `[Custom Label](page.md#section)`
 * - `[[docs/guides/authoring]]` -> `[authoring](docs/guides/authoring.md)`
 * 
 * Automatically isolates fenced code blocks and inline backtick code so that
 * literal `[[...]]` written within code examples are left untouched.
 */
export const wikilinksPlugin: VertiWikiPlugin = {
  name: 'wikilinks',
  beforeParse: (markdown: string, _context: PluginContext) => {
    if (!markdown || !markdown.includes('[[')) {
      return markdown;
    }

    const codeTokens: string[] = [];
    const placeholderPrefix = '___VERTI_CODE_TOKEN_';

    // 1. Isolate multi-line fenced code blocks (```...``` or ~~~...~~~)
    let processed = markdown.replace(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g, (match) => {
      const idx = codeTokens.length;
      codeTokens.push(match);
      return `${placeholderPrefix}${idx}___`;
    });

    // 2. Isolate inline code (`...`)
    processed = processed.replace(/(`+)([^`]+?)\1/g, (match) => {
      const idx = codeTokens.length;
      codeTokens.push(match);
      return `${placeholderPrefix}${idx}___`;
    });

    // 3. Transform Wikilinks [[target(#anchor)?(|label)?]]
    // Matches [[target#anchor|label]], [[target|label]], [[target#anchor]], [[target]]
    processed = processed.replace(/\[\[([^\]\n|#]+)(?:#([^\]\n|]+))?(?:\|([^\]\n]+))?\]\]/g, (match, rawTarget, rawAnchor, rawLabel) => {
      const target = (rawTarget || '').trim();
      if (!target) return match;

      const anchor = rawAnchor ? rawAnchor.trim() : '';
      const label = rawLabel ? rawLabel.trim() : '';

      // Determine clean target path with .md extension if omitted
      let targetFile = target;
      if (!targetFile.match(/\.(md|markdown|mdown)$/i) && !targetFile.includes('?') && !targetFile.startsWith('http://') && !targetFile.startsWith('https://')) {
        targetFile = `${targetFile}.md`;
      }

      // Determine display label
      let displayLabel = label;
      if (!displayLabel) {
        // Use filename / target base name or target name
        const lastSegment = target.includes('/') ? target.substring(target.lastIndexOf('/') + 1) : target;
        displayLabel = anchor ? `${lastSegment} #${anchor}` : lastSegment;
      }

      const fullHref = anchor ? `${targetFile}#${anchor}` : targetFile;
      return `[${displayLabel}](${fullHref})`;
    });

    // 4. Restore isolated code blocks and inline code
    if (codeTokens.length > 0) {
      processed = processed.replace(new RegExp(`${placeholderPrefix}(\\d+)___`, 'g'), (_, idxStr) => {
        const idx = parseInt(idxStr, 10);
        return codeTokens[idx] !== undefined ? codeTokens[idx] : _;
      });
    }

    return processed;
  }
};
