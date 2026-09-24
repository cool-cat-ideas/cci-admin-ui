import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';
import { createButton } from './button.jsx';

export function createTooltipComponents(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);
  const Button = createButton(themeName);

  const TooltipProvider = TooltipPrimitive.Provider;
  const Tooltip = TooltipPrimitive.Root;
  const TooltipTrigger = TooltipPrimitive.Trigger;

  const TooltipContent = React.forwardRef(function TooltipContent(
    { className = '', sideOffset = 8, children, ...props },
    ref
  ) {
    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            'tw-z-[100000] tw-max-w-72 tw-overflow-hidden tw-rounded-md tw-border tw-border-solid tw-border-slate-900 tw-bg-slate-950 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-leading-5 tw-text-white tw-shadow-md',
            'tw-transition tw-duration-150 tw-ease-out',
            'data-[state=closed]:tw-opacity-0 data-[state=delayed-open]:tw-opacity-100 data-[state=instant-open]:tw-opacity-100',
            'data-[side=bottom]:tw-translate-y-1 data-[side=left]:-tw-translate-x-1 data-[side=right]:tw-translate-x-1 data-[side=top]:-tw-translate-y-1',
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className='tw-fill-slate-950' />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  });

  function TooltipHelp({ text, side = 'top', className = '' }) {
    if (!text) {
      return null;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='unstyled'
            type='button'
            className={cn(
              `tw-inline-flex tw-h-4 tw-w-4 tw-cursor-help tw-items-center tw-justify-center tw-rounded-full tw-border-0 tw-bg-transparent tw-p-0 ${theme.textMuted} tw-shadow-none tw-outline-none tw-transition-colors`,
              `${theme.textBrandStrongHover} focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 ${theme.outlineBrand}`,
              className
            )}
            aria-label={text}
          >
            <Info className='tw-h-4 tw-w-4' aria-hidden='true' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side}>{text}</TooltipContent>
      </Tooltip>
    );
  }

  return { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipHelp };
}
