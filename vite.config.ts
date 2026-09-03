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
        if (rawUrl.endsWith('vertiwiki.html') || rawUrl.endsWith('cortexwiki.html')) {
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
          html = html.replace('</body>', `${scriptTag}\n</body>`);
          fs.writeFileSync(distIndex, html, 'utf8');
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [
    rawHtmlServerPlugin(),
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
