import React from 'react';
import { Crown, CheckCircle2, CircleMinus, ShieldCheck } from 'lucide-react';
import { createCardComponents } from './card.jsx';
import { StatusBadge } from './status-badge.jsx';

const { CardHeader } = createCardComponents();

/** The same title, status badge and divider for both license-management states. */
export function LicenseCardHeader({ active = false, productName, t }) {
    const StatusIcon = active ? CheckCircle2 : CircleMinus;
    const ProductIcon = active ? Crown : ShieldCheck;
    return (
        <CardHeader className="cci-admin-license-header tw-relative tw-z-10 tw-block tw-px-4 tw-py-4 !tw-border-white/25">
            <div className="tw-grid tw-min-w-0 tw-gap-2">
                <div className="tw-flex tw-min-w-0 tw-items-start tw-gap-2.5">
                    <ProductIcon className="tw-mt-0.5 tw-h-4 tw-w-4 tw-shrink-0 !tw-text-white/90" aria-hidden="true" />
                    <h3 className="!tw-m-0 !tw-text-base !tw-font-semibold !tw-leading-6 !tw-text-white">
                        {productName}
                    </h3>
                </div>
                <StatusBadge
                    active={active}
                    className="tw-inline-flex tw-w-fit tw-max-w-full tw-items-center tw-gap-1.5 tw-text-xs tw-font-semibold tw-normal-case tw-leading-4"
                >
                    <StatusIcon className="tw-h-3.5 tw-w-3.5 tw-shrink-0" aria-hidden="true" />
                    <span>{t(active ? 'License active' : 'License inactive')}</span>
                </StatusBadge>
            </div>
        </CardHeader>
    );
}
