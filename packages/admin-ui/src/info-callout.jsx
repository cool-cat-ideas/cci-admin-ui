import React from 'react';
import { cn } from './cn.js';
import { getFeedbackTone } from './feedback-tone.js';

export function createInfoCallout() {
  return function InfoCallout({ title, children, icon, actions = null, tone = 'info', className = '', ...props }) {
    const feedback = getFeedbackTone(tone);
    const Icon = feedback.Icon;
    return (
      <div
        data-cci-feedback={feedback.name}
        {...props}
        className={cn(
          'tw-grid tw-min-w-0 tw-grid-cols-[auto_minmax(0,1fr)] tw-items-start tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-p-3',
          feedback.surface,
          className
        )}
      >
        <span className='tw-inline-flex tw-shrink-0 [&_svg]:tw-h-5 [&_svg]:tw-w-5 [&_svg]:tw-shrink-0'>
          {icon || <Icon aria-hidden='true' />}
        </span>
        <div className='tw-grid tw-min-w-0 tw-gap-1 tw-break-words !tw-text-inherit'>
          {title ? <strong className='tw-text-sm tw-leading-5 !tw-text-inherit'>{title}</strong> : null}
          {children ? <div className='tw-text-sm tw-leading-6'>{children}</div> : null}
          {actions ? <div className='tw-mt-1 tw-flex tw-flex-wrap tw-gap-2'>{actions}</div> : null}
        </div>
      </div>
    );
  };
}
