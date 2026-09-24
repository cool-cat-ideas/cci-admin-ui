import React from 'react';
import { createCardComponents } from './card.jsx';
import { createInfoCallout } from './info-callout.jsx';
import { cn } from './cn.js';

const { Card } = createCardComponents();
const InfoCallout = createInfoCallout();

/** License management keeps the same brand surface before and after activation. */
export function LicenseCard({ className = '', children }) {
    return (
        <Card
            as="section"
            className={cn(
                'cci-admin-license-card tw-mt-2 !tw-border-cci-nm-brand !tw-bg-cci-nm-brand !tw-text-white',
                className,
            )}
        >
            {children}
        </Card>
    );
}

// The field/form references this persistent text; submission results are announced by the toast.
export function LicenseCardAlert({ id, title, tone = 'error', children, ...props }) {
    return (
        <InfoCallout id={id} title={title} tone={tone} {...props}>
            {children}
        </InfoCallout>
    );
}
