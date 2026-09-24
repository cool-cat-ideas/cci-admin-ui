# Connect a platform API

Adapters transport requests. The product defines endpoints, validates input and checks permissions on the server. Never place service credentials or signing material in browser configuration.

## WordPress REST

`createWpRestClient({ nonce, defaultErrorMessage? })` from `@cci/wp-adapter` returns `apiFetch(url, options)`, a promise resolving to parsed JSON. It sends same-origin credentials and an `X-WP-Nonce` header. Options use the Fetch API contract; JSON bodies must be serialized explicitly.

```js
import { createWpRestClient } from '@cci/wp-adapter';

export function createSettingsApi({ settingsUrl, nonce }) {
  const apiFetch = createWpRestClient({ nonce });
  return async function saveSettings(settings) {
    const result = await apiFetch(settingsUrl, {
      method: 'POST',
      body: JSON.stringify(settings),
    });
    // Some product endpoints return a business failure with HTTP 200.
    if (result.success === false) {
      throw new Error(result.warning || result.message || result.error || 'Settings could not be saved.');
    }
    return result;
  };
}
```

`settingsUrl` and `nonce` must be supplied by the host's authorized admin bootstrap. This is an integration example, not the name of a built-in endpoint. Non-2xx responses reject with an `Error` carrying `code`, `status`, `details` and `data`. A successful HTTP response is parsed without business-status normalization; handle `success: false` as above when that is the product's contract.

## PrestaShop AJAX

Install both `@cci/presta-adapter` and its peer `@cci/admin-core`. `createPrestaAjaxClient({ pluginData, actionMap, defaultErrorMessage? })` returns an API function with the same promise-based interface. `pluginData` provides `apiBase` and `adminToken` (or `token`). `actionMap` maps your application paths to controller action names.

```js
import { createPrestaAjaxClient } from '@cci/presta-adapter';

export function createSettingsApi(pluginData) {
  const apiFetch = createPrestaAjaxClient({
    pluginData,
    actionMap: { '/settings': 'saveSettings' },
  });
  return settings => apiFetch('/settings', {
    method: 'POST',
    body: JSON.stringify(settings),
  });
}
```

Use the actual action exposed by the module controller. The adapter sends `ajax=1`, `ajaxAction` and the admin token. `options.params` adds query parameters. The core client rejects both non-2xx responses and JSON with `success: false`; errors expose `code`, `status`, `details` and `data`. `details` contains a backend `warning` when supplied, so prefer that user-facing message over a generic transport message. Keep field mapping in the product controller/view model.

Custom `headers` replace defaults in these adapters through the Fetch options merge. Omit them unless necessary; if supplied, include JSON content type and, for WordPress, the nonce header yourself.

## Generic JSON client

`createJsonApiClient({ buildUrl, actionMap?, normalizeResponse?, defaultErrorMessage? })` from `@cci/admin-core` returns the same API function. `buildUrl(action, options)` is required and returns the request URL. `normalizeResponse(payload)` returns the object used for success detection. The default method is POST; credentials are same-origin. It does not serialize `body` automatically.

`normalizeLicense(rawLicense, apiBase)` adds presentation defaults for `status`, `label`, `canManage` and `apiBase`. `normalizeLicensePayload(response, apiBase)` applies this to an existing `response.license`. Neither function verifies a license or changes the backend's authorization decision.

## Diagnose failures

- A 401/403 requires checking the session, nonce/token and server permission callback.
- HTTP 200 with `success: false` is still a failed operation. Show the backend's message in the form and toast.
- A missing feed URL is configuration failure; do not replace it with demo news.
- A disabled Pro control and a rejected premium endpoint are separate checks. Test both.
