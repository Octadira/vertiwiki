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

export default defineConfig({
  plugins: [
    rawHtmlServerPlugin(),
    viteSingleFile({
      useRecommendedBuildConfig: true,
      removeViteModuleLoader: true
    })
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
