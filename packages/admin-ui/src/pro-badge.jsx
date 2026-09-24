import React from 'react';
import { Crown } from 'lucide-react';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';

export function createProBadge(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);

  return function ProBadge({ children = 'Pro', className = '', icon = true, ...props }) {
    return (
      <span
        data-slot='pro-badge'
        className={cn(
          'tw-inline-flex tw-w-max tw-items-center tw-gap-1 tw-rounded-full tw-border tw-border-solid tw-border-amber-300 tw-bg-amber-50 tw-px-2 tw-py-1 tw-text-xs tw-font-bold tw-uppercase tw-leading-none tw-text-amber-700',
          className
        )}
        {...props}
      >
        {icon ? <Crown aria-hidden='true' className='!tw-h-3 !tw-w-3 tw-shrink-0' /> : null}
        {children}
      </span>
    );
  };
}
