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

const softTones = {
    neutral: 'tw-border-cci-nm-statusNeutralBorder tw-bg-cci-nm-statusNeutralBg tw-text-cci-nm-statusNeutralText',
    success: 'tw-border-cci-nm-statusSuccessBorder tw-bg-cci-nm-successSoftBg tw-text-cci-nm-successSoftText',
    info: 'tw-border-cci-nm-statusInfoBorder tw-bg-cci-nm-statusInfoBg tw-text-cci-nm-infoText',
    warning: 'tw-border-cci-nm-statusWarningBorder tw-bg-cci-nm-statusWarningBg tw-text-cci-nm-warningText',
    danger: 'tw-border-cci-nm-statusDangerBorder tw-bg-cci-nm-statusDangerBg tw-text-cci-nm-dangerText',
    brand: 'tw-border-cci-nm-statusBrandBorder tw-bg-cci-nm-statusBrandBg tw-text-cci-nm-brandStrong',
};

/** Shared status badge. Existing active/inactive badges keep their publication colors. */
export function StatusBadge({ active, tone, variant = 'default', children, className = '', ...props }) {
    const palette = variant === 'soft' ? softTones : tones;
    return <span {...props} data-slot="status-badge" data-variant={variant} className={cn(
        'tw-inline-flex tw-items-center tw-whitespace-nowrap tw-border tw-border-solid tw-px-2 tw-text-xs',
        variant === 'soft'
            ? 'tw-rounded-md tw-py-0.5 tw-font-semibold tw-normal-case tw-leading-4'
            : 'tw-rounded-full tw-py-1 tw-font-bold tw-uppercase',
        palette[tone] || palette[active ? 'success' : 'neutral'], className,
    )}>{children}</span>;
}
