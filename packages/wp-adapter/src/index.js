export function createWpRestClient({ nonce = '', defaultErrorMessage = 'CCI WordPress request failed' } = {}) {
  return function apiFetch(path, options = {}) {
    return fetch(path, {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce,
        ...(options.headers || {}),
      },
      ...options,
    }).then((response) => {
      if (!response.ok) {
        return response.json()
          .catch(() => ({}))
          .then((errorPayload) => {
            const error = new Error(errorPayload.message || errorPayload.code || `${defaultErrorMessage} (${response.status}).`);

            error.code = errorPayload.code || '';
            error.status = response.status;
            error.details = errorPayload.details || errorPayload.data?.details || '';
            error.data = errorPayload.data || {};

            throw error;
          });
      }

      return response.json();
    });
  };
}
