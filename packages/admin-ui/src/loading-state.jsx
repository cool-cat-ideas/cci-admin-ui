import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { resolveTheme } from './theme.js';

export function createLoadingState(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);

  return function LoadingState({ label = 'Loading...', variant = 'block', rows = 3 }) {
    const isTable = variant === 'table';
    const isApp = variant === 'app';

    return (
      <div
        className={`!tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3 tw-p-6 tw-text-center tw-text-${theme.namespace}-muted${
          isApp ? ' tw-min-h-[320px]' : ''
        }`}
        role='status'
        aria-live='polite'
      >
        <span
          className={`tw-inline-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-border-${theme.namespace}-brandBorder tw-bg-${theme.namespace}-brandSoft tw-text-${theme.namespace}-brand`}
          aria-hidden='true'
        >
          <LoaderCircle className='tw-h-5 tw-w-5 tw-animate-spin' />
        </span>
        <span className={`tw-text-sm tw-font-semibold tw-text-${theme.namespace}-muted`}>{label}</span>
        {isTable && (
          <div className='tw-grid tw-w-full tw-gap-2' aria-hidden='true'>
            {Array.from({ length: rows }).map((_, index) => (
              <span key={index} className='tw-h-12 tw-animate-pulse tw-rounded-md tw-bg-slate-100' />
            ))}
          </div>
        )}
      </div>
    );
  };
}
