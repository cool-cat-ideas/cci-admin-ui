import React from 'react';
import { cn } from './cn.js';

const tones = {
    neutral: 'tw-border-cci-nm-border tw-bg-cci-nm-surfaceMuted tw-text-cci-nm-muted',
    success: 'tw-border-cci-nm-successBorder tw-bg-cci-nm-successBg tw-text-cci-nm-successText',
    info: 'tw-border-cci-nm-infoBorder tw-bg-cci-nm-infoBg tw-text-cci-nm-infoText',
    warning: 'tw-border-cci-nm-warningBorder tw-bg-cci-nm-warningBg tw-text-cci-nm-warningText',
    danger: 'tw-border-cci-nm-dangerBorder tw-bg-cci-nm-dangerBg tw-text-cci-nm-dangerText',
    brand: 'tw-border-cci-nm-brandBorder tw-bg-cci-nm-brandSoft tw-text-cci-nm-brandStrong',
};

/** Shared status badge. Existing active/inactive badges keep their publication colors. */
export function StatusBadge({ active, tone, children, className = '', ...props }) {
    return <span {...props} data-slot="status-badge" className={cn(
        'tw-inline-flex tw-items-center tw-whitespace-nowrap tw-rounded-full tw-border tw-border-solid tw-px-2 tw-py-1 tw-text-xs tw-font-bold tw-uppercase',
        tones[tone] || tones[active ? 'success' : 'neutral'], className,
    )}>{children}</span>;
}
