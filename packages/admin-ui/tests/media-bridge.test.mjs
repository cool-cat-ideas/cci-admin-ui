import assert from 'node:assert/strict';
import test from 'node:test';
import { createLocalMediaLibraryUiBridge, Button, Input, InfoCallout, Select, LoadingState } from '../dist/nice-menu.js';

test('imperative media controls use the shared components and dispose their React roots', () => {
  const rendered = new Map();
  let commits = 0;
  let unmounted = 0;
  const bridge = createLocalMediaLibraryUiBridge({
    createRoot: (host) => ({ render: (node) => rendered.set(host, node), unmount: () => { rendered.delete(host); unmounted++; } }),
    flushSync: (commit) => { commits++; commit(); },
    Button, Input, InfoCallout, Select, LoadingState,
  });
  const controls = [
    ['mountButton', Button, { children: 'Use image', variant: 'primary', disabled: true }],
    ['mountInput', Input, { type: 'search', 'aria-label': 'Search images' }],
    ['mountFeedback', InfoCallout, { tone: 'error', title: 'Upload failed' }],
    ['mountSelect', Select, { value: 'blog', options: [{ value: 'blog', label: 'Blog' }] }],
    ['mountLoading', LoadingState, { label: 'Loading images' }],
  ];
  for (const [method, Component, props] of controls) {
    const host = {};
    const controller = bridge[method](host, props);
    assert.equal(rendered.get(host).type, Component);
    for (const [key, value] of Object.entries(props)) assert.deepEqual(rendered.get(host).props[key], value);
    controller.update({ ...props, disabled: false });
    assert.equal(rendered.get(host).props.disabled, false);
    controller.destroy();
    assert.equal(rendered.has(host), false);
  }
  assert.equal(commits, 10);
  assert.equal(unmounted, 5);
});
