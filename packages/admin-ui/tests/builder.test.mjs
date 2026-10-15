import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createBuilderComponents } from '../dist/index.js';

test('builder item keeps dragging and selection on one accessible control, with sibling actions', () => {
  const { BuilderCanvas, BuilderItem, BuilderItemMain, BuilderGrip, BuilderActions } = createBuilderComponents();
  const html = renderToStaticMarkup(React.createElement(BuilderCanvas, {},
    React.createElement(BuilderItem, {},
      React.createElement(BuilderItemMain, { disabled: true, 'aria-pressed': true, draggable: false, 'aria-keyshortcuts': 'ArrowUp ArrowDown' },
        React.createElement(BuilderGrip), 'Item'),
      React.createElement(BuilderActions, {}, React.createElement('button', {}, 'Delete')))));
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /aria-keyshortcuts="ArrowUp ArrowDown"/);
  assert.equal((html.match(/<button/g) || []).length, 2);
  assert.match(html, /<\/button><div[^>]*data-cci-builder-actions/);
  assert.match(html, /data-cci-builder-grip/);
});

test('builder factory defaults match Nice Menu and exposes a single twelve-column ruler', () => {
  const render = (theme) => {
    const { BuilderHeading, BuilderMetric, BuilderRuler } = createBuilderComponents(theme);
    return renderToStaticMarkup(React.createElement(React.Fragment, {},
      React.createElement(BuilderHeading, { 'aria-pressed': false }, 'Column', React.createElement(BuilderMetric, {}, '6/12')),
      React.createElement(BuilderRuler, { 'aria-hidden': true })));
  };
  assert.equal(render(), render('niceMenu'));
  assert.equal((render().match(/<span>\d+<\/span>/g) || []).length, 12);
  assert.match(render(), /data-cci-builder-metric="size"/);
});
