import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createTailwindConfig, resolveAdminUiContentGlobs } = require('../src/index.cjs');

test('theme finds the installed public UI source without a private checkout', () => {
  const globs = resolveAdminUiContentGlobs();
  assert.equal(globs.length, 2);
  assert.ok(globs.every((value) => !value.includes('cci_admin_ui_pro')));
  const config = createTailwindConfig({ namespace: 'cci-blog', safelistMode: 'shared-ui' });
  assert.ok(globs.every((value) => config.content.includes(value)));
  assert.ok(config.safelist.includes('tw-hidden'));
});
