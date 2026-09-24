import React from 'react';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';

export function createMetricCard(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);

  return function MetricCard({ icon: Icon, label, value, description, tone = 'default', className = '' }) {
    const isPrimary = tone === 'primary';

    return (
      <div
        className={cn(
          'tw-grid tw-min-h-[104px] tw-grid-cols-[minmax(0,1fr)_auto] tw-items-center tw-gap-3.5 tw-rounded-md tw-border tw-border-solid tw-p-4',
          isPrimary
            ? `tw-border-${theme.namespace}-brand tw-bg-${theme.namespace}-brand tw-text-white`
            : `tw-border-${theme.namespace}-border tw-bg-white tw-text-${theme.namespace}-text`,
          className
        )}
      >
        <div>
          <span
            className={cn(
              'tw-block tw-text-xs tw-font-bold tw-uppercase tw-leading-none tw-tracking-normal',
              isPrimary ? 'tw-text-white/85' : `tw-text-${theme.namespace}-muted`
            )}
          >
            {label}
          </span>
          <strong className='tw-mt-2 tw-block tw-text-[26px] tw-font-semibold tw-leading-none'>{value}</strong>
          <small
            className={cn(
              'tw-mt-2 tw-block tw-text-sm tw-leading-5',
              isPrimary ? 'tw-text-white/85' : `tw-text-${theme.namespace}-muted`
            )}
          >
            {description}
          </small>
        </div>
        {Icon && (
          <span
            className={cn(
              'tw-inline-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-solid [&_svg]:tw-h-5 [&_svg]:tw-w-5',
              isPrimary
                ? 'tw-border-white/25 tw-bg-white/15 tw-text-white'
                : `tw-border-${theme.namespace}-brandBorder tw-bg-${theme.namespace}-brandSoft tw-text-${theme.namespace}-brand`
            )}
            aria-hidden='true'
          >
            <Icon />
          </span>
        )}
      </div>
    );
  };
}
