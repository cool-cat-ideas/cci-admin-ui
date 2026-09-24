import assert from 'node:assert/strict';
import test from 'node:test';

import { catalogIdentityKeys, reconcileCatalogItems } from '../src/catalog-items.js';

test('matches catalog templates despite product prefixes and template suffixes', () => {
  const store = [
    {
      id: 'campaign-strip-template',
      title: 'WP Posts Carousel All In One - Campaign Strip Template',
      screenshot: '',
    },
  ];
  const installed = [
    {
      id: 'campaign-strip',
      title: 'Campaign Strip',
      screenshot: '/templates/campaign-strip/screenshot.png',
    },
  ];

  assert.deepEqual(reconcileCatalogItems(store, installed), [
    {
      ...store[0],
      installed: true,
      screenshot: installed[0].screenshot,
    },
  ]);
});

test('supports explicit aliases for differently named marketplace products', () => {
  const store = [{ id: 'woocommerce-merchandising-integration', title: 'WooCommerce Merchandising Integration' }];
  const installed = [{ key: 'woocommerce_advanced', catalogKeys: ['woocommerce-merchandising-integration'] }];

  assert.equal(reconcileCatalogItems(store, installed)[0].installed, true);
});

test('leaves products that are not installed available in the store', () => {
  const store = [{ id: 'analytics-extension', title: 'Analytics Extension' }];

  assert.equal(reconcileCatalogItems(store, [])[0].installed, false);
});

test('ignores numeric database ids as catalog identities', () => {
  assert.deepEqual(Array.from(catalogIdentityKeys({ id: 42 })), []);
});
