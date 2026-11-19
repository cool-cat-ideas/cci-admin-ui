import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';

globalThis.window = {};
const source = await readFile(new URL('../src/sdk.js', import.meta.url), 'utf8');
const { loadSdk } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
);
test('existing Google API is reused after its readiness callback', async () => {
  let announceReady;
  const api = {
    render() {},
    reset() {},
    ready(callback) {
      announceReady = callback;
    },
  };
  window.grecaptcha = api;
  const loading = loadSdk('recaptcha');
  assert.equal(window.grecaptcha, api);
  assert.equal(typeof announceReady, 'function');
  announceReady();
  assert.equal(await loading, api);
});
test('waits for another plugin script without replacing callbacks or inserting a duplicate', async () => {
  delete window.turnstile;
  globalThis.location = { href: 'https://shop.example/' };
  globalThis.document = {
    scripts: [{ src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=otherPlugin' }],
    head: {
      append() {
        throw Error('Duplicate SDK inserted');
      },
    },
  };
  window.otherPlugin = () => {};
  const callback = window.otherPlugin,
    first = loadSdk('turnstile'),
    second = loadSdk('turnstile');
  assert.equal(first, second);
  window.turnstile = { render() {}, reset() {}, remove() {} };
  assert.equal(await first, window.turnstile);
  assert.equal(window.otherPlugin, callback);
});

test('Turnstile clears an expired or timed-out token and still accepts a fresh one', async () => {
  let options;
  let removed;
  window.turnstile = {
    render(container, config) {
      options = config;
      return 'widget';
    },
    reset() {},
    remove(id) {
      removed = id;
    },
  };
  const adapter = await readFile(
    new URL('../src/turnstile/index.js', import.meta.url),
    'utf8',
  );
  const sdk = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  const module = adapter.replace("'../sdk'", JSON.stringify(sdk));
  const { mount } = await import(
    `data:text/javascript;base64,${Buffer.from(module).toString('base64')}`
  );
  const tokens = [];
  const host = { isConnected: true, getBoundingClientRect: () => ({ width: 285 }) };
  const remove = await mount(host, { siteKey: 'test' }, 'submit', (token) => tokens.push(token));
  assert.equal(options.action, 'cci_inquiry_submit');
  assert.equal(options.size, 'compact');
  options.callback('first');
  options['expired-callback']();
  options.callback('second');
  options['timeout-callback']();
  options.callback('fresh');
  assert.deepEqual(tokens, ['first', '', 'second', '', 'fresh']);
  remove();
  assert.equal(removed, 'widget');
});
