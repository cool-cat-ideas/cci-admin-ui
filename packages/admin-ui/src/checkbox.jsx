import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';
import { createFieldComponents } from './field.jsx';

export function createCheckboxComponents(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);
  const { Field, FieldLabel } = createFieldComponents(themeName);

  const Checkbox = React.forwardRef(function Checkbox({ className = '', ...props }, ref) {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        data-slot='checkbox'
        className={cn(
          '!tw-appearance-none tw-box-border tw-inline-flex tw-h-4 tw-w-4 tw-shrink-0 tw-items-center tw-justify-center tw-self-center tw-align-middle tw-rounded !tw-border tw-border-solid !tw-border-slate-300 !tw-bg-white !tw-p-0 tw-text-white !tw-shadow-none !tw-outline-none tw-transition-colors',
          `focus-visible:!tw-outline focus-visible:!tw-outline-2 focus-visible:tw-outline-offset-1 ${theme.outlineBrand}`,
          'disabled:tw-cursor-not-allowed disabled:tw-opacity-50',
          `data-[state=checked]:${theme.borderBrandImportant} data-[state=checked]:${theme.bgBrandImportant}`,
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check aria-hidden='true' className='tw-h-3 tw-w-3' />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  });

  function CheckboxField({
    checked,
    children,
    className = '',
    disabled = false,
    icon: Icon = null,
    labelClassName = '',
    onCheckedChange,
    onClick,
    ...props
  }) {
    const checkboxId = React.useId();
    const handleClick = (event) => {
      if (typeof onClick === 'function') {
        onClick(event);
      }

      if (
        event.defaultPrevented ||
        disabled ||
        event.target.closest('[data-slot="checkbox"], label, a, button, input, select, textarea')
      ) {
        return;
      }

      if (typeof onCheckedChange === 'function') {
        onCheckedChange(!Boolean(checked));
      }
    };

    return (
      <Field
        className={cn(
          `!tw-box-border tw-flex tw-min-h-9 tw-w-full tw-cursor-pointer tw-items-center tw-gap-2.5 tw-rounded-md tw-border tw-border-solid ${theme.border} tw-bg-white tw-px-3 tw-py-2 tw-text-sm tw-font-medium ${theme.text} tw-transition-colors tw-duration-150 hover:tw-border-slate-300 hover:tw-bg-slate-50 focus-within:tw-outline focus-within:tw-outline-2 focus-within:tw-outline-offset-1 focus-within:tw-outline-${theme.namespace}-brand data-[checked=true]:tw-border-${theme.namespace}-brandBorder data-[checked=true]:${theme.bgBrandSoft}`,
          className
        )}
        data-checked={Boolean(checked)}
        data-disabled={disabled}
        onClick={handleClick}
        orientation='horizontal'
        {...props}
      >
        <Checkbox id={checkboxId} checked={Boolean(checked)} disabled={disabled} onCheckedChange={onCheckedChange} />
        {Icon ? <Icon aria-hidden="true" className={`tw-h-4 tw-w-4 tw-shrink-0 ${theme.textMuted}`} /> : null}
        <FieldLabel
          htmlFor={checkboxId}
          className={cn(
            `tw-min-w-0 tw-truncate tw-text-sm tw-font-medium tw-normal-case tw-leading-5 tw-tracking-normal ${theme.text}`,
            labelClassName
          )}
        >
          {children}
        </FieldLabel>
      </Field>
    );
  }

  return { Checkbox, CheckboxField };
}
