import React from 'react';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';

export function createProductLogo(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);
  const logo = theme.productLogo || {};

  return function ProductLogo({
    ariaLabel = logo.ariaLabel || 'CCI',
    primary = logo.primary || 'CCI',
    secondary = logo.secondary || '',
    className = '',
    compact = false,
    expandedWidth = 168,
    logoUrl = '',
    iconUrl = '',
    homeUrl = '',
    ...props
  }) {
    const Root = homeUrl ? 'a' : 'div';
    const rootProps = homeUrl
      ? { href: homeUrl }
      : {};
    const rootClassName = cn(
      'tw-flex tw-min-h-[46px] tw-items-center tw-px-2 tw-pb-2',
      homeUrl && 'tw-cursor-pointer tw-rounded-md tw-transition-opacity hover:tw-opacity-80 focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2',
      compact && 'tw-justify-center tw-px-0 tw-pb-0',
      className
    );

    if (logoUrl) {
      return (
        <Root
          className={cn(rootClassName, 'tw-overflow-hidden')}
          aria-label={ariaLabel}
          {...rootProps}
          {...props}
        >
          {compact ? (
            <span className='tw-block tw-h-[42px] tw-w-[42px] tw-overflow-hidden tw-rounded-md tw-bg-white'>
              <img
                src={iconUrl || logoUrl}
                alt=''
                className='tw-block tw-h-[42px] tw-max-w-none'
                style={{ width: iconUrl ? 42 : 74, objectFit: iconUrl ? 'contain' : 'cover', objectPosition: 'left center' }}
              />
            </span>
          ) : (
            <img
              src={logoUrl}
              alt=''
              className='tw-block tw-h-auto tw-max-w-full'
              style={{ width: expandedWidth }}
            />
          )}
        </Root>
      );
    }

    return (
      <Root
        className={cn(rootClassName, 'tw-gap-2.5', compact && 'tw-gap-0')}
        aria-label={ariaLabel}
        {...rootProps}
        {...props}
      >
        <span
          className={cn(
            'tw-relative tw-inline-flex tw-items-end tw-justify-center',
            `tw-bg-${theme.namespace}-brand`
          )}
          style={{ width: 42, height: 42, borderRadius: 12, padding: 8 }}
        >
          <span
            className='tw-relative tw-z-10 tw-block'
            style={{ width: 16, height: 25, transform: 'skewY(10deg)', borderRadius: 5, backgroundColor: '#fff' }}
          />
          <span
            className='tw-block'
            style={{ width: 16, height: 25, marginLeft: -5, transform: 'skewY(10deg)', borderRadius: 5, backgroundColor: 'rgba(255,255,255,.7)' }}
          />
          <span
            className='tw-block'
            style={{ width: 16, height: 25, marginLeft: -5, transform: 'skewY(10deg)', borderRadius: 5, backgroundColor: 'rgba(255,255,255,.7)' }}
          />
          <span
            className={cn(
              'tw-absolute tw-rounded-full',
              `tw-bg-${theme.namespace}-accent`
            )}
            style={{ right: 7, bottom: 7, width: 7, height: 7 }}
          />
        </span>
        {!compact && (
          <span className='tw-grid tw-text-[13px] tw-leading-[1.08]'>
            <strong className={cn('tw-font-bold tw-not-italic', `tw-text-${theme.namespace}-text`)}>{primary}</strong>
            {secondary && <em className={cn('tw-font-bold tw-not-italic', `tw-text-${theme.namespace}-brand`)}>{secondary}</em>}
          </span>
        )}
      </Root>
    );
  };
}
