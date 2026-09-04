import { defineConfig, Plugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import fs from 'node:fs';
import path from 'node:path';

function rawHtmlServerPlugin(): Plugin {
  return {
    name: 'raw-html-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url?.split('?')[0] || '';
        if (rawUrl.endsWith('vertiwiki.html')) {
          const cleanPath = rawUrl.startsWith('/') ? rawUrl.slice(1) : rawUrl;
          const filePath = path.resolve(process.cwd(), cleanPath);
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(fs.readFileSync(filePath));
            return;
          }
        }
        next();
      });
    }
  };
}

function optimizeKatexFontsPlugin(): Plugin {
  return {
    name: 'optimize-katex-fonts',
    enforce: 'pre',
    load(id) {
      if (id.endsWith('/src/ui/styles/main.css') || id.endsWith('styles/main.css')) {
        let mainCss = fs.readFileSync(id, 'utf8');
        const katexCssPath = path.resolve(process.cwd(), 'node_modules/katex/dist/katex.min.css');
        if (fs.existsSync(katexCssPath)) {
          let katexCss = fs.readFileSync(katexCssPath, 'utf8');
          // Strip obsolete .woff and .ttf from @font-face, keeping solely modern .woff2
          katexCss = katexCss.replace(/,url\(fonts\/[^)]+\.woff\) format\(["']woff["']\),url\(fonts\/[^)]+\.ttf\) format\(["']truetype["']\)/g, '');
          const fontsDir = path.resolve(process.cwd(), 'node_modules/katex/dist/fonts').replace(/\\/g, '/');
          katexCss = katexCss.replace(/url\(fonts\//g, `url(${fontsDir}/`);
          mainCss = mainCss.replace(/@import\s+['"]katex\/dist\/katex\.min\.css['"];/, katexCss);
        }
        return mainCss;
      }
    }
  };
}

function scriptToEndOfBodyPlugin(): Plugin {
  return {
    name: 'script-to-end-of-body',
    enforce: 'post',
    closeBundle() {
      const distIndex = path.resolve(process.cwd(), 'dist/index.html');
      if (fs.existsSync(distIndex)) {
        let html = fs.readFileSync(distIndex, 'utf8');
        const headCloseIndex = html.indexOf('</head>');
        const scriptOpenIndex = html.indexOf('<script');
        if (scriptOpenIndex !== -1 && scriptOpenIndex < headCloseIndex) {
          const scriptCloseIndex = html.indexOf('</script>') + 9;
          const scriptTag = html.slice(scriptOpenIndex, scriptCloseIndex);
          html = html.slice(0, scriptOpenIndex) + html.slice(scriptCloseIndex);
          html = html.replace('</body>', () => `${scriptTag}\n</body>`);
          // Ensure favicon link in standalone bundle remains assets/favicon.ico for zero-build end-user configuration
          html = html.replace(/<link rel="icon"[^>]*href="[^"]*favicon[^"]*"[^>]*>/i, '<link rel="icon" href="assets/favicon.ico" />');
          fs.writeFileSync(distIndex, html, 'utf8');
        }
      }
      const distDir = path.resolve(process.cwd(), 'dist');
      if (fs.existsSync(distDir)) {
        for (const file of fs.readdirSync(distDir)) {
          if (/^favicon-.*\.(ico|svg|png)$/.test(file)) {
            try { fs.unlinkSync(path.join(distDir, file)); } catch {}
          }
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [
    rawHtmlServerPlugin(),
    optimizeKatexFontsPlugin(),
    viteSingleFile({
      useRecommendedBuildConfig: true,
      removeViteModuleLoader: true
    }),
    scriptToEndOfBodyPlugin()
  ],
  esbuild: {
    charset: 'ascii'
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
