import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';

export function createSelect(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);

  return function Select({
    id,
    value,
    onValueChange,
    options = [],
    placeholder = '',
    disabled = false,
    className = '',
    invalid = false,
    ariaLabel,
  }) {
    return (
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          id={id}
          className={cn(
            `!tw-m-0 !tw-box-border !tw-appearance-none tw-flex !tw-h-10 tw-min-h-10 tw-min-w-0 tw-w-full tw-items-center tw-justify-between tw-gap-2 !tw-rounded-md !tw-border tw-border-solid ${theme.borderImportant} !tw-bg-white tw-px-3 tw-text-sm tw-leading-none ${theme.textImportant} !tw-shadow-none !tw-outline-none tw-transition-colors tw-duration-150`,
            'hover:!tw-border-slate-300 hover:!tw-bg-white',
            `focus:${theme.borderBrandImportant} focus:!tw-bg-white focus:!tw-shadow-none focus:!tw-outline focus:!tw-outline-2 focus:tw-outline-offset-0 focus:tw-outline-${theme.namespace}-brandSoft`,
            `focus-visible:${theme.borderBrandImportant} focus-visible:!tw-bg-white focus-visible:!tw-shadow-none focus-visible:!tw-outline focus-visible:!tw-outline-2 focus-visible:tw-outline-offset-0 focus-visible:tw-outline-${theme.namespace}-brandSoft`,
            'disabled:tw-cursor-not-allowed disabled:!tw-bg-slate-100 disabled:tw-text-slate-500',
            invalid &&
              `${theme.borderDangerImportant} focus:${theme.borderDangerImportant} focus:tw-outline-${theme.namespace}-dangerBg focus-visible:${theme.borderDangerImportant} focus-visible:tw-outline-${theme.namespace}-dangerBg`,
            className
          )}
          aria-label={ariaLabel || placeholder}
        >
          <span className='tw-min-w-0 tw-truncate'>
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown aria-hidden='true' className={`tw-h-4 tw-w-4 tw-shrink-0 ${theme.textMuted}`} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={`tw-z-[100000] tw-max-h-[var(--radix-select-content-available-height)] tw-max-w-[var(--radix-select-content-available-width)] tw-min-w-[var(--radix-select-trigger-width)] tw-overflow-hidden tw-rounded-md tw-border tw-border-solid ${theme.border} tw-bg-white tw-text-sm ${theme.text} tw-shadow-md`}
            position='popper'
            sideOffset={4}
          >
            <SelectPrimitive.ScrollUpButton className={`tw-flex tw-h-6 tw-cursor-default tw-items-center tw-justify-center tw-bg-white ${theme.textMuted}`}>
              <ChevronUp aria-hidden='true' className='tw-h-4 tw-w-4' />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className='tw-p-1'>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={String(option.value)}
                  disabled={option.disabled}
                  className={`!tw-box-border tw-relative tw-flex tw-min-h-8 tw-w-full tw-cursor-default tw-select-none tw-items-center tw-rounded tw-py-1.5 tw-pl-8 tw-pr-2 tw-outline-none data-[disabled]:tw-pointer-events-none data-[disabled]:tw-text-slate-400 data-[highlighted]:${theme.bgBrandSoft} data-[highlighted]:${theme.textBrandStrong}`}
                >
                  <SelectPrimitive.ItemIndicator className='tw-absolute tw-left-2 tw-inline-flex tw-h-4 tw-w-4 tw-items-center tw-justify-center'>
                    <Check aria-hidden='true' />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className={`tw-flex tw-h-6 tw-cursor-default tw-items-center tw-justify-center tw-bg-white ${theme.textMuted}`}>
              <ChevronDown aria-hidden='true' className='tw-h-4 tw-w-4' />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  };
}
