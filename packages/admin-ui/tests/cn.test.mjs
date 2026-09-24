import test from 'node:test';
import assert from 'node:assert/strict';
import { cn } from '../src/cn.js';

test('caller overrides resolve prefixed layout utilities in argument order', () => {
    assert.equal(
        cn('cci-admin-license-header tw-flex tw-px-5 tw-py-4', ['tw-block', { 'tw-px-4': true, 'tw-hidden': false }]),
        'cci-admin-license-header tw-py-4 tw-block tw-px-4',
    );
    assert.equal(cn('tw-bg-white', 'tw-bg-transparent'), 'tw-bg-transparent');
});

test('important theme overrides merge without discarding a different importance level', () => {
    assert.equal(
        cn('!tw-border-cci-nm-border !tw-bg-white', '!tw-border-cci-nm-brand !tw-bg-cci-nm-brand'),
        '!tw-border-cci-nm-brand !tw-bg-cci-nm-brand',
    );
    assert.equal(
        cn('tw-text-cci-nm-text !tw-text-white', '!tw-text-red-900'),
        'tw-text-cci-nm-text !tw-text-red-900',
    );
});

test('arbitrary values and descendant selectors keep the requested final value', () => {
    assert.equal(cn('tw-text-[11px]', 'tw-text-xs'), 'tw-text-xs');
    assert.equal(
        cn('[&_svg]:tw-h-5 [&_svg]:tw-w-5', '[&_svg]:tw-h-4'),
        '[&_svg]:tw-w-5 [&_svg]:tw-h-4',
    );
    assert.equal(
        cn('[&:hover_[data-card-link-title]]:tw-underline', '[&:hover_[data-card-link-title]]:tw-no-underline'),
        '[&:hover_[data-card-link-title]]:tw-no-underline',
    );
});

test('hover and focus remain independent from base and disabled states', () => {
    assert.equal(
        cn('!tw-bg-transparent hover:!tw-bg-white disabled:!tw-bg-slate-100', 'focus-visible:!tw-bg-white'),
        '!tw-bg-transparent hover:!tw-bg-white disabled:!tw-bg-slate-100 focus-visible:!tw-bg-white',
    );
    assert.equal(
        cn('focus-visible:!tw-outline-cci-nm-brand', 'focus-visible:!tw-outline-white'),
        'focus-visible:!tw-outline-white',
    );
});

test('directional border overrides preserve separators and unrelated custom classes', () => {
    assert.equal(
        cn('cci-admin-license-header tw-border-0', 'tw-border-b tw-border-solid tw-border-white/25'),
        'cci-admin-license-header tw-border-0 tw-border-b tw-border-solid tw-border-white/25',
    );
});
