import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

await build({
  absWorkingDir: fileURLToPath(new URL('../', import.meta.url)),
  entryPoints: { captcha: 'src/Captcha.jsx', settings: 'src/SettingsDialog.jsx', sdk: 'src/sdk.js' },
  outdir: 'dist',
  bundle: true,
  splitting: true,
  format: 'esm',
  target: 'es2018',
  packages: 'external',
});
