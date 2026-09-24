import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';

const wpAdminInteractionReset =
  'hover:!tw-rounded-md focus:!tw-rounded-md active:!tw-rounded-md hover:!tw-shadow-none focus:!tw-shadow-none active:!tw-shadow-none focus:!tw-outline-none active:!tw-outline-none';
const solidTextStates =
  '!tw-text-white visited:!tw-text-white hover:!tw-text-white focus:!tw-text-white active:!tw-text-white focus-visible:!tw-text-white disabled:!tw-text-slate-500 disabled:hover:!tw-text-slate-500 disabled:focus:!tw-text-slate-500 disabled:active:!tw-text-slate-500';

export function createButton(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);
  const outlineAccentTextStates =
    `!${theme.textBrandStrong} visited:!${theme.textBrandStrong} ${theme.textBrandStrongHover} focus:${theme.textBrandStrong} active:${theme.textBrandStrong} focus-visible:${theme.textBrandStrong}`;
  const brandButtonStyles = `${theme.borderBrandImportant} ${theme.bgBrandImportant} ${solidTextStates} ${theme.borderBrandStrongImportant} ${theme.bgBrandStrongImportant}`;
  const successButtonStyles = `${theme.borderActionImportant} ${theme.bgActionImportant} ${solidTextStates} ${theme.borderActionStrongImportant} ${theme.bgActionStrongImportant}`;
  const outlineAccentStyles = `${theme.borderBrandBorderImportant} !tw-bg-white ${outlineAccentTextStates} hover:${theme.borderBrandImportant} hover:${theme.bgBrandSoftImportant}`;
  const unstyledButtonReset =
    `!tw-appearance-none !tw-shadow-none !tw-outline-none tw-m-0 tw-cursor-pointer tw-font-[inherit] tw-normal-case tw-no-underline tw-transition-colors tw-duration-150 focus-visible:!tw-outline focus-visible:!tw-outline-2 focus-visible:tw-outline-offset-1 ${theme.outlineBrand}`;
  // Native card links share interaction tokens without inheriting button dimensions.
  const cardLinkReset = [
    '!tw-appearance-none tw-block tw-cursor-pointer tw-font-[inherit] tw-normal-case',
    '!tw-rounded-md !tw-border-0 !tw-bg-transparent !tw-no-underline !tw-shadow-none !tw-outline-none',
    'tw-transition-colors tw-duration-150',
    `${theme.textImportant} ${theme.textBrandStrongHoverImportant} ${theme.textBrandStrongFocusVisibleImportant}`,
    `${theme.bgBrandSoftHoverImportant} ${theme.bgBrandSoftFocusVisibleImportant}`,
    `focus-visible:!tw-outline focus-visible:!tw-outline-2 focus-visible:!tw-outline-offset-2 ${theme.outlineBrand}`,
    '[&_[data-card-link-title]]:!tw-text-inherit [&_[data-card-link-title]]:tw-underline-offset-4',
    '[&:hover_[data-card-link-title]]:tw-underline [&:focus-visible_[data-card-link-title]]:tw-underline',
    '[&:hover_[data-card-link-action]]:!tw-border-current [&:focus-visible_[data-card-link-action]]:!tw-border-current',
  ].join(' ');
  const buttonVariants = cva(
    [
      '!tw-box-border !tw-appearance-none tw-inline-flex tw-cursor-pointer tw-items-center tw-justify-center tw-gap-2',
      '!tw-rounded-md !tw-border tw-border-solid !tw-font-semibold tw-leading-none',
      '!tw-no-underline tw-transition-colors tw-duration-150',
      '!tw-shadow-none !tw-outline-none',
      wpAdminInteractionReset,
      '[&_svg]:tw-h-3.5 [&_svg]:tw-w-3.5 [&_svg]:tw-shrink-0',
      `focus-visible:!tw-outline focus-visible:!tw-outline-2 focus-visible:tw-outline-offset-1 ${theme.outlineBrand}`,
      `disabled:tw-cursor-not-allowed ${theme.disabledBorder} disabled:!tw-bg-slate-100 disabled:tw-text-slate-500`,
    ].join(' '),
    {
      variants: {
        variant: {
          secondary:
            `${theme.borderImportant} !tw-bg-white ${theme.text} hover:!tw-border-slate-300 hover:!tw-bg-slate-50`,
          primary:
            brandButtonStyles,
          save:
            successButtonStyles,
          success:
            successButtonStyles,
          add:
            brandButtonStyles,
          accent:
            brandButtonStyles,
          purple:
            brandButtonStyles,
          ghost:
            `!tw-border-transparent !tw-bg-transparent ${theme.textMuted} hover:${theme.borderImportant} hover:!tw-bg-white hover:${theme.text}`,
          outlineAccent:
            outlineAccentStyles,
          outlineInverse:
            `!tw-border-white !tw-bg-transparent !tw-text-white hover:!tw-bg-white ${theme.textBrandStrongHoverImportant} focus-visible:!tw-bg-white ${theme.textBrandStrongFocusVisibleImportant} focus-visible:!tw-outline-white focus-visible:!tw-outline-offset-2 disabled:!tw-text-slate-500 disabled:hover:!tw-text-slate-500 disabled:hover:!tw-bg-slate-100`,
          builder:
            outlineAccentStyles,
          danger:
            `${theme.borderDangerBorderImportant} !tw-bg-white ${theme.textDanger} hover:${theme.borderDangerBorderImportant} ${theme.bgDangerBgImportant} ${theme.textDangerHover}`,
        },
        size: {
          default: '!tw-h-10 !tw-px-3.5 !tw-text-sm !tw-leading-none',
          sm: '!tw-h-8 !tw-px-2.5 !tw-text-xs !tw-leading-none',
          xs: '!tw-h-7 !tw-px-2 !tw-text-xs !tw-leading-none',
          lg: '!tw-h-11 !tw-px-4 !tw-text-sm !tw-leading-none',
          icon: '!tw-h-9 !tw-w-9 !tw-px-0 !tw-text-sm !tw-leading-none',
          iconSm: '!tw-h-8 !tw-w-8 !tw-px-0 !tw-text-xs !tw-leading-none',
          iconXs: '!tw-h-7 !tw-w-7 !tw-px-0 !tw-text-xs !tw-leading-none',
          iconTiny: '!tw-h-6 !tw-w-6 !tw-px-0 !tw-text-xs !tw-leading-none',
        },
      },
      defaultVariants: {
        variant: 'secondary',
        size: 'default',
      },
    }
  );

  return React.forwardRef(function Button(
    { asChild = false, className = '', variant = 'secondary', size = 'default', type = 'button', children, ...props },
    ref
  ) {
    const Comp = asChild ? Slot : 'button';
    const baseClasses = variant === 'unstyled'
      ? unstyledButtonReset
      : variant === 'cardLink'
        ? cardLinkReset
        : buttonVariants({ variant, size });
    const stateClasses = new Set(String(className || '').split(/\s+/).filter(Boolean));
    const hasState = (state) => stateClasses.has(`${theme.componentPrefix}-state-${state}`);

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        className={cn(
          baseClasses,
          variant === 'add' && `${theme.componentPrefix}-button-add`,
          variant === 'save' && `${theme.componentPrefix}-button-save`,
          hasState('full') && 'tw-w-full',
          hasState('subtle') &&
            `tw-cursor-not-allowed ${theme.borderImportant} !tw-bg-slate-100 tw-text-slate-500 hover:${theme.borderImportant} hover:!tw-bg-slate-100 hover:tw-text-slate-500`,
          hasState('locked') &&
            `tw-cursor-pointer disabled:hover:${theme.borderImportant} disabled:hover:!tw-bg-slate-100`,
          hasState('installed') &&
            `tw-cursor-default ${theme.borderActionBorderImportant} ${theme.bgActionSoftImportant} ${theme.textActionText} hover:${theme.borderActionBorderImportant} hover:${theme.bgActionSoftImportant} ${theme.textActionTextHover}`,
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  });
}
