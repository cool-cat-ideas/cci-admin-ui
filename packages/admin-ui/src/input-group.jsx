import React from 'react';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';
import { createButton } from './button.jsx';

const addonAlignClasses = {
  'inline-start': 'tw-order-first',
  'inline-end': 'tw-order-last',
  'block-start': 'tw-order-first tw-w-full',
  'block-end': 'tw-order-last tw-w-full',
};

export function createInputGroupComponents(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);
  const Button = createButton(themeName);

  const InputGroup = React.forwardRef(function InputGroup(
    { className = '', invalid = false, readOnly = false, ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-slot='input-group'
        className={cn(
          `!tw-m-0 !tw-box-border tw-flex !tw-h-10 tw-min-h-10 tw-w-full tw-min-w-0 tw-items-stretch tw-overflow-hidden !tw-rounded-md !tw-border tw-border-solid ${theme.borderImportant} !tw-bg-white !tw-shadow-none tw-transition-colors tw-duration-150`,
          'hover:!tw-border-slate-300',
          `focus-within:${theme.borderBrandImportant} focus-within:!tw-shadow-none focus-within:!tw-outline focus-within:!tw-outline-2 focus-within:tw-outline-offset-0 focus-within:tw-outline-${theme.namespace}-brandSoft`,
          invalid && `${theme.borderDangerImportant} focus-within:${theme.borderDangerImportant} focus-within:tw-outline-${theme.namespace}-dangerBg`,
          readOnly && '!tw-bg-slate-100',
          className
        )}
        {...props}
      />
    );
  });

  const InputGroupInput = React.forwardRef(function InputGroupInput(
    { className = '', invalid = false, style, ...props },
    ref
  ) {
    const isNumber = props.type === 'number';

    return (
      <input
        ref={ref}
        data-slot='input-group-control'
        className={cn(
          `!tw-m-0 !tw-box-border !tw-appearance-none !tw-h-10 tw-min-h-10 tw-min-w-0 tw-flex-1 !tw-border-0 !tw-bg-transparent tw-px-3 tw-py-1 tw-text-sm tw-leading-none ${theme.textImportant} !tw-shadow-none !tw-outline-none placeholder:${theme.textMuted}`,
          'focus:!tw-border-0 focus:!tw-bg-transparent focus:!tw-shadow-none focus:!tw-outline-none focus-visible:!tw-border-0 focus-visible:!tw-bg-transparent focus-visible:!tw-shadow-none focus-visible:!tw-outline-none',
          'read-only:tw-text-slate-500 disabled:tw-cursor-not-allowed disabled:tw-text-slate-500',
          isNumber && 'tw-tabular-nums',
          className
        )}
        style={isNumber ? { MozAppearance: 'textfield', ...style } : style}
        aria-invalid={invalid ? 'true' : props['aria-invalid']}
        {...props}
      />
    );
  });

  const InputGroupTextarea = React.forwardRef(function InputGroupTextarea(
    { className = '', invalid = false, ...props },
    ref
  ) {
    return (
      <textarea
        ref={ref}
        data-slot='input-group-control'
        className={cn(
          `!tw-appearance-none tw-min-h-24 tw-min-w-0 tw-flex-1 tw-resize-y !tw-border-0 !tw-bg-transparent tw-px-3 tw-py-2 tw-text-sm tw-leading-5 ${theme.textImportant} !tw-shadow-none !tw-outline-none placeholder:${theme.textMuted}`,
          'focus:!tw-border-0 focus:!tw-bg-transparent focus:!tw-shadow-none focus:!tw-outline-none focus-visible:!tw-border-0 focus-visible:!tw-bg-transparent focus-visible:!tw-shadow-none focus-visible:!tw-outline-none',
          'read-only:tw-text-slate-500 disabled:tw-cursor-not-allowed disabled:tw-text-slate-500',
          className
        )}
        aria-invalid={invalid ? 'true' : props['aria-invalid']}
        {...props}
      />
    );
  });

  const InputGroupAddon = React.forwardRef(function InputGroupAddon(
    { align = 'inline-start', className = '', ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-slot='input-group-addon'
        className={cn(
          `tw-inline-flex tw-shrink-0 tw-items-center tw-justify-center tw-gap-1 !tw-bg-transparent tw-px-3 tw-text-xs tw-font-semibold tw-leading-none ${theme.textMuted}`,
          addonAlignClasses[align] || addonAlignClasses['inline-start'],
          className
        )}
        {...props}
      />
    );
  });

  function InputGroupText({ className = '', ...props }) {
    return <span data-slot='input-group-text' className={cn('tw-inline-flex tw-items-center tw-whitespace-nowrap', className)} {...props} />;
  }

  function InputGroupButton({ className = '', type = 'button', ...props }) {
    return (
      <Button
        variant='unstyled'
        data-slot='input-group-button'
        type={type}
        className={cn(
          `!tw-appearance-none tw-inline-flex tw-min-h-7 tw-items-center tw-justify-center tw-rounded !tw-border-0 !tw-bg-transparent tw-px-2 tw-text-xs tw-font-semibold ${theme.text} !tw-shadow-none !tw-outline-none tw-transition-colors hover:!tw-bg-white focus:!tw-shadow-none focus:!tw-outline-none focus-visible:!tw-outline focus-visible:!tw-outline-2 focus-visible:tw-outline-${theme.namespace}-brandSoft`,
          className
        )}
        {...props}
      />
    );
  }

  return {
    InputGroup,
    InputGroupInput,
    InputGroupTextarea,
    InputGroupAddon,
    InputGroupText,
    InputGroupButton,
  };
}
