import React from 'react';
import { cn } from './cn.js';

/** Shared publication/activation badge. Products provide translated labels. */
export function StatusBadge({ active, children, className = '' }) {
    return (
        <span
            className={cn(
                active
                    ? 'tw-rounded-full tw-border tw-border-solid tw-border-cci-nm-successBorder tw-bg-cci-nm-successBg tw-px-2 tw-py-1 tw-text-xs tw-font-bold tw-uppercase tw-text-cci-nm-successText'
                    : 'tw-rounded-full tw-border tw-border-solid tw-border-cci-nm-border tw-bg-cci-nm-surfaceMuted tw-px-2 tw-py-1 tw-text-xs tw-font-bold tw-uppercase tw-text-cci-nm-muted',
                className,
            )}
        >
            {children}
        </span>
    );
}
