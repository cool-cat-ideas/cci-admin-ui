export function normalizeLicense(rawLicense = {}, apiBase = '') {
  const canUse = Boolean(rawLicense.canUse);

  return {
    ...rawLicense,
    apiBase,
    canManage: rawLicense.canManage ?? true,
    status: rawLicense.status || (canUse ? 'active' : 'inactive'),
    label: rawLicense.label || (canUse ? 'PRO' : 'Inactive'),
  };
}

export function normalizeLicensePayload(response = {}, apiBase = '') {
  if (!response.license) {
    return response;
  }

  return {
    ...response,
    license: normalizeLicense(response.license, apiBase),
  };
}

export function resolveMappedAction(path, actionMap = {}) {
  const rawPath = String(path || '');
  const match = Object.keys(actionMap).find((endpoint) => rawPath.endsWith(endpoint) || rawPath.includes(endpoint));

  return match ? actionMap[match] : rawPath.replace(/^\//, '').replace(/\//g, ':');
}

export function createJsonApiClient({
  actionMap = {},
  buildUrl,
  defaultErrorMessage = 'CCI API request failed',
  normalizeResponse = (payload) => payload,
} = {}) {
  if (typeof buildUrl !== 'function') {
    throw new Error('createJsonApiClient requires a buildUrl function.');
  }

  return function apiFetch(path, options = {}) {
    const action = resolveMappedAction(path, actionMap);
    const requestOptions = {
      credentials: 'same-origin',
      method: options.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    };

    return fetch(buildUrl(action, options), requestOptions)
      .then((response) => response.json()
        .catch(() => ({}))
        .then((payload) => {
          const normalized = normalizeResponse(payload || {});

          if (!response.ok || normalized.success === false) {
            const error = new Error(normalized.error || normalized.message || `${defaultErrorMessage} (${response.status}).`);
            error.code = normalized.code || '';
            error.status = response.status;
            error.details = normalized.warning || normalized.details || '';
            error.data = normalized;
            throw error;
          }

          return normalized;
        }));
  };
}
