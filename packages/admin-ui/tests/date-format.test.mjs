import test from 'node:test';
import assert from 'node:assert/strict';
import { formatAdminDateTime } from '../src/date-format.js';
const config = { locale: 'en_GB', timeZone: 'Europe/Warsaw', dateFormat: 'Y-m-d', timeFormat: 'H:i' };
test('numeric and string timestamps, ISO and local SQL dates use one site format', () => {
    const stamp = Date.parse('2026-09-10T19:09:00Z');
    for (const value of [stamp, stamp / 1000, String(stamp), String(stamp / 1000), '2026-09-10T19:09:00Z', '2026-09-10 21:09:00']) {
        assert.equal(formatAdminDateTime(value, config), '2026-09-10 21:09');
    }
});
test('never checked and invalid values do not become dates', () => {
    for (const value of [null, undefined, '', 0, '0', 'invalid']) assert.equal(formatAdminDateTime(value, config), '');
});
test('calendar-only dates stay on the same day', () => {
    assert.equal(formatAdminDateTime('2026-09-10', config, false), '2026-09-10');
});

test('platform locale and legacy date settings cannot change the shared format', () => {
    for (const options of [
        { locale: 'en_US', dateFormat: 'm/d/Y', timeFormat: 'H:i:s' },
        { locale: 'pl_PL', dateTimeFormat: 'd.m.Y H:i:s' },
        { locale: 'ar', dateFormat: 'j F Y', timeFormat: 'g:i a' },
    ]) {
        const site = { ...options, timeZone: 'Europe/Warsaw' };
        assert.equal(formatAdminDateTime('2026-07-21T20:28:41Z', site), '2026-07-21 22:28');
        assert.equal(formatAdminDateTime('2026-07-22 00:29:27', site), '2026-07-22 00:29');
        assert.equal(formatAdminDateTime('2026-07-22', site, false), '2026-07-22');
    }
});
test('explicit instants respect site time zone, DST, date boundaries and midnight', () => {
    assert.equal(formatAdminDateTime(new Date('2026-01-01T23:00:00Z'), config), '2026-01-02 00:00');
    assert.equal(formatAdminDateTime('2026-09-10T19:09:59+0200', config), '2026-09-10 19:09');
    assert.equal(formatAdminDateTime('2026-03-29T00:30:00Z', config), '2026-03-29 01:30');
    assert.equal(formatAdminDateTime('2026-03-29T01:30:00Z', config), '2026-03-29 03:30');
    assert.equal(formatAdminDateTime('2026-01-01T23:00:00Z', { timeZone: '+05:30' }), '2026-01-02 04:30');
    assert.equal(formatAdminDateTime('2026-01-01T01:00:00Z', { timeZone: '-03:30' }), '2025-12-31 21:30');
});
test('local SQL and calendar values are not shifted through a browser time zone', () => {
    for (const timeZone of ['UTC', 'America/Los_Angeles', 'Pacific/Kiritimati', 'Europe/Warsaw']) {
        assert.equal(formatAdminDateTime('2026-03-29 02:30:59', { timeZone }), '2026-03-29 02:30');
        assert.equal(formatAdminDateTime('2026-09-10', { timeZone }, false), '2026-09-10');
    }
});
test('invalid calendar values and database sentinels stay empty', () => {
    for (const value of ['0000-00-00 00:00:00', '2026-02-29', '2026-04-31', '2026-13-01',
        '2026-00-01', '2026-01-00', '2026-01-01 24:00:00', '2026-01-01 12:60:00',
        '2026-01-01T12:00:60Z', '07/21/2026 22:28:41', NaN, Infinity, -1, {}, new Date(NaN)]) {
        assert.equal(formatAdminDateTime(value, config), '', String(value));
    }
    assert.equal(formatAdminDateTime('2024-02-29 12:00:00', config), '2024-02-29 12:00');
});
test('missing or invalid zone has a deterministic UTC fallback', () => {
    for (const site of [undefined, null, {}, { timeZone: 'invalid/zone' }]) {
        assert.equal(formatAdminDateTime('2026-09-10T19:09:00Z', site), '2026-09-10 19:09');
    }
});
