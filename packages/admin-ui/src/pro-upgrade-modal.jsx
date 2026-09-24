import React from 'react';
import { ArrowUpRight, Crown, KeyRound, X } from 'lucide-react';
import { createButton } from './button.jsx';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';

export function createProUpgradeModal(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);
  const Button = createButton(themeName);

  return function ProUpgradeModal({
    open,
    productName = 'CCI Pro',
    featureName = 'Pro feature',
    description = '',
    productUrl = '',
    productUrlLabel = 'View product page',
    activateLabel = 'Activate license here',
    cancelLabel = 'Maybe later',
    title = '',
    message = '',
    licenseHint = '',
    benefits = [],
    onActivateLicense,
    onClose,
  }) {
    if (!open) {
      return null;
    }

    const dialogTitle = title || `${featureName} is available in Pro`;
    const dialogMessage = message || `This functionality is available in ${productName} Pro.`;
    const hint = licenseHint || 'If you already have a license, activate it in this admin panel to unlock the feature.';

    return (
      <div
        className='tw-fixed tw-inset-0 tw-z-[100000] tw-grid tw-place-items-center tw-bg-slate-950/40 tw-p-4'
        role='presentation'
        data-slot='pro-upgrade-modal'
      >
        <div
          className={cn(
            `tw-w-full tw-max-w-xl tw-overflow-hidden tw-rounded-lg tw-border tw-border-solid ${theme.borderBrandBorder} tw-bg-white tw-shadow-2xl`
          )}
          role='dialog'
          aria-modal='true'
          aria-labelledby={`${theme.componentPrefix}-pro-upgrade-title`}
        >
          <div className='tw-relative tw-overflow-hidden tw-border-0 tw-border-b tw-border-solid tw-border-amber-200 tw-bg-gradient-to-br tw-from-amber-50 tw-via-white tw-to-white tw-px-5 tw-py-5'>
            <button
              type='button'
              className={`tw-absolute tw-right-3 tw-top-3 tw-inline-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid ${theme.border} tw-bg-white tw-p-0 ${theme.textMuted} tw-shadow-none tw-transition-colors hover:tw-bg-slate-50 hover:tw-text-slate-900 focus-visible:tw-outline focus-visible:tw-outline-2 ${theme.outlineBrand}`}
              aria-label='Close'
              onClick={onClose}
            >
              <X aria-hidden='true' className='tw-h-4 tw-w-4' />
            </button>

            <div className='tw-grid tw-gap-3 tw-pr-10'>
              <span className='tw-inline-flex tw-w-max tw-items-center tw-gap-1.5 tw-rounded-full tw-border tw-border-solid tw-border-amber-300 tw-bg-amber-100 tw-px-2.5 tw-py-1 tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-text-amber-800'>
                <Crown aria-hidden='true' className='tw-h-3.5 tw-w-3.5' />
                Pro
              </span>
              <div>
                <h2 id={`${theme.componentPrefix}-pro-upgrade-title`} className={`tw-m-0 tw-text-xl tw-font-semibold tw-leading-tight ${theme.text}`}>
                  {dialogTitle}
                </h2>
                <p className={`tw-m-0 tw-mt-2 tw-text-sm tw-leading-6 ${theme.textMuted}`}>
                  {dialogMessage}
                </p>
              </div>
            </div>
          </div>

          <div className='tw-grid tw-gap-4 tw-p-5'>
            {description ? (
              <p className={`tw-m-0 tw-text-sm tw-leading-6 ${theme.textMuted}`}>
                {description}
              </p>
            ) : null}

            {benefits.length ? (
              <ul className='tw-m-0 tw-grid tw-list-none tw-gap-2 tw-p-0'>
                {benefits.map((benefit) => (
                  <li key={benefit} className={`tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-items-start tw-gap-2 tw-text-sm tw-leading-5 ${theme.text}`}>
                    <span aria-hidden='true' className='tw-mt-2 tw-h-1.5 tw-w-1.5 tw-rounded-full tw-bg-amber-600' />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className='tw-rounded-md tw-border tw-border-solid tw-border-amber-200 tw-bg-amber-50 tw-p-3'>
              <p className='tw-m-0 tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-items-start tw-gap-2 tw-text-sm tw-leading-5 tw-text-amber-900'>
                <KeyRound aria-hidden='true' className='tw-mt-0.5 tw-h-4 tw-w-4' />
                <span>{hint}</span>
              </p>
            </div>
          </div>

          <div className={`tw-flex tw-flex-col-reverse tw-gap-2 tw-border-0 tw-border-t tw-border-solid ${theme.border} tw-bg-slate-50 tw-p-4 sm:tw-flex-row sm:tw-flex-wrap sm:tw-justify-end`}>
            <Button className='tw-whitespace-nowrap' variant='secondary' type='button' onClick={onClose}>
              {cancelLabel}
            </Button>
            {typeof onActivateLicense === 'function' ? (
              <Button className='tw-whitespace-nowrap sm:tw-min-w-[11.25rem]' variant='outlineAccent' type='button' onClick={onActivateLicense}>
                <KeyRound aria-hidden='true' />
                {activateLabel}
              </Button>
            ) : null}
            {productUrl ? (
              <Button className='tw-whitespace-nowrap sm:tw-min-w-[11.25rem]' variant='primary' asChild>
                <a href={productUrl} target='_blank' rel='noreferrer'>
                  {productUrlLabel}
                  <ArrowUpRight aria-hidden='true' />
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    );
  };
}
