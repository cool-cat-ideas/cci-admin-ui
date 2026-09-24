import React from 'react';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';

export function createInputComponents(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);
  const baseFocus =
    `focus:${theme.borderBrandImportant} focus:!tw-bg-white focus:!tw-shadow-none focus:!tw-outline focus:!tw-outline-2 focus:tw-outline-offset-0 focus:tw-outline-${theme.namespace}-brandSoft`;
  const baseFocusVisible =
    `focus-visible:${theme.borderBrandImportant} focus-visible:!tw-bg-white focus-visible:!tw-shadow-none focus-visible:!tw-outline focus-visible:!tw-outline-2 focus-visible:tw-outline-offset-0 focus-visible:tw-outline-${theme.namespace}-brandSoft`;
  const invalidFocus =
    `${theme.borderDangerImportant} focus:${theme.borderDangerImportant} focus:tw-outline-${theme.namespace}-dangerBg focus-visible:${theme.borderDangerImportant} focus-visible:tw-outline-${theme.namespace}-dangerBg`;

  const Input = React.forwardRef(function Input({ className = '', invalid = false, style, ...props }, ref) {
    const isNumber = props.type === 'number';
    const isNativeDateTime = ['date', 'datetime-local', 'month', 'time', 'week'].includes(props.type);

    return (
      <input
        ref={ref}
        className={cn(
          `!tw-m-0 !tw-box-border !tw-h-10 tw-min-h-10 tw-w-full tw-min-w-0 !tw-rounded-md !tw-border tw-border-solid ${theme.borderImportant} !tw-bg-white tw-px-3 tw-py-1 tw-text-sm tw-leading-none ${theme.textImportant} !tw-shadow-none !tw-outline-none tw-transition-colors tw-duration-150 placeholder:${theme.textMuted}`,
          isNativeDateTime
            ? '!tw-appearance-auto tw-block [&::-webkit-calendar-picker-indicator]:tw-cursor-pointer'
            : '!tw-appearance-none tw-flex tw-items-center',
          'hover:!tw-border-slate-300 hover:!tw-bg-white',
          baseFocus,
          baseFocusVisible,
          'disabled:tw-cursor-not-allowed disabled:!tw-bg-slate-100 disabled:tw-text-slate-500',
          'read-only:!tw-bg-slate-100 read-only:tw-text-slate-500',
          isNumber && 'tw-tabular-nums',
          invalid && invalidFocus,
          className
        )}
        style={isNumber ? { MozAppearance: 'textfield', ...style } : style}
        aria-invalid={invalid ? 'true' : props['aria-invalid']}
        {...props}
      />
    );
  });

  const Textarea = React.forwardRef(function Textarea({ className = '', invalid = false, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          `!tw-appearance-none tw-flex tw-min-h-24 tw-w-full tw-min-w-0 tw-rounded-md !tw-border tw-border-solid ${theme.borderImportant} !tw-bg-white tw-px-3 tw-py-2 tw-text-sm tw-leading-5 ${theme.textImportant} !tw-shadow-none !tw-outline-none tw-transition-colors tw-duration-150 placeholder:${theme.textMuted}`,
          'hover:!tw-border-slate-300 hover:!tw-bg-white',
          baseFocus,
          baseFocusVisible,
          'disabled:tw-cursor-not-allowed disabled:!tw-bg-slate-100 disabled:tw-text-slate-500',
          invalid && invalidFocus,
          className
        )}
        aria-invalid={invalid ? 'true' : props['aria-invalid']}
        {...props}
      />
    );
  });

  return { Input, Textarea };
}
