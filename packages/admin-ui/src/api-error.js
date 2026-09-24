/** Preserve public API errors, including PrestaShop failures returned with HTTP 200. */
export function createApiError(payload, status, fallbackMessage) {
    const body = payload && typeof payload === 'object' ? payload : {};
    const firstText = (...values) => values.find(value => typeof value === 'string' && value.trim())?.trim() || '';
    const message = firstText(body.error, body.error?.message, body.message, body.warning, body.data?.message, fallbackMessage);
    const error = new Error(message);
    error.code = firstText(body.code, body.errorCode, body.data?.code);
    error.status = status;
    error.details = firstText(body.details, body.data?.details, body.warning);
    error.data = body.data || body;
    return error;
}
