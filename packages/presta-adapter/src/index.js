import { createJsonApiClient, normalizeLicensePayload } from '@cci/admin-core';

export function buildPrestaAjaxUrl(apiBase, action, { token = '', params = {} } = {}) {
  const separator = String(apiBase || '').includes('?') || String(apiBase || '').includes('&') ? '&' : '?';
  const query = new URLSearchParams({
    ajax: '1',
    ajaxAction: action,
    ...params,
  });

  if (token) {
    query.set('token', token);
  }

  return `${apiBase}${separator}${query.toString()}`;
}

export function createPrestaAjaxClient({ pluginData, actionMap = {}, defaultErrorMessage = 'CCI PrestaShop request failed' }) {
  return createJsonApiClient({
    actionMap,
    defaultErrorMessage,
    buildUrl: (action, options = {}) => buildPrestaAjaxUrl(pluginData.apiBase, action, {
      token: pluginData.adminToken || pluginData.token || '',
      params: options.params || {},
    }),
    normalizeResponse: (payload) => normalizeLicensePayload(payload, pluginData.apiBase),
  });
}
