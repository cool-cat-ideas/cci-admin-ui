import React from 'react';

/** License identity stays readable even in a narrow product sidebar. */
export function LicenseDetails({ site, environment, siteLabel, environmentLabel, className = '', labelClassName = '', valueClassName = '' }) {
    const rows = [[siteLabel, site], [environmentLabel, environment]].filter(([, value]) => value);
    if (!rows.length) return null;

    return (
        <dl className={`tw-m-0 tw-grid tw-min-w-0 tw-gap-2.5 ${className}`}>
            {rows.map(([label, value], index) => (
                <div key={index} className="tw-grid tw-min-w-0 tw-gap-0.5">
                    <dt className={`tw-m-0 tw-font-normal ${labelClassName}`}>{label}</dt>
                    <dd className={`tw-m-0 tw-min-w-0 tw-font-semibold ${valueClassName}`}
                        style={{ overflowWrap: 'anywhere', whiteSpace: 'normal' }} dir="auto">{value}</dd>
                </div>
            ))}
        </dl>
    );
}
