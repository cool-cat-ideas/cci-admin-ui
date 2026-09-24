import React from 'react';
import { CheckCircle2, ExternalLink, LockKeyhole } from 'lucide-react';
import { cn } from './cn.js';
import { createButton } from './button.jsx';
import { createProBadge } from './pro-badge.jsx';
import { resolveTheme } from './theme.js';

const defaultLabels = {
  requiresPro: 'Requires Pro',
  installed: 'Installed',
  available: 'Available',
  viewInStore: 'View in store',
  comingSoon: 'Coming soon',
};

export function createCatalogComponents(themeName = 'niceMenu', options = {}) {
  const theme = resolveTheme(themeName);
  const Button = createButton(themeName);
  const ProBadge = createProBadge(themeName);
  const labels = { ...defaultLabels, ...(options.labels || {}) };

  function CatalogEmptyState({ icon: Icon, title, description, actionLabel, onAction, embedded = false }) {
    return (
      <div
        className={cn(
          'tw-grid tw-min-h-64 tw-place-items-center tw-gap-3 tw-p-8 tw-text-center',
          embedded
            ? 'tw-col-span-full'
            : 'tw-rounded-md tw-border tw-border-solid tw-bg-white',
          !embedded && theme.border
        )}
      >
        <span
          className={cn(
            'tw-inline-flex tw-h-11 tw-w-11 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-solid [&_svg]:tw-h-5 [&_svg]:tw-w-5',
            theme.borderBrandBorder,
            theme.bgBrandSoft,
            theme.textBrand
          )}
          aria-hidden='true'
        >
          <Icon />
        </span>
        <strong className={cn('tw-text-sm tw-font-semibold', theme.text)}>{title}</strong>
        <p className={cn('tw-m-0 tw-max-w-xl tw-text-sm tw-leading-5', theme.textMuted)}>{description}</p>
        {actionLabel && onAction ? (
          <Button variant='outlineAccent' size='sm' type='button' onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  function CatalogGrid({ children, notice = null }) {
    return (
      <div
        className={cn(
          'tw-grid tw-grid-cols-1 tw-gap-4 tw-rounded-md tw-border tw-border-solid tw-bg-white tw-p-4 sm:tw-gap-5 sm:tw-p-5 xl:tw-grid-cols-2 2xl:tw-grid-cols-3',
          theme.border
        )}
      >
        {notice ? <div className='tw-col-span-full'>{notice}</div> : null}
        {children}
      </div>
    );
  }

  function CatalogProductCard({
    item,
    mode,
    fallbackIcon: FallbackIcon,
    lockedActionUrl = '',
    lockedActionLabel = labels.requiresPro,
    installedLabel = labels.installed,
    availableLabel = labels.available,
    storeLabel = labels.viewInStore,
    onLockedClick,
  }) {
    const isStore = mode === 'store';
    const locked = Boolean(item.locked);
    const pro = Boolean(item.pro);
    const proLabel = item.proLabel || 'Pro';
    const visibleMetaPrimary = isStore ? item.metaPrimary : '';
    const visibleMetaSecondary = isStore ? item.metaSecondary : '';

    return (
      <article
        className={cn(
          'tw-grid tw-min-h-full tw-grid-rows-[auto_minmax(0,1fr)_auto] tw-overflow-hidden tw-rounded-md tw-border tw-border-solid tw-bg-white',
          locked ? theme.borderBrandBorder : 'tw-border-slate-300'
        )}
      >
        <div
          className={cn(
            'tw-relative tw-grid tw-place-items-center tw-overflow-hidden tw-border-0 tw-border-b tw-border-solid tw-bg-white',
            item.screenshot ? 'tw-aspect-[16/10]' : 'tw-min-h-40',
            theme.border,
            theme.textBrand
          )}
          aria-hidden={!item.screenshot}
        >
          {item.screenshot ? (
            <img className='tw-h-full tw-w-full tw-object-cover' src={item.screenshot} alt='' loading='lazy' />
          ) : locked ? (
            <LockKeyhole className='tw-h-10 tw-w-10' />
          ) : (
            <FallbackIcon className='tw-h-10 tw-w-10' />
          )}
          {pro ? <ProBadge className='tw-absolute tw-right-3 tw-top-3'>{proLabel}</ProBadge> : null}
        </div>

        <div className='tw-grid tw-content-start tw-gap-3 tw-p-4'>
          <div className='tw-flex tw-items-start tw-justify-between tw-gap-3'>
            <strong className={cn('tw-text-base tw-font-semibold tw-leading-tight', theme.text)}>{item.title}</strong>
            {item.version ? (
              <span className={cn('tw-text-xs tw-font-semibold', theme.textMuted)}>v{item.version}</span>
            ) : null}
          </div>

          <p className={cn('tw-m-0 tw-text-sm tw-leading-5', theme.textMuted)}>{item.description}</p>

          {locked ? (
            <div
              className={cn(
                'tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-p-3 tw-text-xs tw-leading-5 [&_svg]:tw-mt-0.5 [&_svg]:tw-h-4 [&_svg]:tw-w-4',
                theme.borderBrandBorder,
                theme.bgBrandSoft,
                theme.textBrandStrong
              )}
            >
              <LockKeyhole aria-hidden='true' />
              <span>{item.lockedMessage}</span>
            </div>
          ) : null}

          {visibleMetaPrimary || visibleMetaSecondary ? (
            <div className={cn('tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-text-xs', theme.textMuted)}>
              {visibleMetaPrimary ? (
                <span
                  className={cn(
                    'tw-inline-flex tw-items-center tw-rounded-full tw-border tw-border-solid tw-bg-white tw-px-2 tw-py-1 tw-font-semibold tw-leading-none',
                    theme.border,
                    theme.textMuted
                  )}
                >
                  {visibleMetaPrimary}
                </span>
              ) : null}
              {visibleMetaSecondary ? (
                <strong
                  className={cn(
                    'tw-inline-flex tw-items-center tw-rounded-full tw-border tw-border-solid tw-px-2 tw-py-1 tw-font-semibold tw-leading-none',
                    theme.borderActionBorder,
                    theme.bgActionSoft,
                    theme.textActionText
                  )}
                >
                  {visibleMetaSecondary}
                </strong>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className={cn('tw-border-0 tw-border-t tw-border-solid tw-p-3', theme.border)}>
          {isStore ? (
            item.installed ? (
              <Button variant='outlineAccent' disabled className={`${theme.componentPrefix}-state-full ${theme.componentPrefix}-state-installed`}>
                <CheckCircle2 aria-hidden='true' />
                {installedLabel}
              </Button>
            ) : item.url ? (
              <Button asChild variant='outlineAccent' className={`${theme.componentPrefix}-state-full`}>
                <a href={item.url} target='_blank' rel='noreferrer'>
                  {storeLabel}
                  <ExternalLink aria-hidden='true' />
                </a>
              </Button>
            ) : (
              <Button disabled className={`${theme.componentPrefix}-state-full`}>
                {labels.comingSoon}
              </Button>
            )
          ) : locked ? (
            <LockedAction
              Button={Button}
              componentPrefix={theme.componentPrefix}
              item={item}
              lockedActionUrl={lockedActionUrl}
              lockedActionLabel={lockedActionLabel}
              onLockedClick={onLockedClick}
            />
          ) : item.installed ? (
            <Button variant='outlineAccent' disabled className={`${theme.componentPrefix}-state-full ${theme.componentPrefix}-state-installed`}>
              <CheckCircle2 aria-hidden='true' />
              {installedLabel}
            </Button>
          ) : (
            <span
              className={cn(
                'tw-inline-flex tw-min-h-9 tw-w-full tw-items-center tw-justify-center tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-px-3 tw-text-sm tw-font-semibold [&_svg]:tw-h-4 [&_svg]:tw-w-4',
                theme.borderActionBorder,
                theme.bgActionSoft,
                theme.textActionText
              )}
            >
              <CheckCircle2 aria-hidden='true' />
              {availableLabel}
            </span>
          )}
        </div>
      </article>
    );
  }

  return { CatalogEmptyState, CatalogGrid, CatalogProductCard };
}

function LockedAction({ Button, componentPrefix, item, lockedActionUrl, lockedActionLabel, onLockedClick }) {
  if (onLockedClick) {
    return (
      <Button
        type='button'
        variant='outlineAccent'
        className={`${componentPrefix}-state-full ${componentPrefix}-state-locked`}
        onClick={() =>
          onLockedClick?.({
            featureName: item.title || lockedActionLabel,
            description: item.lockedMessage || '',
            productUrl: item.url || lockedActionUrl,
          })
        }
      >
        <LockKeyhole aria-hidden='true' />
        {lockedActionLabel}
      </Button>
    );
  }

  if (lockedActionUrl) {
    return (
      <Button asChild variant='outlineAccent' className={`${componentPrefix}-state-full ${componentPrefix}-state-locked`}>
        <a href={lockedActionUrl} target='_blank' rel='noreferrer'>
          <LockKeyhole aria-hidden='true' />
          {lockedActionLabel}
        </a>
      </Button>
    );
  }

  return (
    <Button disabled className={`${componentPrefix}-state-full ${componentPrefix}-state-locked`}>
      <LockKeyhole aria-hidden='true' />
      {lockedActionLabel}
    </Button>
  );
}
