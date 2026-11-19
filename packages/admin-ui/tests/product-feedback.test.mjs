import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProductStatusPanel, ProductNewsView } from '../dist/product-panels.js';

const t = text => text;
const renderStatus = props => renderToStaticMarkup(React.createElement(ProductStatusPanel, { t, installedVersion: '1.0.0', ...props }));

test('Missing version data explains that state instead of showing an unrelated product description', () => {
  const html = renderStatus({ description: 'Product questions are managed here.' });
  assert.match(html, /Version information is temporarily unavailable/);
  assert.doesNotMatch(html, /Product questions are managed here/);
  assert.doesNotMatch(html, /You are up to date|New version available/);
  const available = renderStatus({ latestVersion: '1.0.0', description: 'Product questions are managed here.' });
  assert.match(available, /You are up to date/);
  assert.match(available, /Product questions are managed here/);
});

test('News failure retains the accessible status and retry action; retrying disables that action', () => {
  for (const retrying of [false, true]) {
    const html = renderToStaticMarkup(React.createElement(ProductNewsView, { t, error: 'HTTP 404', retrying, onRefresh: () => {} }));
    assert.match(html, /role="status" aria-live="polite"/);
    assert.match(html, /Product updates could not be loaded/);
    assert.match(html, /Retry now/);
    assert.equal(/disabled=""/.test(html), retrying);
    assert.doesNotMatch(html, /HTTP 404/);
  }
});

test('An expired license keeps its recovery message even when version data is absent', () => {
  const html = renderStatus({ licenseStatus: 'expired', licenseMessage: 'Renew the license for this site.' });
  assert.match(html, /Renew the license for this site/);
  assert.doesNotMatch(html, /Version information is temporarily unavailable/);
});

test('License verification dates have their own context and identify overdue checks', () => {
  const html = renderStatus({ latestVersion: '1.0.0', checkedAt: 1750000000, nextCheckAt: 1750021600 });
  assert.match(html, /Version information from the product catalog/);
  assert.match(html, /License verification/);
  assert.match(html, /License last verified/);
  assert.match(html, /License verification due/);
  assert.match(html, /Automatic license verification is overdue/);
  assert.doesNotMatch(html, />Last check<|>Next check</);
});

test('A cached feed failure never claims that the installed version is current', () => {
  const html = renderStatus({ latestVersion: '1.0.0', versionFeedStale: true });
  assert.match(html, /Version information needs refreshing/);
  assert.doesNotMatch(html, /You are up to date|Your installed version is current/);
});

test('Both version fields list Free and Pro, and every available update has its own link', () => {
  const html = renderStatus({
    isPro: true,
    editions: {
      free: { installedVersion: '1.0.0', latestVersion: '1.1.0', updateUrl: '/free' },
      pro: { installedVersion: '2.0.0', latestVersion: '2.1.0', updateUrl: '/pro' },
    },
  });

  assert.match(html, />Installed<.*>Free<.*>1\.0\.0<.*>Pro<.*>2\.0\.0<.*>Latest<.*>Free<.*>1\.1\.0<.*>Pro<.*>2\.1\.0</);
  assert.match(html, /href="\/free"[^>]*>.*View update · Free/);
  assert.match(html, /href="\/pro"[^>]*>.*View update · Pro/);
});

test('An uninstalled edition and an older catalogue do not trigger an update', () => {
  const html = renderStatus({
    editions: {
      free: { installedVersion: '1.0.0', latestVersion: '0.9.9' },
      pro: { latestVersion: '2.0.0', updateUrl: '/pro' },
    },
  });

  assert.match(html, /Congratulations, you are using the latest version/);
  assert.match(html, />Not installed</);
  assert.match(html, />2\.0\.0</);
  assert.doesNotMatch(html, /0\.9\.9|href="\/pro"|New version available/);
});

test('A missing catalogue version is shown as a short hyphen', () => {
  const html = renderStatus({ editions: { free: { installedVersion: '1.0.0', latestVersion: '1.0.0' } } });
  assert.match(html, />-<\/span>/);
  assert.doesNotMatch(html, /—/);
});
