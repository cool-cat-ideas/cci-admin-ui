import { build } from 'esbuild';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, rmSync } from 'node:fs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const license = readFileSync(resolve(root, 'LICENSE'), 'utf8').trim()
  .split(/\r?\n/).filter((line) => line.trim()).join('\n');
rmSync(resolve(root, 'dist'), { recursive: true, force: true });
await build({
  absWorkingDir: root,
  entryPoints: ['src/index.js', 'src/admin-layout.jsx', 'src/product-panels.jsx',
    'src/blog.js', 'src/nice-menu.js', 'src/wp-carousel.js', 'src/theme.js', 'src/cn.js'],
  bundle: true,
  splitting: true,
  format: 'esm',
  target: 'es2018',
  outdir: 'dist',
  packages: 'external',
  banner: { js: `/*! @cci/admin-ui\n${license}\n*/` },
});
