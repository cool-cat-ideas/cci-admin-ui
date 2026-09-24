import assert from 'node:assert/strict';
import test from 'node:test';
import * as ui from '../dist/index.js';
import * as layout from '../dist/admin-layout.js';
import * as panels from '../dist/product-panels.js';
import { cn } from '../dist/cn.js';
import { THEMES } from '../dist/theme.js';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

test('compiled entry points share component and helper identities', () => {
  assert.equal(ui.AdminShell, layout.AdminShell);
  assert.equal(ui.ProductNavigation, panels.ProductNavigation);
  assert.equal(ui.cn, cn);
  assert.equal(ui.THEMES, THEMES);
});

test('published package exposes source metadata for Tailwind and translation extraction', () => {
  const require = createRequire(import.meta.url);
  const packageDir = dirname(require.resolve('@cci/admin-ui/package.json'));
  assert.ok(existsSync(join(packageDir, 'src/product-news.jsx')));
  assert.ok(existsSync(join(packageDir, 'LICENSE')));
  assert.ok(!existsSync(join(packageDir, 'src/local-media-library-runtime.js')));
});
