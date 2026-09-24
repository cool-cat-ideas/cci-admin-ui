import test from 'node:test';
import assert from 'node:assert/strict';
import { createApiError } from '../src/api-error.js';

test('HTTP 200 license rejection preserves backend warning and code', () => {
    const payload = { success: false, warning: 'License has been revoked.', code: 'license_revoked', license: {status: 'inactive'} };
    const error = createApiError(payload, 200, 'Request failed (200).');
    assert.equal(error.message, payload.warning);
    assert.equal(error.code, 'license_revoked');
    assert.equal(error.status, 200);
    assert.equal(error.data, payload);
});
test('WordPress and PrestaShop envelopes preserve public errors', () => {
    assert.equal(createApiError({message: 'License has expired.', code: 'license_expired'}, 403, 'Failed').message, 'License has expired.');
    assert.equal(createApiError({error: 'Invalid license key.', warning: 'Secondary context'}, 400, 'Failed').message, 'Invalid license key.');
    assert.equal(createApiError({error: {message: 'Invalid domain.'}}, 400, 'Failed').message, 'Invalid domain.');
});
test('malformed or missing error text uses transport fallback', () => {
    for (const body of [null, {}, {error: {}, message: ' ', warning: []}]) {
        assert.equal(createApiError(body, 502, 'Service unavailable.').message, 'Service unavailable.');
    }
});
