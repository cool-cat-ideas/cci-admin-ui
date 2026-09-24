# License, version and news panels

Use these panels to present product data. They do not implement entitlement checks or purchase flows. The product owns requests, loading state, translation and persisted settings.

## Show active or inactive access

```jsx
import React from 'react';
import { ActiveLicenseCard, InactiveLicenseCard } from '@cci/admin-ui';

export function LicensePanel({ t, productName, license, form, actions }) {
  if (license.canUse) {
    return <ActiveLicenseCard t={t} productName={productName}
      site={license.site} environment={license.environment}
      saving={form.saving} onDeactivate={actions.deactivate}
      error={form.error} />;
  }
  return <InactiveLicenseCard t={t} productName={productName}
    licenseKey={form.key} saving={form.saving}
    onKeyChange={actions.setKey} onActivate={actions.activate}
    fieldError={form.fieldError} error={form.error} />;
}
```

Here `license`, `form` and `actions` are view-model objects assembled by the product. Map its server response to these fields; `site` is a display string, not a domain chosen by the user to bypass server checks.

| Input | Contract |
| --- | --- |
| `t` | `(message: string) => string`; required translation callback |
| `productName` | Name displayed in the card header |
| `saving` | Boolean disabling submission/deactivation during a request |
| `onDeactivate` | Button callback; the product performs the request and updates state |
| `licenseKey`, `onKeyChange` | Controlled string and `(newKey: string) => void` |
| `onActivate` | Called on submit; return `false` synchronously for invalid input to focus the key field. Otherwise start the asynchronous request. |
| `onKeyBlur` | Optional input blur callback |
| `fieldError` | Inactive card's key validation error, linked to its input |
| `error`, `errorTone` | Form/request error and tone (default `error`; use `warning` only for an actual warning) |
| `message` | Inactive card's optional information message, hidden while an error is shown |
| `keyPlaceholder` | Optional inactive input placeholder; default `CCI-XXXX-XXXX` |

Both states use the same brand surface, header separator and status badge. The activation button is outlined in white; deactivation uses the danger variant. To show a toast as well, render `Notice` at screen level and send it the same message as the card's error.

Do not infer access from the displayed badge. A hidden control is not an authorization check. Every premium operation must be authorized by the product backend, including requests sent directly without the UI.

## Show version status and dates

```jsx
import React from 'react';
import { ProductStatusPanel } from '@cci/admin-ui/product-panels';
import { formatAdminDateTime } from '@cci/admin-ui';

export function VersionPanel({ t, release, license, adminDate }) {
  return <ProductStatusPanel t={t}
    isPro={license.canUse} licenseStatus={license.status}
    installedVersion={release.installed} latestVersion={release.latest}
    checkedAt={release.checkedAt} nextCheckAt={release.nextCheckAt}
    updateUrl={release.updateUrl} adminDate={adminDate} />;
}

const checked = formatAdminDateTime('2026-09-21T10:05:00Z', { timeZone: 'Europe/Warsaw' });
// 2026-09-21 12:05
const published = formatAdminDateTime('2026-09-21', {}, false);
// 2026-09-21
```

`ProductStatusPanel` accepts the shown props plus optional `licenseMessage`, `description` and `expires`. It compares versions and formats dates internally. Pass raw dates, not preformatted locale strings.

`formatAdminDateTime(value, config = {}, includeTime = true)` returns `YYYY-MM-DD HH:mm`, or `YYYY-MM-DD` when `includeTime` is false. It accepts a valid `Date`, positive Unix seconds/milliseconds, numeric timestamp strings, ISO dates with offsets, and SQL-style `YYYY-MM-DD HH:mm:ss`. Zone-free calendar/SQL strings retain their site-local values. Instants use `config.timeZone` (IANA zone or fixed `+HH:mm` offset), falling back to UTC. Invalid/missing values return an empty string; supply the product's empty-state label separately.

## Show news from the product feed

```jsx
import React from 'react';
import {
  ProductNewsView, useProductFeed, normalizeProductNews,
} from '@cci/admin-ui/product-panels';

export function News({ endpoint, locale, adminDate, t }) {
  const feed = useProductFeed(endpoint);
  return <ProductNewsView t={t}
    news={normalizeProductNews(feed.data?.news, locale, adminDate)}
    loading={feed.loading} error={feed.error}
    retrying={feed.loading} onRefresh={feed.refresh} />;
}
```

`endpoint` is the product's public feed URL. `useProductFeed(endpoint)` returns `{ data, loading, error, refresh }`, starts loading on mount, shares concurrent requests and caches successful responses for two minutes. It retries a failure after two minutes; `refresh()` requests again. Stale/error feeds are not treated as a successful empty list.

The response must contain `news: []`. Each item can include `id`, `title`, `excerpt`, `publishedAt`, `kind`, `url` and `content`. `normalizeProductNews(items, locale, adminDate)` filters invalid entries, keeps the first four in feed order, formats dates and accepts only absolute HTTP(S) article URLs without embedded credentials. Kinds are `news`, `release`, `security` and `maintenance`; an unknown kind becomes `news`. `release` describes a product release, not a separate product category.

The shared view provides item separators, article links, hover/focus states, loading, empty and retry states. A missing/invalid article URL leaves the item unlinked. Supply the URL of the full news article, not a product landing page. Full-length articles and archive pagination belong on the website, not inside the admin sidebar.
