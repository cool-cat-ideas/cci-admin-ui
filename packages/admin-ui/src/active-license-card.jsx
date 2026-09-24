import React from 'react';
import { createButton } from './button.jsx';
import { LicenseCard, LicenseCardAlert } from './license-card.jsx';
import { LicenseDetails } from './license-details.jsx';
import { LicenseCardHeader } from './license-card-header.jsx';

const Button = createButton();

/** Shared sidebar license management uses the established primary brand surface and accessible white text. */
export function ActiveLicenseCard({ t, productName, site, environment, saving, onDeactivate, error = '', errorTone = 'error', children }) {
    return (
        <LicenseCard className="cci-admin-active-license">
            {children}
            <LicenseCardHeader active productName={productName} t={t} />
            <div className="tw-grid tw-gap-4 tw-p-4">
                <LicenseDetails
                    site={site}
                    environment={environment}
                    siteLabel={t('Site')}
                    environmentLabel={t('Environment')}
                    className="!tw-m-0 tw-text-sm tw-leading-5"
                    labelClassName="!tw-text-xs !tw-font-normal !tw-text-white/90"
                    valueClassName="!tw-text-white"
                />
                {error && <LicenseCardAlert tone={errorTone} title={errorTone === 'warning' ? undefined : t('License request failed.')} data-license-error="form">{error}</LicenseCardAlert>}
            </div>
            <div className="tw-border-0 tw-border-t tw-border-solid tw-border-white/25 tw-px-4 tw-py-3">
                <Button
                    variant="danger"
                    size="default"
                    className="tw-w-full focus-visible:!tw-outline-white focus-visible:!tw-outline-offset-2"
                    onClick={onDeactivate}
                    disabled={saving}
                >
                    {t(saving ? 'Deactivating...' : 'Deactivate license')}
                </Button>
            </div>
        </LicenseCard>
    );
}
