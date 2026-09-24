import React, { useId, useRef } from 'react';
import { createButton } from './button.jsx';
import { createInputComponents } from './input.jsx';
import { createInfoCallout } from './info-callout.jsx';
import { LicenseCard, LicenseCardAlert } from './license-card.jsx';
import { LicenseCardHeader } from './license-card-header.jsx';

const Button = createButton();
const { Input } = createInputComponents();
const InfoCallout = createInfoCallout();

export function InactiveLicenseCard({
    t,
    productName,
    licenseKey,
    saving,
    onActivate,
    onKeyChange,
    onKeyBlur,
    fieldError = '',
    error = '',
    errorTone = 'error',
    message = '',
    keyPlaceholder = 'CCI-XXXX-XXXX',
}) {
    const fieldId = useId();
    const fieldErrorId = useId();
    const formErrorId = useId();
    const inputRef = useRef(null);
    return (
        <LicenseCard className="cci-admin-inactive-license">
            <LicenseCardHeader productName={productName} t={t} />
            <form
                aria-describedby={error ? formErrorId : undefined}
                className="tw-grid tw-gap-3 tw-p-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    if (saving) return;
                    if (onActivate() === false) {
                        window.requestAnimationFrame(() => inputRef.current?.focus());
                    }
                }}
            >
                <p className="!tw-m-0 tw-text-xs tw-leading-5 !tw-text-white/90">
                    {t('Enter your license key to unlock Pro add-ons on this domain.')}
                </p>
                {error && (
                    <LicenseCardAlert id={formErrorId} tone={errorTone} title={errorTone === 'warning' ? undefined : t('License request failed.')} data-license-error="form">
                        {error}
                    </LicenseCardAlert>
                )}
                <div className="tw-grid tw-gap-1.5">
                    <label htmlFor={fieldId} className="tw-text-xs tw-font-semibold tw-leading-4 !tw-text-white">{t('License key')}</label>
                    <Input
                        ref={inputRef}
                        id={fieldId}
                        type="password"
                        value={licenseKey}
                        placeholder={keyPlaceholder}
                        disabled={saving}
                        invalid={Boolean(fieldError)}
                        aria-describedby={fieldError ? fieldErrorId : undefined}
                        onBlur={(event) => {
                            const next = event.relatedTarget;
                            // Validate on submit without moving its button between pointer down and click.
                            if (next?.type === 'submit' && next.form === event.currentTarget.form) return;
                            onKeyBlur?.(event);
                        }}
                        onChange={(event) => onKeyChange(event.target.value)}
                        className="placeholder:!tw-text-cci-nm-muted focus:!tw-outline-white focus:!tw-outline-offset-2 focus-visible:!tw-outline-white focus-visible:!tw-outline-offset-2"
                    />
                    {fieldError && (
                        <LicenseCardAlert id={fieldErrorId} data-license-error="field">
                            {fieldError}
                        </LicenseCardAlert>
                    )}
                </div>
                <Button
                    type="submit"
                    variant="outlineInverse"
                    size="default"
                    disabled={saving}
                    className="tw-w-full"
                >
                    {t(saving ? 'Activating...' : 'Activate license')}
                </Button>
                <p className="!tw-m-0 tw-text-xs tw-leading-5 !tw-text-white/90">
                    {t('Already have a key? Paste it here and activate Pro in seconds.')}
                </p>
                {message && !error && !fieldError && (
                    <InfoCallout tone="info">{message}</InfoCallout>
                )}
            </form>
        </LicenseCard>
    );
}
