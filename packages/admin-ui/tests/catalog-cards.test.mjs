import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createCatalogComponents } from '../dist/index.js';

const icon = () => React.createElement('svg', { 'aria-hidden': true });

for (const theme of ['blog', 'niceMenu', 'wpCarousel']) {
  for (const mode of ['installed', 'store']) {
    test(`${theme}/${mode}: cards show adapter metadata and preserve footer actions`, () => {
      const { CatalogProductCard } = createCatalogComponents(theme, { labels: { author: 'Autor' } });
      const markup = renderToStaticMarkup(React.createElement(CatalogProductCard, {
        item: { title: 'Integration', description: 'Description', installed: true, author: 'Example <script>', version: '2.3.4' },
        mode,
        fallbackIcon: icon,
        actions: React.createElement('button', null, 'Configure'),
      }));
      assert.match(markup, /Autor: Example &lt;script&gt;/);
      assert.match(markup, /v2\.3\.4/);
      assert.match(markup, /data-slot="catalog-installed-status" data-tone="success"/);
      assert.match(markup, /tw-text-green-600/);
      assert.match(markup, /Installed/);
      assert.match(markup, />Configure<\/button>/);
      assert.doesNotMatch(markup, /<script>/);
    });
  }
}

test('legacy cards omit missing metadata without showing placeholders', () => {
  const { CatalogProductCard } = createCatalogComponents();
  const markup = renderToStaticMarkup(React.createElement(CatalogProductCard, {
    item: { title: 'Legacy', description: 'Description' }, mode: 'installed', fallbackIcon: icon,
  }));
  assert.doesNotMatch(markup, /Author:|undefined|null/);
});

test('disabled providers keep a neutral status', () => {
  const { CatalogProductCard } = createCatalogComponents('blog');
  const markup = renderToStaticMarkup(React.createElement(CatalogProductCard, {
    item: { title: 'Provider', description: 'Description', installed: true },
    mode: 'installed', fallbackIcon: icon, installedLabel: 'Disabled', installedTone: 'neutral',
  }));
  assert.match(markup, /data-slot="catalog-installed-status" data-tone="neutral"/);
  assert.doesNotMatch(markup, /tw-text-green-600/);
});
